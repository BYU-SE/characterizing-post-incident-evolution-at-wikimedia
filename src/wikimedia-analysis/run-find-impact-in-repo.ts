import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { CommitLogEntry, gitLogDir, projectToGitLogMap } from "../wikimedia-scraping/git-log-to-json.js";

import natural from "natural";
import { CodeReview } from "../lib/code-review.js";
import { sample, countBy } from "underscore";
import { unique } from "underscore";
import { IR } from "../lib/ir.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getMostImportantTerms(
  commitMessages: string[],
  idfFileName: string,
  mostCommonTermsFileName: string
): Record<string, number> {
  const tfIdfIRCommits = new natural.TfIdf();

  commitMessages.forEach((message) => {
    const tokenizedAndStemmedMessage = natural.PorterStemmer.tokenizeAndStem(message);
    tfIdfIRCommits.addDocument(tokenizedAndStemmedMessage);
  });

  const dict: Record<string, number> = {};

  commitMessages.forEach((messages, index) => {
    tfIdfIRCommits.listTerms(index).forEach((item) => {
      dict[item.term] = 1 + (dict[item.term] || 0);
    });
  });

  writeFileSync(join(__dirname, "repos", idfFileName), JSON.stringify(tfIdfIRCommits));
  writeFileSync(join(__dirname, "repos", mostCommonTermsFileName), JSON.stringify(dict));

  return dict;
}

// load all IRs
const irs: IR[] = [];
for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.red(`IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) throw "could not load ir";
  irs.push(ir);
}

type Keyword = {
  key: string;
  ir_count: number;
  ir_percent: number;
  others_count: number;
  others_percent: number;
  diff: number;
};

const allKeywords: Record<string, Keyword[]> = {};
let allKeys: string[] = [];

// loop for project
const keys = Object.keys(projectToGitLogMap);
for (const project of keys) {
  console.log(chalk.blue("Starting:", project));
  const gitLogFile = projectToGitLogMap[project];

  const relevantDirectCodeReviews: CodeReview[] = [];
  const relevantCodeReviews: CodeReview[] = [];

  const allCommits: string[] = [];

  for (const ir of irs) {
    const actionables = ir.actionables;
    const actionablesWithTask = actionables.filter((a) => a.contextLinksToTaskRelations.length > 0);
    const actionablesWithCodeReview = actionables.filter(
      (a) => a.contextLinksToCodeReviewRelations.length > 0
    );

    const tasks = actionablesWithTask.flatMap((a) => a.contextLinksToTaskRelations.map((r) => r.actual));
    const tasksWithCodeReview = tasks.filter((t) => t.detailsMRRelations.length > 0);
    const directCodeReviews = actionablesWithCodeReview.flatMap((a) =>
      a.contextLinksToCodeReviewRelations.map((r) => r.actual)
    );
    const directCodeReviewsWithDirectCommits = directCodeReviews.filter((cr) => cr.dto.status == "MERGED");
    const codeReviews = tasksWithCodeReview.flatMap((t) => t.detailsMRRelations.map((r) => r.actual));
    const codeReviewsWithCommits = codeReviews.filter((cr) => cr.dto.status == "MERGED");

    relevantDirectCodeReviews.push(
      ...directCodeReviewsWithDirectCommits.filter((cr) => cr.dto.project == project)
    );

    relevantCodeReviews.push(...codeReviewsWithCommits.filter((cr) => cr.dto.project == project));
  }

  allCommits.push(...relevantDirectCodeReviews.map((cr) => cr.commit));
  allCommits.push(...relevantCodeReviews.map((cr) => cr.commit));

  const commitLogs: CommitLogEntry[] = JSON.parse(
    readFileSync(join(gitLogDir, `${gitLogFile}.json`), "utf-8")
  );

  const commitMessagesFromIRs: string[] = commitLogs
    .filter((g) => allCommits.includes(g.hash))
    .map((g) => g.rawBody || "");
  const commitsFromOther: string[] = commitLogs
    .filter((g) => !allCommits.includes(g.hash))
    .map((g) => g.rawBody || "");

  const irDict = getMostImportantTerms(
    commitMessagesFromIRs,
    `${gitLogFile}_ir_commit_important_terms.json`,
    `${gitLogFile}_ir_commit_important_terms_most_common.json`
  );

  const MAX_SAMPLE_SIZE = 1000;

  //console.log("From IRs", commitMessagesFromIRs.length);
  const sampledCommitsFromOther = sample(
    commitsFromOther,
    Math.min(MAX_SAMPLE_SIZE, commitsFromOther.length)
  );
  const otherDict = getMostImportantTerms(
    sampledCommitsFromOther,
    `${gitLogFile}_other_commit_important_terms.json`,
    `${gitLogFile}_other_commit_important_terms_most_common.json`
  );
  //console.log("From not IRs", 1000);

  const threshold = Math.min(20, Math.max(5, allCommits.length / 500));

  // sort to see most common words
  let keysToCollect: string[] = [];
  Object.keys(irDict).forEach((k) => {
    if (k.length > 2 && irDict[k] > threshold) keysToCollect.push(k);
  });
  Object.keys(otherDict).forEach((k) => {
    if (k.length > 2 && otherDict[k] > threshold) keysToCollect.push(k);
  });

  keysToCollect = unique(keysToCollect);

  const keywords: Keyword[] = [];

  keysToCollect.forEach((key) => {
    const irs = (irDict[key] || 0) / commitMessagesFromIRs.length;
    const others = (otherDict[key] || 0) / sampledCommitsFromOther.length;
    const diff = irs - others;
    keywords.push({
      key,
      ir_count: irDict[key],
      ir_percent: irs,
      others_count: otherDict[key],
      others_percent: others,
      diff,
    });
    allKeys.push(key);
    /*console.log(
      `${key.padEnd(20, " ")}\t\tirs=${irDict[key]} (${irs.toFixed(3)}%) \t\tothers=${
        otherDict[key]
      } (${others.toFixed(3)}) \t\t diff=${diff.toFixed(3)}`
    );*/
  });

  writeFileSync(
    join(__dirname, "repos", `${gitLogFile}_keyword_comparison.json`),
    JSON.stringify(keywords, null, "  ")
  );

  allKeywords[gitLogFile] = keywords;

  //console.log(chalk.blue("**************************************************************************"));

  const fileExtensionsIr = countBy(
    commitLogs
      .filter((g) => allCommits.includes(g.hash))
      .flatMap((g) => g.files.map((f) => f.split(".")[1] || ""))
  );
  let nonIRSample = sample(
    commitLogs.filter((g) => !allCommits.includes(g.hash)),
    1000
  );
  const fileExtensionsOther = countBy(nonIRSample.flatMap((g) => g.files.map((f) => f.split(".")[1] || "")));
  //console.log(chalk.green("ir:"), fileExtensionsIr);
  //console.log(chalk.green("other:"), fileExtensionsOther);

  const extensions = {
    irs: fileExtensionsIr,
    others: fileExtensionsOther,
  };

  writeFileSync(
    join(__dirname, "repos", `${gitLogFile}_file_extension_comparison.json`),
    JSON.stringify(extensions, null, "  ")
  );
}

// de-dupe
allKeys = unique(allKeys);
const headerList = ["keyword"];
for (const [gitLogFile, keywords] of Object.entries(allKeywords)) {
  headerList.push(gitLogFile);
}
console.log(headerList.join(","));

for (const currentKey of allKeys) {
  // we want an all keywords.json which has a list of the same keywords for each repo and in total
  const rowList: any[] = [currentKey];
  let rowCount = 0;
  for (const [gitLogFile, keywords] of Object.entries(allKeywords)) {
    const existing = keywords.find((x) => x.key == currentKey);
    if (existing) {
      rowList.push(existing.diff);
      rowCount++;
    } else {
      rowList.push("-");
    }
  }
  if (rowCount > 2) {
    console.log(rowList.join(","));
  }
}
