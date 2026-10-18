import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { gerritScrapedDir } from "./gerrit.js";
import chalk from "chalk";
import { gitLogDir } from "./git-log-to-json.js";
import { GerritCodeReview } from "./gerrit-types.js";

// Entry point
async function findCommitsForPuppetRepoInCodeReview() {
  console.log(chalk.yellow("Starting findCommitsForPuppetRepoInCodeReview()"));

  let dir = readdirSync(gerritScrapedDir).filter((f) => f.endsWith(".json"));
  dir.sort();
  //dir = dir.reverse().slice(0, 5);

  const projects: string[] = [];
  const puppetCommits: string[] = [];

  dir.forEach((changeReviewFileName) => {
    const fileData = readFileSync(join(gerritScrapedDir, changeReviewFileName), "utf-8");
    const parsedFile = JSON.parse(fileData) as GerritCodeReview;

    const project = parsedFile.project;
    projects.push(project);

    if (project == "operations/puppet") {
      puppetCommits.push(parsedFile.current_revision);
    }
  });

  let puppetLog = readFileSync(join(gitLogDir, "puppet.txt"), "utf-8");

  let inPuppetGitLog = puppetCommits.filter((c) => puppetLog.includes(c));

  console.log("Git log contains", inPuppetGitLog.length, "of", puppetCommits.length, "commits");
}
