import { readdirSync } from "fs";
import chalk from "chalk";
import { phabricatorScrapedDir, extractPhabricatorByPhabId } from "./phabricator.js";

// Entry point
async function findMRsInReports() {
  console.log(chalk.yellow("Starting findMRsInReports()"));

  let dir = readdirSync(phabricatorScrapedDir).filter((f) => f.endsWith(".html"));
  dir.sort(); // deterministic processing

  for (const taskFileName of dir) {
    const phabId = taskFileName.slice(0, taskFileName.length - ".html".length);
    await extractPhabricatorByPhabId(phabId);
  }
}

findMRsInReports();
