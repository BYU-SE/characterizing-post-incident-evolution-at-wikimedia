import { parse } from "yaml";
import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import chalk from "chalk";
import { fetchGerrit } from "./gerrit.js";
import { fetchPhabricator, GeneratedTask, phabricatorExtractedDir } from "./phabricator.js";
import { Lookup } from "../wikimedia-analysis/lookup.js";
import { IR } from "../wikimedia-analysis/ir.js";
import { Task } from "../lib/task.js";

// 2387 phab links this round.

// Entry point to scrape
async function scrapeCodeReviews() {
  console.log(chalk.yellow("Starting scrapeCodeReviews()"));
  // go through the wikimedia-tasks and find links

  const lookup = Lookup.loadSome([IR, Task]);

  // first collect only those directly related to a task,
  const incidentRelatedTasksIDs = lookup.tasks
    .filter((task) => task.actionables.length > 0)
    .map((task) => task.id);

  // then add in those related to those tasks
  const secondaryIncidentRelatedTaskIDs: Set<string> = new Set();
  lookup.tasks.forEach((task) => {
    if (incidentRelatedTasksIDs.includes(task.id)) return;

    let hasRelatedTaskFromIncident = task.tasks.some((relatedTask) =>
      incidentRelatedTasksIDs.includes(relatedTask.id)
    );
    if (hasRelatedTaskFromIncident) {
      secondaryIncidentRelatedTaskIDs.add(task.id);
    }
  });
  incidentRelatedTasksIDs.push(...secondaryIncidentRelatedTaskIDs);

  let gitlabLinks: string[] = [];
  let phabricatorLinks: string[] = [];
  let gerritLinks: string[] = [];

  let totalIgnoredTasks: number = 0;

  const files = readdirSync(phabricatorExtractedDir).filter((f) => f.endsWith(".yaml"));
  files.forEach((file) => {
    const data = readFileSync(join(phabricatorExtractedDir, file), "utf-8");
    const parsedData = parse(data) as GeneratedTask;

    // We should only scrape links that are related to tasks that come out of an incident,
    // otherwise we might end up scraping ALL tasks since there are probably unrelated links
    if (!incidentRelatedTasksIDs.includes(parsedData.gen_id)) {
      totalIgnoredTasks++;
      return;
    }

    // will have gerrit or gitlab links
    parsedData.gen_details_mrs.forEach((item) => {
      if (item.gen_link.includes("gitlab.wikimedia.org")) {
        gitlabLinks.push(item.gen_link);
      } else if (item.gen_link.includes("gerrit.wikimedia.org")) {
        gerritLinks.push(item.gen_link);
      }
    });

    parsedData.gen_related_tasks.forEach((item) => {
      if (item.gen_link.includes("phabricator.wikimedia.org")) {
        phabricatorLinks.push(item.gen_link);
      }
    });

    parsedData.gen_mentioned_tasks.forEach((item) => {
      if (item.gen_link.includes("phabricator.wikimedia.org")) {
        phabricatorLinks.push(item.gen_link);
      }
    });
  });

  gitlabLinks = Array.from(new Set(gitlabLinks));
  gerritLinks = Array.from(new Set(gerritLinks));
  phabricatorLinks = Array.from(new Set(phabricatorLinks));

  console.log(
    chalk.green(
      "Ignoring",
      totalIgnoredTasks,
      "Phab tasks during the scrape since they are not closely tied to incident"
    )
  );
  console.log(chalk.green("Found", gitlabLinks.length, "gitlab links"));
  console.log(chalk.green("Found", gerritLinks.length, "gerrit links"));
  console.log(chalk.green("Found", phabricatorLinks.length, "phabricator links"));

  for (let i = 0; i < gitlabLinks.length; i++) {
    // TODO:
    //await fetchGitlab(gitlabLinks[i]);
  }
  for (let i = 0; i < gerritLinks.length; i++) {
    await fetchGerrit(gerritLinks[i]);
  }
  for (let i = 0; i < phabricatorLinks.length; i++) {
    await fetchPhabricator(phabricatorLinks[i]);
  }
}

await scrapeCodeReviews();
