import chalk from "chalk";
import { CommitLogEntry, gitLogDir, projectToGitLogMap } from "../wikimedia-scraping/git-log-to-json.js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { countBy, partition } from "underscore";
import Papa from "papaparse";
import { RepoSummary } from "./summary-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Entry point
async function runCompare() {
  console.log(chalk.yellow("Starting runGitLog()"));

  const summary = JSON.parse(readFileSync(join(__dirname, "repo_summary.json"), "utf-8")) as RepoSummary;

  const comparisons: Comparison[] = [];
  for (const [repo, repoFolderName] of Object.entries(projectToGitLogMap)) {
    const c = await generateCounts(repo, repoFolderName, summary);
    comparisons.push(c);
  }

  console.log(JSON.stringify(comparisons));

  console.log(chalk.blue("XXXXXXXXXXXXXXXXXXXXXXXXXXXX"));
  console.log(Papa.unparse(comparisons, { header: true }));
}

function averageCommitLogStat(arr: CommitLogEntry[], property: string): number {
  // @ts-ignore
  return arr.map((x) => x.stats![property]).reduce((s, x) => s + x, 0) / arr.length;
}
function topFileExtensions(arr: CommitLogEntry[], n: number): [string, number][] {
  const c = countBy(
    arr.flatMap((x) => x.stats!.files),
    (x) => x.split(".")[1] || "NONE"
  );
  return Object.entries(c)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

type Comparison = {
  repo: string;
  totalCommits: number;
  percentIRCommits: number;

  IR_numCommits: number;
  NOT_numCommits: number;

  IR_numInsertions: number;
  NOT_numInsertions: number;

  IR_numDeletions: number;
  NOT_numDeletions: number;

  IR_numFilesChanged: number;
  NOT_numFilesChanged: number;

  IR_topExtensions: [string, number][];
  NOT_topExtensions: [string, number][];
};

async function generateCounts(
  repo: string,
  repoFolderName: string,
  summary: RepoSummary
): Promise<Comparison> {
  console.log(chalk.blue("Reading", repoFolderName));
  let gitLog = JSON.parse(
    readFileSync(join(gitLogDir, `${repoFolderName}.json`), "utf-8")
  ) as CommitLogEntry[];

  const acceptStartDate = Math.floor(+new Date("2011-05-24") / 1000);
  const acceptEndDate = Math.floor(+new Date("2025-04-01") / 1000);

  gitLog = gitLog.filter((x) => x.epoch > acceptStartDate);

  console.log("Gitlog:", gitLog.length, "commits");
  const [fromIRCommits, notFromIRCommits] = partition(gitLog, (x) => summary.commits.includes(x.commit));

  const expectedNumIRCommits = summary.reposCommitCounts[repo];
  const foundNumIRCommits = fromIRCommits.length;
  if (expectedNumIRCommits == foundNumIRCommits) {
    console.log(chalk.green("Found", foundNumIRCommits, "ir commits"));
  } else {
    console.log(chalk.red("Found", foundNumIRCommits, "ir commits, but expected", expectedNumIRCommits));
  }

  const notFoundInCommits = summary.reposCommits[repo].filter((x) => !gitLog.find((log) => log.commit == x));
  if (notFoundInCommits.length > 0) console.log("Not found", chalk.yellow(notFoundInCommits.join("\n")));

  const fromIRCommitsWithStats = fromIRCommits.filter((x) => !!x.stats);
  const notFromIRCommitsWithStats = notFromIRCommits.filter((x) => !!x.stats);

  const IR_numFilesChanged = averageCommitLogStat(fromIRCommitsWithStats, "files_changed");
  const NOT_numFilesChanged = averageCommitLogStat(notFromIRCommitsWithStats, "files_changed");
  const IR_numInsertions = averageCommitLogStat(fromIRCommitsWithStats, "insertions");
  const NOT_numInsertions = averageCommitLogStat(notFromIRCommitsWithStats, "insertions");
  const IR_numDeletions = averageCommitLogStat(fromIRCommitsWithStats, "deletions");
  const NOT_numDeletions = averageCommitLogStat(notFromIRCommitsWithStats, "deletions");

  const IR_topExtensions = topFileExtensions(fromIRCommitsWithStats, 5);
  const NOT_topExtensions = topFileExtensions(notFromIRCommitsWithStats, 5);

  return {
    repo,
    totalCommits: gitLog.length,
    percentIRCommits: fromIRCommits.length / gitLog.length,

    IR_numCommits: fromIRCommits.length,
    NOT_numCommits: notFromIRCommits.length,

    IR_numInsertions,
    NOT_numInsertions,

    IR_numDeletions,
    NOT_numDeletions,

    IR_numFilesChanged,
    NOT_numFilesChanged,

    IR_topExtensions,
    NOT_topExtensions,
  };
}

await runCompare();
