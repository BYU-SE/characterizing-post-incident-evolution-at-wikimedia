import { readdirSync, readFileSync, renameSync, unlinkSync } from "fs";
import { join } from "path";
import { getGerritResourceID, gerritScrapedDir } from "./gerrit.js";
import chalk from "chalk";

console.log(chalk.yellow("Running gerrit file fix"));

let dir = readdirSync(gerritScrapedDir).filter((f) => f.endsWith(".json"));
dir.sort();
//dir = dir.reverse().slice(0, 5);

dir.forEach((changeReviewFileName) => {
  const oldName = join(gerritScrapedDir, changeReviewFileName);
  const resourceId = getGerritResourceID(changeReviewFileName);

  if (resourceId) {
    const newName = join(gerritScrapedDir, `${resourceId}.json`);
    console.log("Renaming", oldName, newName);
    renameSync(oldName, newName);
  } else {
    console.log("Cannot rename", changeReviewFileName);
    unlinkSync(oldName);
  }
});
