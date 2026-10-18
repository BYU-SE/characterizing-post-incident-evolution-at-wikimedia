import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { delay, fastHash, saveOverExistingYAML } from "./util.js";
import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const phabricatorScrapedDir = join(__dirname, "..", "..", "data", "wikimedia-phabricator");
export const phabricatorExtractedDir = join(__dirname, "..", "..", "data", "wikimedia-phabricator-extract");

export type GeneratedTask = {
  gen_id: string;
  gen_taskURL: string;

  gen_title: string;
  gen_description: string;
  gen_status: string;
  gen_priority: string;
  gen_numComments: number;
  gen_createdDate: string;

  gen_details_mrs: {
    // TODO: Include the gitlab ones
    gen_hash: string;
    gen_link: string;
  }[];

  gen_related_tasks: {
    gen_hash: string;
    gen_link: string;
    gen_relation: string;
  }[];

  gen_mentioned_tasks: {
    gen_hash: string;
    gen_link: string;
  }[];

  gen_timeline_items: {
    gen_hash: string;
    gen_date: string;
    gen_headlines: string[]; // must be an array for when there is a timeline group
    gen_body?: string;
  }[];
};

export async function fetchPhabricator(phabricatorLink: string) {
  let id = phabricatorLink.slice("https://phabricator.wikimedia.org/".length);
  let sanitizedFileName = join(phabricatorScrapedDir, `${cleanPhabricatorID(id)}.html`);

  if (existsSync(sanitizedFileName)) return;

  console.log("Fetching", phabricatorLink);

  let resp = await fetch(phabricatorLink, {
    headers: {
      "User-Agent":
        "byu.edu Software Engineering Lab - Understanding Post-Incident Changes Scraping Bot (matt4530@byu.edu)",
    },
  });
  let text = await resp.text();

  writeFileSync(sanitizedFileName, text);

  let secondsToWait = 15 + Math.floor(Math.random() * 5);
  await delay(secondsToWait * 1000);
}

function cleanPhabricatorID(str: string) {
  str = str.replaceAll(":", "_");
  str = str.replaceAll("/", "_");
  str = str.replaceAll("\\", "_");

  if (str.includes("#")) str = str.slice(0, str.indexOf("#"));
  return str;
}

// *****************************************************************************
export async function extractPhabricatorByLink(phabricatorLink: string): Promise<void> {
  const unsanitizedID = phabricatorLink.slice("https://phabricator.wikimedia.org/".length);
  const phabId = cleanPhabricatorID(unsanitizedID);
  return extractPhabricatorByPhabId(phabId);
}
export async function extractPhabricatorByPhabId(phabId: string): Promise<void> {
  const sanitizedFileName = join(phabricatorScrapedDir, `${phabId}.html`);
  const fileData = readFileSync(sanitizedFileName);
  const $ = cheerio.load(fileData);

  // merge requests listed at the top, from both gitlab and gerrit
  const mrAnchors = extractMrs($);

  // task graph listed in middle, other phab links
  const taskAnchors = extractTaskGraph($, phabId);

  // task graph listed in middle, other phab links
  const taskMentions = extractTaskMentions($);

  const timelineItems = extractTimeline($);

  const gen_id = phabId;
  let yaml: GeneratedTask = {
    gen_id,
    gen_taskURL: "https://phabricator.wikimedia.org/" + gen_id,
    gen_title: getTitle($),
    gen_status: getStatus($),
    gen_priority: getPriority($),
    gen_numComments: getNumComments($),
    gen_createdDate: getCreatedDate($),

    gen_details_mrs: mrAnchors.map((e) => {
      const gen_link = e.text;
      return {
        gen_hash: fastHash(gen_link),
        gen_link,
      };
    }),

    gen_related_tasks: taskAnchors.map((e) => {
      const gen_link = e.text;
      return {
        gen_hash: fastHash(gen_link),
        gen_link,
        gen_relation: e.relation,
      };
    }),

    gen_mentioned_tasks: taskMentions.map((e) => {
      return {
        gen_hash: fastHash(e.text),
        gen_link: e.text,
      };
    }),

    gen_description: extractDescription($),

    gen_timeline_items: timelineItems,
  };

  saveOverExistingYAML(join(phabricatorExtractedDir, yaml.gen_id + ".yaml"), yaml);
}

function extractMrs($: cheerio.CheerioAPI) {
  return $(".phui-property-list-text-content .aphront-table-view a")
    .map(function () {
      return $(this).attr("href");
    })
    .get()
    .filter(
      (url) =>
        url.startsWith("https://gitlab.wikimedia.org/repos/") ||
        url.startsWith("https://gerrit.wikimedia.org/r/c/")
    )
    .map((url) => ({ text: url }));
}

function extractTaskGraph($: cheerio.CheerioAPI, phabId: string) {
  let hasSeenSelf = false;
  let taskAnchors = $(".object-graph-table tr")
    .map(function () {
      let children = $(this).children().get();

      // if the format isn't what we expect, lets just exit early
      if (children.length < 6) return { relation: "", text: "", href: undefined };

      let relationClasses = $(children[0].childNodes[0]).attr("class")?.split(" ") || [];
      let href = $(children[5].childNodes[2]).prop("href");
      let text = "https://phabricator.wikimedia.org" + href;

      let relation = "";
      if (href == "/" + phabId) {
        relation = "self";
        hasSeenSelf = true;
      } else if (relationClasses.includes("fa-chevron-circle-down")) {
        relation = "direct subtask";
      } else if (relationClasses.includes("fa-chevron-circle-up")) {
        relation = "direct parent";
      } else if (!hasSeenSelf) {
        relation = "parent";
      } else {
        relation = "subtask";
      }

      return { relation, text, href };
    })
    .get();

  // remove the header row or anything else we don't expect (like ... when there are lots of connected graph)
  taskAnchors = taskAnchors.filter((a) => !!a.href);
  return taskAnchors;
}

function extractTaskMentions($: cheerio.CheerioAPI) {
  const mentions = $(".phui-property-list-properties").get()[0];
  if (!mentions) return [];

  const blockOne = $(mentions.childNodes[0]).text();
  const blockTwo = $(mentions.childNodes[2]).text();

  let ref: cheerio.Cheerio<any> | null = null;
  if (blockOne.startsWith("Mentioned Here")) {
    ref = $(mentions.childNodes[1]);
  } else if (blockTwo.startsWith("Mentioned Here")) {
    ref = $(mentions.childNodes[3]);
  } else {
    return [];
  }

  if (!ref) return [];

  return ref
    .children("span")
    .children("a")
    .get()
    .map((x) => ({ text: "https://phabricator.wikimedia.org" + $(x).attr("href")! }));
}
function getPriority($: cheerio.CheerioAPI) {
  const headerClasses = $(".phui-header-icon").attr("class")?.split(" ") || [];
  if (headerClasses.includes("red")) return "High";
  else if (headerClasses.includes("orange")) return "Medium";
  else if (headerClasses.includes("yellow")) return "Low";
  else if (headerClasses.includes("sky")) return "Lowest";
  else if (headerClasses.includes("violet")) return "Needs Triage";
  else if (headerClasses.includes("pink")) return "Unbreak Now!";
  return "other";
}
function getTitle($: cheerio.CheerioAPI): string {
  return $(".phui-header-header").first().text().trim();
}

const storyPointsRegex = /\s*\d+\s*Estimated Story Points$/g;
const bugReportRegex = /\s*BUG REPORT$/g;
const spikeRegex = /\s*Spike$/g;
const releaseRegex = /\s*Release$/g;
const featureRegex = /\s*Feature$/g;
const securityRegex = /\s*Security$/g;
const productionErrorRegex = /\s*PRODUCTION ERROR$/g;
function getStatus($: cheerio.CheerioAPI): string {
  let statuses = $(".phui-header-subheader .phui-tag-core").text(); //.split(",").map(x=>x.trim());
  statuses = statuses.replaceAll(storyPointsRegex, "");
  statuses = statuses.replaceAll(bugReportRegex, "");
  statuses = statuses.replaceAll(spikeRegex, "");
  statuses = statuses.replaceAll(releaseRegex, "");
  statuses = statuses.replaceAll(featureRegex, "");
  statuses = statuses.replaceAll(securityRegex, "");
  statuses = statuses.replaceAll(productionErrorRegex, "");
  return statuses;
}

function getNumComments($: cheerio.CheerioAPI): number {
  // includes bot comments
  return $(".phui-timeline-inner-content").get().length;
}

function getCreatedDate($: cheerio.CheerioAPI): string {
  // the first timeline extra is always "XXXX created this task."
  return $(".phui-curtain-object-ref-view-epoch-cell .print-only").first().text();
}

function extractTimeline($: cheerio.CheerioAPI): GeneratedTask["gen_timeline_items"] {
  const nhm = new NodeHtmlMarkdown();

  const groups = $(".phui-timeline-group").get();

  if (groups.length == 0) return [];

  return groups.map((e, index) => {
    const gen_hash = $(e).find(".phabricator-anchor-view").attr("id")!;

    const gen_headlines = $(e)
      .find(".phui-timeline-title")
      .get()
      .map((e, index) => $(e).text());
    if (gen_headlines.length > 0) {
      const parts = gen_headlines[0].split(".");
      if (parts.length > 0) {
        parts.pop();
        gen_headlines[0] = parts.join(".") + ".";
      }
    }
    const gen_date = $(e).find(".print-only").text().trim();
    const bodyHTML = $(e).find(".phui-timeline-core-content").html() || "";
    const gen_body = nhm.translate(bodyHTML);
    return {
      gen_hash,
      gen_date,
      gen_headlines,
      gen_body,
    };
  });
}

export function extractDescription($: cheerio.CheerioAPI): string {
  const nhm = new NodeHtmlMarkdown();

  // Find the phui-main-column, then look for phui-box elements
  const mainColumn = $(".phui-main-column");
  const boxes = mainColumn.find(".phui-box");

  // Look for a phui-box that has a "Description" header
  let descriptionBox = null;
  boxes.each((index, box) => {
    const headerSpan = $(box).find("span.phui-header-header");
    if (headerSpan.text().trim() === "Description") {
      descriptionBox = box;
      return false; // break the loop
    }
  });

  // If no description box found, return empty string
  if (!descriptionBox) {
    return "";
  }

  // Extract the description content from phui-property-list-text-content
  const descriptionHTML = $(descriptionBox).find("div.phui-property-list-text-content").html() || "";

  return nhm.translate(descriptionHTML).trim();
}
