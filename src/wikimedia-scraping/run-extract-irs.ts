import * as cheerio from "cheerio";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { scrapedIncidentReportsDir } from "./run-scrape-irs.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { incidentReportBaseURL } from "./incident-reports.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { fastHash, saveOverExistingYAML } from "./util.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type GeneratedIR = {
  gen_id: string;
  gen_reportURL: string;
  gen_localReportURL: string;
  gen_dates: {
    gen_hash: string;
    date: string;
  }[];
  items: {
    gen_hash: string;
    gen_context_text: string;
    gen_context_md: string;
    gen_context_links: {
      gen_hash: string;
      gen_link: string;
      link_redirect?: string;
      google_ai?: string;
    }[];
  }[];
  item_extraction_notes?: string;
};

function getDatesFromFileName(str: string): string[] {
  let results: string[] = [];

  const dateRegExp = /(\d{4}-?\d{2}-?\d{2})/g;
  let matches = str.matchAll(dateRegExp);
  for (const match of matches) {
    let date = match[1];
    if (date.includes("-")) {
      results.push(date);
    } else {
      let formattedDate = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
      results.push(formattedDate);
    }
  }

  return results.sort();
}

export const irOutputDir = join(__dirname, "..", "..", "data", "wikimedia-incident-reports-extract");

// Entry point to scrape
async function findAIsInReports() {
  console.log(chalk.yellow("Starting findAIsInReports()"));

  let dir = readdirSync(scrapedIncidentReportsDir).filter((f) => f.endsWith(".html"));

  let numHasActionables = 0;
  let numHasActionableLIs = 0;
  let numWithoutH2s = 0;

  // deterministic processing
  dir.sort();
  //dir = dir.reverse().slice(0, 5);

  const nhm = new NodeHtmlMarkdown();

  dir.forEach((reportFileName) => {
    const fileData = readFileSync(join(scrapedIncidentReportsDir, reportFileName));
    const $ = cheerio.load(fileData);

    const lis: { text: string; html: string }[] = [];

    let actionableHeading = $("div.mw-heading:has(h2#Actionables)").get()[0];
    if (actionableHeading) {
      let next = $(actionableHeading).nextUntil("div.mw-heading2").get();

      let hasActionableLIs = false;

      next.forEach((n) => {
        if (n.tagName == "ul") {
          hasActionableLIs = true;
          const actions = n.childNodes
            .map((c) => ({ text: $(c).text().trim(), html: $(c).html()! }))
            .filter((t) => t.text.length > 3); // remove some new lines which get picked up
          lis.push(...actions);
        }
      });

      if (hasActionableLIs) numHasActionableLIs++;
    }

    const h2s: string[] = [];
    $("h2").each((_idx, el) => {
      const title = $(el).text();

      if (title.includes("Actionables")) numHasActionables++;

      h2s.push(title);
    });

    if (h2s.length == 0) numWithoutH2s++;

    const gen_id = reportFileName.slice(0, reportFileName.length - ".html".length);
    const gen_dates = getDatesFromFileName(reportFileName).map((date) => ({
      gen_hash: fastHash(date),
      date,
    }));
    const yaml: GeneratedIR = {
      gen_id,
      gen_reportURL: incidentReportBaseURL + "/wiki/Incidents/" + gen_id,
      gen_localReportURL: `file://./../wikimedia-incident-reports/${gen_id}.html`,
      gen_dates,
      items: lis.map((li) => {
        const gen_context_text = li.text.replaceAll(/(\r\n|\n|\r)/gm, ""); // trim any new lines
        const gen_context_html = li.html;
        const gen_context_md = nhm.translate(gen_context_html);

        const $Link = cheerio.load(gen_context_html);
        const gen_context_links = $Link("a")
          .map(function () {
            return $Link(this).attr("href");
          })
          .get()
          .map((x) => x.split("%")[0]) // trim any extra garbage in url like %22 in 2025-03-12_cirrus-streaming-updater_overloaded_ES_Cluster
          /*.split(" ")
          .filter((w) => w.startsWith("http"))*/
          .map((gen_link) => ({ gen_hash: fastHash(gen_link), gen_link }));

        return {
          gen_hash: fastHash(gen_context_text),
          gen_context_text,
          //gen_context_html,
          gen_context_md,
          gen_context_links,
        };
      }),
    };

    saveOverExistingYAML(join(irOutputDir, yaml.gen_id + ".yaml"), yaml);
  });

  const summary = {
    numHasActionables,
    numHasActionableLIs,
    numWithoutH2s,
    numReports: dir.length,
  };

  writeFileSync(join(irOutputDir, "summary.json"), JSON.stringify(summary));
}

//await findAIsInReports();
