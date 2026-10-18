import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import Papa from "papaparse";
import { CommitLogEntry, gitLogDir, projectToGitLogMap } from "../wikimedia-scraping/git-log-to-json.js";
import { RepoSummary, SummaryOfLifecycle } from "./summary-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: Do we enforce this for Commits, CRs, and Tasks?
const acceptStartDate = +new Date("2011-05-24");
const acceptEndDate = +new Date("2025-04-01");

const repoSummary = JSON.parse(readFileSync(join(__dirname, "repo_summary.json"), "utf-8")) as RepoSummary;

async function dumpCommitMessages() {
  for (const [repo, repoFolderName] of Object.entries(projectToGitLogMap)) {
    let log = JSON.parse(
      readFileSync(join(gitLogDir, `${repoFolderName}.json`), "utf-8")
    ) as CommitLogEntry[];

    // divide by 1000 for date format
    log = log.filter((x) => x.epoch > acceptStartDate / 1000 && x.epoch < acceptEndDate / 1000);

    log.forEach((x) => {
      //console.log("Trying to read repo", repo);
      if (repoSummary.reposCommits[repo]?.includes(x.commit!)) {
        // if its a known commit
        console.log("==========================================================");
        console.log(`Repo: ${repo}`);
        console.log(`Hash: ${x.commit}`);
        console.log(`Message: ${x.message}`);
      }
    });
  }
}
await dumpCommitMessages();
