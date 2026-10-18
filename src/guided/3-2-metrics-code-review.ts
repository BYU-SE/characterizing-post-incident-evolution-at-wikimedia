import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { uniq } from "underscore";
import { CodeReview, FlatCREntry } from "../lib/code-review.js";
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

const postIncidentPath = join(__dirname, "3-2-compare_code_reviews_pic.csv");
const otherCodeReviewsPath = join(__dirname, "3-2-compare_code_reviews_oc.csv");

const existingPic = existsSync(postIncidentPath);
const existingOc = existsSync(otherCodeReviewsPath);

console.log(chalk.blue(`Post-incident code reviews CSV exists: ${existingPic}`));
console.log(chalk.blue(`Other code reviews CSV exists: ${existingOc}`));

const numNormalCRsToSampleFrom = 500;

/* 
   ===== Code Reviews =====
We want a CSV with all code reviews tagged as incident or not. 

We need to randomly scrape a bunch of CRs that we have not seen. Then compare them ONLY to 
direct CRs and CRs. No child CRs.
*/

async function generateCodeReviewCSVFiles() {
  const postIncidentCRs: FlatCREntry[] = [];
  const otherCRs: FlatCREntry[] = [];

  console.log(chalk.blue("Processing post-incident code reviews..."));

  // Collect all post-incident code review IDs
  let picIDs: string[] = [];
  picIDs.push(...lifeycleSummary.directCodeReviews.survived!.directCodeReviewsWithCommits.ids!);
  picIDs.push(...lifeycleSummary.directCodeReviews.died!.directCodeReviewsWithoutCommits.ids!);
  picIDs.push(...lifeycleSummary.codeReviews.survived!.codeReviewsWithCommits.ids!);
  picIDs.push(...lifeycleSummary.codeReviews.died!.codeReviewsWithoutCommits.ids!);
  picIDs = uniq(picIDs);

  console.log(chalk.green(`Found ${picIDs.length} post-incident code review IDs`));

  for (const crID of picIDs) {
    const cr = await CodeReview.loadById(crID, DepthTracker.create(0, "3-2-metrics-code-review"));

    if (!cr) {
      console.log(chalk.red("this CR could not be loaded", crID));
      continue;
    }

    try {
      const createdDate = +new Date(cr.dto.created);
      if (createdDate < acceptStartDate || createdDate > acceptEndDate) {
        console.log(chalk.yellow(`Note! processing CR ${crID}: Out of time criteria: ${createdDate}`));
      }

      /*// Apply time acceptance criteria NOT FOR PIC, criteria is on IRs
      const createdDate = +new Date(cr.dto.created);
      if (createdDate < acceptStartDate || createdDate > acceptEndDate) {
        console.log(chalk.yellow(`Skipped processing CR ${crID}: Out of time criteria: ${createdDate}`));
        continue; // Skip this code review if it's outside our date range
      }
      */

      const f = cr.getFlat();
      postIncidentCRs.push(f);
    } catch (e) {
      console.log(chalk.yellow(`Error processing CR ${crID}:`, e));
    }
  }

  console.log(chalk.green(`Processed ${postIncidentCRs.length} post-incident code reviews`));

  // Write post-incident CSV
  writeFileSync(postIncidentPath, Papa.unparse(postIncidentCRs, { header: true }));

  console.log(chalk.blue("Processing other code reviews..."));

  let otherIDs: string[] = [];

  // Load already scraped from existing CSV
  if (existingOc) {
    const alreadyScraped = readCSV<FlatCREntry>(otherCodeReviewsPath);
    alreadyScraped.forEach((x) => {
      otherIDs.push(x.id);
    });
    console.log(chalk.blue("Found existing CSV and auto loaded", otherIDs.length, "ids"));
  }

  // Fill with random IDs that exist in our scraped data
  while (otherIDs.length < numNormalCRsToSampleFrom) {
    const min = 150_000; // July 28 2014
    const max = 1_130_000; // March 24 2025
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const crID = "" + randomNumber;

    otherIDs.push(crID);
  }

  // lets ensure that the IDs we have aren't in our PIC and are unique
  otherIDs = uniq(otherIDs.filter((id) => !picIDs.includes(id)));

  console.log(chalk.green(`Processing ${otherIDs.length} other code reviews`));

  for (const crID of otherIDs) {
    const cr = await CodeReview.loadById(crID, DepthTracker.create(0, "3-2-metrics-code-review"));

    if (!cr) {
      console.log(chalk.red("this CR could not be loaded", crID));
      continue;
    }

    try {
      // Apply time acceptance criteria
      const createdDate = +new Date(cr.dto.created);
      if (createdDate < acceptStartDate || createdDate > acceptEndDate) {
        continue; // Skip this code review if it's outside our date range
      }

      const f = cr.getFlat();
      otherCRs.push(f);
    } catch (e) {
      console.log(chalk.yellow(`Error processing CR ${crID}:`, e));
    }

    // Always keep this file updated for incremental progress
    writeFileSync(otherCodeReviewsPath, Papa.unparse(otherCRs, { header: true }));
  }

  console.log(chalk.green(`Found ${postIncidentCRs.length} post-incident code reviews`));
  console.log(chalk.green(`Found ${otherCRs.length} other code reviews`));

  // Write final CSV file
  writeFileSync(otherCodeReviewsPath, Papa.unparse(otherCRs, { header: true }));

  console.log(chalk.yellow("CSV files written:"));
  console.log(chalk.yellow(`- ${postIncidentPath}`));
  console.log(chalk.yellow(`- ${otherCodeReviewsPath}`));
}

function summarizeCodeReviewMetrics() {
  if (!existingPic || !existingOc) {
    console.log(chalk.red("No CSV files found. Run generateCodeReviewCSVFiles() first"));
    return;
  }

  const postIncidentData = readCSV<FlatCREntry>(postIncidentPath);
  const otherCodeReviewsData = readCSV<FlatCREntry>(otherCodeReviewsPath);

  console.log(chalk.cyan("=".repeat(80)));
  console.log(chalk.cyan.bold("CODE REVIEW METRICS SUMMARY"));
  console.log(chalk.cyan("=".repeat(80)));

  console.log(chalk.blue(`Post-Incident Code Reviews: ${postIncidentData.length}`));
  console.log(chalk.blue(`Other Code Reviews: ${otherCodeReviewsData.length}`));
  console.log();

  // Handle numerical metrics
  const metrics: (keyof FlatCREntry)[] = [
    "numPatchsets",
    "numActivity",
    "numMessagesFromJenkinsBot",
    "numHumanComments",
    "numInlineComments",
    "numReviewers",
  ] as const;

  for (const metric of metrics) {
    console.log(chalk.yellow.bold(`\n${metric.toUpperCase()}`));
    console.log(chalk.yellow("-".repeat(metric.length)));

    const postIncidentValues = postIncidentData.map((row) => Number(row[metric]) || 0);
    const otherValues = otherCodeReviewsData.map((row) => Number(row[metric]) || 0);

    const postIncidentStats = calculateStats(postIncidentValues);
    const otherStats = calculateStats(otherValues);

    console.log(
      chalk.green("Post-Incident:"),
      `  Mean: ${postIncidentStats.mean}, Min: ${postIncidentStats.min}, Q1: ${postIncidentStats.q1}, Median: ${postIncidentStats.median}, Q3: ${postIncidentStats.q3}, Max: ${postIncidentStats.max}`,
    );

    console.log(
      chalk.white("Other Code Reviews:"),
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

  const otherTimeValues = otherCodeReviewsData
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
      chalk.white("Other Code Reviews:"),
      `  Mean: ${otherFormatted.mean}, Min: ${otherFormatted.min}, Q1: ${otherFormatted.q1}, Median: ${otherFormatted.median}, Q3: ${otherFormatted.q3}, Max: ${otherFormatted.max}`,
    );
  } else {
    console.log(chalk.red("Unable to calculate time statistics (insufficient data)"));
  }

  // Handle status distribution
  console.log(chalk.yellow.bold(`\nSTATUS DISTRIBUTION`));
  console.log(chalk.yellow("-".repeat(19)));

  const postIncidentStatuses = postIncidentData.map((cr) => cr.status).filter((s) => s);
  const otherStatuses = otherCodeReviewsData.map((cr) => cr.status).filter((s) => s);

  const postIncidentStatusCounts = postIncidentStatuses.reduce(
    (acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const otherStatusCounts = otherStatuses.reduce(
    (acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Show percentages for main statuses
  const allStatuses = [
    ...new Set([...Object.keys(postIncidentStatusCounts), ...Object.keys(otherStatusCounts)]),
  ];

  for (const status of allStatuses) {
    const picCount = postIncidentStatusCounts[status] || 0;
    const picPercent = ((picCount / postIncidentData.length) * 100).toFixed(2);
    const ocCount = otherStatusCounts[status] || 0;
    const ocPercent = ((ocCount / otherCodeReviewsData.length) * 100).toFixed(2);

    console.log(chalk.green(`Post-Incident ${status}: ${picCount} (${picPercent}%)`));
    console.log(chalk.white(`Other Code Reviews ${status}: ${ocCount} (${ocPercent}%)`));
    console.log();
  }

  console.log(chalk.cyan("=".repeat(80)));
}

// Main execution

await generateCodeReviewCSVFiles();
summarizeCodeReviewMetrics();
