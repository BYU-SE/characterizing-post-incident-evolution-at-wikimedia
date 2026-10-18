import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { partition, uniq, unique } from "underscore";
import { FlatTaskEntry, Task } from "../lib/task.js";
import { IR } from "../lib/ir.js";
import { CodeReview, FlatCREntry } from "../lib/code-review.js";
import { TaskBucketResult, TimeBucket } from "./bucket-types.js";
import Papa from "papaparse";
import { CommitLogEntry, gitLogDir, projectToGitLogMap } from "../wikimedia-scraping/git-log-to-json.js";
import { RepoSummary, SummaryOfLifecycle } from "./summary-types.js";
import { gerritScrapedDir } from "../wikimedia-scraping/gerrit.js";
import { phabricatorScrapedDir } from "../wikimedia-scraping/phabricator.js";
import { createDepthTracker } from "../lib/depth-tracker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: Do we enforce this for Commits, CRs, and Tasks?
const acceptStartDate = +new Date("2011-05-24");
const acceptEndDate = +new Date("2025-04-01");

const repoSummary = JSON.parse(readFileSync(join(__dirname, "repo_summary.json"), "utf-8")) as RepoSummary;
const lifeycleSummary = JSON.parse(
  readFileSync(join(__dirname, "lifecycle_summary.json"), "utf-8")
) as SummaryOfLifecycle;
/* 
   ===== Commits =====
We want a CSV with all commits tagged as incident or not. Exports the following properties
  1. Size of commits (num files_changed, num insertions, num deletions)
  2. Merge
  3. File extension types
*/

const fileExtensionMap: Record<string, string> = {
  apache: "config",
  cfg: "config",
  cnf: "config",
  conf: "config",
  config: "config",
  crt: "config",
  default: "config",
  directors: "config",
  inc: "config",
  ini: "config",
  init: "config",
  my: "config",
  "options-3": "config",
  properties: "config",
  rsyslog: "config",
  service: "config",
  sls: "config",
  systemd: "config",
  vcl: "config",
  yaml: "config", //  unsure
  "yaml-3": "config", //  unsure
  yml: "config", //  unsure
  dat: "data", //  unsure
  fixtures: "data", //  unsure
  json: "data", //  unsure
  geojson: "data", //  unsure
  tilejson: "data", //  unsure
  schema: "data", //  unsure
  hql: "data", //  unsure
  sql: "data", //  unsure
  sqlite: "data", //  unsure
  sqlite3: "data", //  unsure
  sparksql: "data", //  unsure
  mysql: "data", //  unsure
  query: "data", //  unsure
  txt: "data", //  unsure
  xml: "data", //  unsure
  pbf: "data", //  unsure
  "xml-3": "data", //  unsure
  erb: "scripting",
  lua: "scripting",
  php: "scripting",
  pp: "scripting",
  pyi: "scripting",
  py: "scripting",
  rb: "scripting",
  sh: "scripting", // unsure
  cmd: "scripting", // unsure
  h: "scripting",
  o: "scripting",
  c: "scripting",
  cc: "scripting",
  d: "scripting", // unsure
  ts: "scripting",
  j: "scripting", // unsure (possibly git shortcutting .js?)
  js: "scripting",
  jst: "scripting",
  npm: "scripting", // unsure
  npmignore: "scripting", // unsure
  eslintrc: "scripting", // unsure
  header: "scripting",
  cmake: "scripting",
  cpp: "scripting",
  scala: "scripting",
  coffee: "scripting", // unsure
  travis: "scripting", // unsure
  test: "scripting", // unsure
  tests: "scripting", // unsure
  spec: "scripting", // unsure
  pug: "scripting", // unsure
  expected: "scripting", // unsure
  expectf: "scripting", // unsure
  expect: "scripting", // unsure
  skipif: "scripting", // unsure
  phpcs: "scripting", // unsure
  bzl: "scripting",
  java: "scripting",
  jar: "scripting",
  "sh-3": "scripting",
  logrotate: "logging",
  md: "documentation",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  psd: "image",
  svg: "image",
  html: "web",
  css: "web",
  less: "web",
  "git-blame-ignore-revs": "git",
  gitattribute: "git",
  gitattributes_global: "git",
  gitattributes: "git",
  gitconfi: "git",
  gitconfig: "git",
  gitfat: "git",
  githolder: "git",
  gitignor: "git",
  gitignore_global: "git",
  gitignore: "git",
  gitkee: "git",
  gitkeep: "git",
  gitmessage: "git",
  gitmodules: "git",
  gitrevie: "git",
  gitreview: "git",
  gitversion: "git",
};
const unfoundFileExtensionMap: Record<string, number> = {};
function getFileExtensionType(file: string) {
  let newFile = file;
  // only consider after => and remove trailing }
  const arrowLoc = newFile.lastIndexOf("=>");
  if (arrowLoc != -1) {
    newFile = newFile.slice(arrowLoc + 2, -1);
  }
  // only consider after slash
  const slashLoc = newFile.lastIndexOf("/");
  if (slashLoc != -1) {
    newFile = newFile.slice(slashLoc + 1);
  }

  // remove extra chars
  newFile = newFile.replaceAll("}", "");
  newFile = newFile.replaceAll("~", "");
  newFile = newFile.replaceAll("#", "");
  newFile = newFile.replaceAll("\\", "");

  let extensionLoc = newFile.lastIndexOf(".");
  if (extensionLoc == -1) return "NONE";

  let extension = newFile.slice(extensionLoc + 1).toLocaleLowerCase();

  if (!isNaN(parseInt(extension))) {
    // if its a number
    const secondExtensionLoc = newFile.lastIndexOf(".", extensionLoc - 1);
    if (secondExtensionLoc == -1) {
      return "NONE";
    } else {
      extension = newFile.slice(secondExtensionLoc + 1, extensionLoc).toLocaleLowerCase();
    }
  }

  if (extension == "") return "NONE";

  const found = fileExtensionMap[extension];
  if (found) return found;

  unfoundFileExtensionMap[extension] = (unfoundFileExtensionMap[extension] || 0) + 1;
  if (extension.startsWith("skipif")) console.log(chalk.red(newFile));
  return "other";
}

type FlatCommitLogEntry = {
  hash: string;
  isMerge: boolean;
  numFileChanged: number;
  numInsertions: number;
  numDeletions: number;

  numFileExtConfig: number;
  numFileExtData: number;
  numFileExtScripting: number;
  numFileExtLogs: number;
  numFileExtImages: number;
  numFileExtOther: number;
  numFileExtNone: number;
};

async function compareCommits() {
  const postIncidentCommits: FlatCommitLogEntry[] = [];
  const otherCommits: FlatCommitLogEntry[] = [];

  for (const [repo, repoFolderName] of Object.entries(projectToGitLogMap)) {
    let log = JSON.parse(
      readFileSync(join(gitLogDir, `${repoFolderName}.json`), "utf-8")
    ) as CommitLogEntry[];

    // divide by 1000 for date format
    log = log.filter((x) => x.epoch > acceptStartDate / 1000 && x.epoch < acceptEndDate / 1000);

    log.forEach((x) => {
      let flat = {
        hash: x.commit,
        isMerge: !!x.merge,
        numFileChanged: x.stats?.files_changed || 0,
        numInsertions: x.stats?.insertions || 0,
        numDeletions: x.stats?.deletions || 0,
        numFileExtConfig: 0,
        numFileExtData: 0,
        numFileExtScripting: 0,
        numFileExtLogs: 0,
        numFileExtDocumentation: 0,
        numFileExtImages: 0,
        numFileExtWeb: 0,
        numFileExtGit: 0,
        numFileExtOther: 0,
        numFileExtNone: 0,
      };
      x.stats?.files.forEach((f) => {
        const extType = getFileExtensionType(f);
        if (extType == "config") flat.numFileExtConfig++;
        else if (extType == "data") flat.numFileExtData++;
        else if (extType == "scripting") flat.numFileExtScripting++;
        else if (extType == "logging") flat.numFileExtLogs++;
        else if (extType == "documentation") flat.numFileExtDocumentation++;
        else if (extType == "image") flat.numFileExtImages++;
        else if (extType == "web") flat.numFileExtWeb++;
        else if (extType == "git") flat.numFileExtGit++;
        else if (extType == "other") flat.numFileExtOther++;
        else if (extType == "NONE") flat.numFileExtNone++;
      });
      //console.log("Trying to read repo", repo);
      if (repoSummary.reposCommits[repo]?.includes(x.commit!)) {
        // if its a known commit
        postIncidentCommits.push(flat);
      } else {
        otherCommits.push(flat);
      }
    });
  }

  writeFileSync(
    join(__dirname, "compare_commits_pic.csv"),
    Papa.unparse(postIncidentCommits, { header: true })
  );
  writeFileSync(join(__dirname, "compare_commits_oc.csv"), Papa.unparse(otherCommits, { header: true }));

  console.log(
    chalk.red(Object.keys(unfoundFileExtensionMap).length),
    chalk.blue("Unfound File Extensions:"),
    JSON.stringify(unfoundFileExtensionMap)
  );
}
//await compareCommits();

/* 
   ===== Code Reviews =====
We want a CSV with all commits tagged as incident or not. Exports the following properties
  1. Num Comments
  2. Num Reviewers
  3. Status: Merged vs Abandoned rate
  4. Age

We need to randomly scrape a bunch of CRs that we have not seen. Then compare them ONLY to 
direct CRs and CRs. No child CRs.
*/

async function compareCRs() {
  const postIncidentCRs: FlatCREntry[] = [];
  const otherCRs: FlatCREntry[] = [];

  let picIDs: string[] = [];
  picIDs.push(...lifeycleSummary.directCodeReviews.survived!.directCodeReviewsWithCommits.ids!);
  picIDs.push(...lifeycleSummary.directCodeReviews.died!.directCodeReviewsWithoutCommits.ids!);
  picIDs.push(...lifeycleSummary.codeReviews.survived!.codeReviewsWithCommits.ids!);
  picIDs.push(...lifeycleSummary.codeReviews.died!.codeReviewsWithoutCommits.ids!);
  picIDs = uniq(picIDs);

  for (const crID of picIDs) {
    const cr = await CodeReview.loadById(crID, createDepthTracker(0));

    if (!cr) {
      console.log(chalk.red("this CR could not be loaded", crID));
      break;
    }

    try {
      // TODO: Time acceptance criteria?
      const f = cr.getFlat();
      postIncidentCRs.push(f);
    } catch (e) {}
  }

  writeFileSync(join(__dirname, "compare_crs_pic.csv"), Papa.unparse(postIncidentCRs, { header: true }));

  const numNormalCRsToSampleFrom = 500;
  const otherIDs: string[] = [];

  // load already scraped from compare_crs_oc.csv
  if (existsSync(join(__dirname, "compare_crs_oc.csv"))) {
    const alreadyScraped = Papa.parse<FlatCREntry>(
      readFileSync(join(__dirname, "compare_crs_oc.csv"), "utf-8"),
      { header: true }
    );
    alreadyScraped.data.forEach((x) => {
      otherIDs.push(x.id);
    });
    console.log(chalk.blue("Found existing CSV and auto loaded", otherIDs.length, "ids"));
  }

  // fill with random IDs
  while (otherIDs.length < numNormalCRsToSampleFrom) {
    const min = 150_000;
    const max = 1_130_000;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!existsSync(join(gerritScrapedDir, `${randomNumber}.json`))) {
      otherIDs.push("" + randomNumber);
    }
  }

  for (const crID of otherIDs) {
    const cr = await CodeReview.loadById("" + crID, createDepthTracker(0));

    if (!cr) {
      console.log(chalk.red("this CR could not be loaded", crID));
      break;
    }

    try {
      // TODO: Time acceptance criteria?
      const f = cr.getFlat();
      otherCRs.push(f);
    } catch (e) {}

    // always keep this file updated
    writeFileSync(join(__dirname, "compare_crs_oc.csv"), Papa.unparse(otherCRs, { header: true }));
  }

  writeFileSync(join(__dirname, "compare_crs_oc.csv"), Papa.unparse(otherCRs, { header: true }));
}
await compareCRs();

/* 
   ===== Tasks =====
We want a CSV with all commits tagged as incident or not. Exports the following properties
  1. Num Comments
  2. Num Participants
  3. Num merge requests
  4. Num Child Tasks
  5. Num Mentioned Tasks
  6. Status: Duplicate, Invalid, Declined, Resolved
  7. Age
*/

async function compareTasks() {
  const postIncidentTasks: FlatTaskEntry[] = [];
  const otherTasks: FlatTaskEntry[] = [];

  let picIDs: string[] = [];
  picIDs.push(...lifeycleSummary.tasks.survived!.tasksWithCodeReview.ids!);
  picIDs.push(...lifeycleSummary.tasks.survived!.tasksWithChildTasks.ids!);
  picIDs.push(...lifeycleSummary.tasks.died!.tasksWithoutCodeReviewsOrChildTasks.ids!);
  picIDs = uniq(picIDs);

  for (const taskID of picIDs) {
    const task = await Task.loadById(taskID, createDepthTracker(0));

    if (!task) {
      console.log(chalk.red("this Task could not be loaded", taskID));
      break;
    }

    // TODO: Time acceptance criteria?
    postIncidentTasks.push(task.getFlat());
  }

  writeFileSync(join(__dirname, "compare_tasks_pic.csv"), Papa.unparse(postIncidentTasks, { header: true }));

  const numNormalTasksToSampleFrom = 600;
  const otherIDs: string[] = [];

  // load already scraped from compare_crs_oc.csv
  if (existsSync(join(__dirname, "compare_tasks_oc.csv"))) {
    const alreadyScraped = Papa.parse<FlatCREntry>(
      readFileSync(join(__dirname, "compare_tasks_oc.csv"), "utf-8"),
      { header: true }
    );
    alreadyScraped.data.forEach((x) => {
      otherIDs.push(x.id);
    });
    console.log(chalk.blue("Found existing CSV and auto loaded", otherIDs.length, "ids"));
  }

  // fill with random IDs
  while (otherIDs.length < numNormalTasksToSampleFrom) {
    const min = 17_000;
    const max = 386_500;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!existsSync(join(phabricatorScrapedDir, `T${randomNumber}.yaml`))) {
      otherIDs.push("T" + randomNumber);
    }
  }

  for (const id of otherIDs) {
    const task = await Task.loadById(id, createDepthTracker(1));

    if (!task) {
      console.log(chalk.red("this Task could not be loaded", id));
      break;
    }

    // TODO: Time acceptance criteria?
    otherTasks.push(task.getFlat());

    // always keep this file updated
    writeFileSync(join(__dirname, "compare_tasks_oc.csv"), Papa.unparse(otherTasks, { header: true }));
  }

  writeFileSync(join(__dirname, "compare_tasks_oc.csv"), Papa.unparse(otherTasks, { header: true }));
}
await compareTasks();
