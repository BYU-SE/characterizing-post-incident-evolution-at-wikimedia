import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { uniq } from "underscore";
import { Task, FlatTaskEntry } from "../lib/task.js";
import Papa from "papaparse";
import { SummaryOfLifecycle } from "../wikimedia-analysis/summary-types.js";
import { acceptStartDate, acceptEndDate } from "./config.js";
import { calculateStats, readCSV, formatStatsInIntuitiveUnits } from "./util/util.js";
import { DepthTracker } from "../lib/depth-tracker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lifeycleSummary = JSON.parse(
  readFileSync(join(__dirname, "..", "wikimedia-analysis", "lifecycle_summary.json"), "utf-8"),
) as SummaryOfLifecycle;

const postIncidentPath = join(__dirname, "3-2-compare_tasks_pic.csv");
const otherTasksPath = join(__dirname, "3-2-compare_tasks_oc.csv");

const existingPic = existsSync(postIncidentPath);
const existingOc = existsSync(otherTasksPath);

console.log(chalk.blue(`Post-incident tasks CSV exists: ${existingPic}`));
console.log(chalk.blue(`Other tasks CSV exists: ${existingOc}`));

const numNormalTasksToSampleFrom = 500;

/* 
   ===== Tasks =====
We want two CSVs with all tasks tagged as incident or not.

We need to randomly scrape a bunch of tasks that we have not seen. Then compare them ONLY to 
direct tasks and tasks. No child tasks.
*/

async function generateTaskCSVFiles() {
  const postIncidentTasks: FlatTaskEntry[] = [];
  const otherTasks: FlatTaskEntry[] = [];

  console.log(chalk.blue("Processing post-incident tasks..."));

  // Collect all post-incident task IDs
  let picIDs: string[] = [];
  picIDs.push(...lifeycleSummary.tasks.survived!.tasksWithCodeReview.ids!);
  picIDs.push(...lifeycleSummary.tasks.survived!.tasksWithChildTasks.ids!);
  picIDs.push(...lifeycleSummary.tasks.died!.tasksWithoutCodeReviewsOrChildTasks.ids!);
  picIDs = uniq(picIDs);

  console.log(chalk.green(`Found ${picIDs.length} post-incident task IDs`));

  for (const taskID of picIDs) {
    const task = await Task.loadById(taskID, DepthTracker.create(0, "3-2-metrics-task"));

    if (!task) {
      console.log(chalk.red("this Task could not be loaded", taskID));
      continue;
    }

    try {
      /*// Apply time acceptance criteria  NOT FOR PIC, criteria is on IRs
      const createdDate = +new Date(task.dto.gen_createdDate);
      if (createdDate < acceptStartDate || createdDate > acceptEndDate || task.dto.gen_createdDate == "") {
        console.log(chalk.yellow(`Skipped processing Task ${taskID}: Out of time criteria: ${createdDate}`));
        continue; // Skip this task if it's outside our date range
      }
      */

      const f = task.getFlat();

      // skipping private tasks from the CSV
      if (f.priority == "other") continue;

      postIncidentTasks.push(f);
    } catch (e) {
      console.log(chalk.yellow(`Error processing Task ${taskID}:`, e));
    }
  }

  console.log(chalk.green(`Processed ${postIncidentTasks.length} post-incident tasks`));

  // Write post-incident CSV
  writeFileSync(postIncidentPath, Papa.unparse(postIncidentTasks, { header: true }));

  console.log(chalk.blue("Processing other tasks..."));

  let otherIDs: string[] = [];

  // Load already scraped from existing CSV
  if (existingOc) {
    const alreadyScraped = readCSV<FlatTaskEntry>(otherTasksPath);
    alreadyScraped.forEach((x) => {
      otherIDs.push(x.id);
    });
    console.log(chalk.blue("Found existing CSV and auto loaded", otherIDs.length, "ids"));
  }

  // Fill with random IDs that exist in our scraped data
  while (otherIDs.length < numNormalTasksToSampleFrom) {
    const min = 17_000;
    const max = 386_500;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const taskID = "T" + randomNumber;

    otherIDs.push(taskID);
  }

  // Ensure that the IDs we have aren't in our PIC and are unique
  otherIDs = uniq(otherIDs.filter((id) => !picIDs.includes(id)));

  console.log(chalk.green(`Processing ${otherIDs.length} other tasks`));

  for (const taskID of otherIDs) {
    const task = await Task.loadById(taskID, DepthTracker.create(0, "3-2-metrics-task"));

    if (!task) {
      console.log(chalk.red("this Task could not be loaded", taskID));
      continue;
    }

    try {
      // Apply time acceptance criteria
      const createdDate = +new Date(task.dto.gen_createdDate);
      if (createdDate < acceptStartDate || createdDate > acceptEndDate) {
        continue; // Skip this task if it's outside our date range
      }

      const f = task.getFlat();
      otherTasks.push(f);
    } catch (e) {
      console.log(chalk.yellow(`Error processing Task ${taskID}:`, e));
    }

    // Always keep this file updated for incremental progress
    writeFileSync(otherTasksPath, Papa.unparse(otherTasks, { header: true }));
  }

  console.log(chalk.green(`Found ${postIncidentTasks.length} post-incident tasks`));
  console.log(chalk.green(`Found ${otherTasks.length} other tasks`));

  // Write final CSV file
  writeFileSync(otherTasksPath, Papa.unparse(otherTasks, { header: true }));

  console.log(chalk.yellow("CSV files written:"));
  console.log(chalk.yellow(`- ${postIncidentPath}`));
  console.log(chalk.yellow(`- ${otherTasksPath}`));
}

function summarizeTaskMetrics() {
  if (!existingPic || !existingOc) {
    console.log(chalk.red("No CSV files found. Run generateTaskCSVFiles() first"));
    return;
  }

  const postIncidentData = readCSV<FlatTaskEntry>(postIncidentPath);
  const otherTasksData = readCSV<FlatTaskEntry>(otherTasksPath);

  console.log(chalk.cyan("=".repeat(80)));
  console.log(chalk.cyan.bold("TASK METRICS SUMMARY"));
  console.log(chalk.cyan("=".repeat(80)));

  console.log(chalk.blue(`Post-Incident Tasks: ${postIncidentData.length}`));
  console.log(chalk.blue(`Other Tasks: ${otherTasksData.length}`));
  console.log();

  // Handle numerical metrics
  const metrics: (keyof FlatTaskEntry)[] = [
    "numActivity",
    "numHumanComments",
    "numCommenters",
    "numSubscribers",
    "numPriorityChanges",
    "numTimesReopened",
    "numMergeRequests",
    "numChildTasks",
    "numParentTasks",
  ];

  for (const metric of metrics) {
    console.log(chalk.yellow.bold(`\n${metric.toUpperCase()}`));
    console.log(chalk.yellow("-".repeat(metric.length)));

    const postIncidentValues = postIncidentData.map((row) => Number(row[metric]) || 0);
    const otherValues = otherTasksData.map((row) => Number(row[metric]) || 0);

    const postIncidentStats = calculateStats(postIncidentValues);
    const otherStats = calculateStats(otherValues);

    console.log(
      chalk.green("Post-Incident:"),
      `  Mean: ${postIncidentStats.mean}, Min: ${postIncidentStats.min}, Q1: ${postIncidentStats.q1}, Median: ${postIncidentStats.median}, Q3: ${postIncidentStats.q3}, Max: ${postIncidentStats.max}`,
    );

    console.log(
      chalk.white("Other Tasks:"),
      `  Mean: ${otherStats.mean}, Min: ${otherStats.min}, Q1: ${otherStats.q1}, Median: ${otherStats.median}, Q3: ${otherStats.q3}, Max: ${otherStats.max}`,
    );
  }

  // Handle timeOpen metric (keep values in milliseconds, format for display)
  console.log(chalk.yellow.bold(`\nTIME OPEN`));
  console.log(chalk.yellow("-".repeat(9)));

  const postIncidentTimeValues = postIncidentData
    .map((row) => {
      const timeOpen = Number(row.timeOpen);
      return isNaN(timeOpen) || timeOpen === 0 ? 0 : timeOpen;
    })
    .filter((val) => val > 0); // Filter out invalid/zero values

  const otherTimeValues = otherTasksData
    .map((row) => {
      const timeOpen = Number(row.timeOpen);
      return isNaN(timeOpen) || timeOpen === 0 ? 0 : timeOpen;
    })
    .filter((val) => val > 0); // Filter out invalid/zero values

  if (postIncidentTimeValues.length > 0 && otherTimeValues.length > 0) {
    const postIncidentTimeStats = calculateStats(postIncidentTimeValues);
    const otherTimeStats = calculateStats(otherTimeValues);

    const postIncidentFormatted = formatStatsInIntuitiveUnits(postIncidentTimeStats);
    const otherFormatted = formatStatsInIntuitiveUnits(otherTimeStats);

    console.log(
      chalk.green("Post-Incident:"),
      `  Mean: ${postIncidentFormatted.mean}, Min: ${postIncidentFormatted.min}, Q1: ${postIncidentFormatted.q1}, Median: ${postIncidentFormatted.median}, Q3: ${postIncidentFormatted.q3}, Max: ${postIncidentFormatted.max}`,
    );

    console.log(
      chalk.white("Other Tasks:"),
      `  Mean: ${otherFormatted.mean}, Min: ${otherFormatted.min}, Q1: ${otherFormatted.q1}, Median: ${otherFormatted.median}, Q3: ${otherFormatted.q3}, Max: ${otherFormatted.max}`,
    );
  } else {
    console.log(chalk.red("Unable to calculate time statistics (insufficient data)"));
  }

  // Handle boolean metrics
  console.log(chalk.yellow.bold(`\nBOOLEAN METRICS`));
  console.log(chalk.yellow("-".repeat(15)));

  const booleanMetrics = ["isOpen", "isResolved", "isDeclined", "isDuplicate", "isInvalid"] as const;

  for (const metric of booleanMetrics) {
    const postIncidentTrue = postIncidentData.filter((row) => row[metric]).length;
    const postIncidentPercent = ((postIncidentTrue / postIncidentData.length) * 100).toFixed(2);

    const otherTrue = otherTasksData.filter((row) => row[metric]).length;
    const otherPercent = ((otherTrue / otherTasksData.length) * 100).toFixed(2);

    console.log(
      chalk.green(
        `Post-Incident ${metric}: ${postIncidentTrue}/${postIncidentData.length} (${postIncidentPercent}%)`,
      ),
    );
    console.log(
      chalk.white(`Other Tasks ${metric}: ${otherTrue}/${otherTasksData.length} (${otherPercent}%)`),
    );
    console.log();
  }

  // Handle priority distribution
  console.log(chalk.yellow.bold(`\nPRIORITY DISTRIBUTION`));
  console.log(chalk.yellow("-".repeat(21)));

  const postIncidentPriorities = postIncidentData.map((task) => task.priority).filter((p) => p);
  const otherPriorities = otherTasksData.map((task) => task.priority).filter((p) => p);

  const postIncidentPriorityCounts = postIncidentPriorities.reduce(
    (acc, priority) => {
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const otherPriorityCounts = otherPriorities.reduce(
    (acc, priority) => {
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const allPriorities = [
    ...new Set([...Object.keys(postIncidentPriorityCounts), ...Object.keys(otherPriorityCounts)]),
  ];

  for (const priority of allPriorities) {
    const picCount = postIncidentPriorityCounts[priority] || 0;
    const picPercent = ((picCount / postIncidentData.length) * 100).toFixed(2);
    const ocCount = otherPriorityCounts[priority] || 0;
    const ocPercent = ((ocCount / otherTasksData.length) * 100).toFixed(2);

    console.log(chalk.green(`Post-Incident ${priority}: ${picCount} (${picPercent}%)`));
    console.log(chalk.white(`Other Tasks ${priority}: ${ocCount} (${ocPercent}%)`));
    console.log();
  }

  console.log(chalk.cyan("=".repeat(80)));
}

await generateTaskCSVFiles();
summarizeTaskMetrics();
