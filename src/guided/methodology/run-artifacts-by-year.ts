import chalk from "chalk";
import { LookupIncremental } from "../../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../../wikimedia-scraping/incident-reports.js";
import { IR } from "../../lib/ir.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load all IRs
const irs: IR[] = [];

console.log(chalk.blue("Loading incident reports..."));

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.yellow(`Loading IR: ${irID}`));

  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) throw "could not load ir";

  irs.push(ir);
}

console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("Processing artifacts by year..."));
console.log(chalk.blue("###########################################################################"));

// Initialize yearly counters
type YearlyCount = {
  year: number | string;
  irs: number;
  actionables: number;
  tasks: number;
  codeReviews: number;
  commits: number;
  ocTasks: number;
  ocCodeReviews: number;
  ocCommits: number;
};

const yearlyData: Record<string, YearlyCount> = {};

// Initialize Pre-2015 and years 2015-2025
yearlyData["pre2015"] = {
  year: "Pre-2015",
  irs: 0,
  actionables: 0,
  tasks: 0,
  codeReviews: 0,
  commits: 0,
  ocTasks: 0,
  ocCodeReviews: 0,
  ocCommits: 0,
};

for (let year = 2015; year <= 2025; year++) {
  yearlyData[year] = {
    year,
    irs: 0,
    actionables: 0,
    tasks: 0,
    codeReviews: 0,
    commits: 0,
    ocTasks: 0,
    ocCodeReviews: 0,
    ocCommits: 0,
  };
}

// Helper function to extract year from date string
function getYearFromDateString(dateStr: string): number | null {
  return new Date(dateStr).getFullYear();
}

// Helper function to extract year from epoch timestamp (in seconds)
function getYearFromEpoch(epoch: number): number {
  const date = new Date(epoch * 1000);
  return date.getFullYear();
}

// Helper function to extract year from epoch timestamp in milliseconds
function getYearFromEpochMs(epochMs: number): number {
  const date = new Date(epochMs);
  return date.getFullYear();
}

// Helper function to get the correct year bucket (Pre-2015 or specific year)
function getYearBucket(year: number): string {
  if (year < 2015) {
    let vm;
    return "pre2015";
  } else if (year >= 2015 && year <= 2025) {
    return year.toString();
  }
  // For years beyond 2025, we'll ignore them
  return "";
}

// Process IRs
console.log(chalk.green("Counting IRs by year..."));
irs.forEach((ir) => {
  // Get year from first date in IR
  if (ir.dates && ir.dates.length > 0) {
    const year = getYearFromDateString(ir.dates[0]);
    if (year) {
      const bucket = getYearBucket(year);
      if (bucket) {
        yearlyData[bucket].irs++;
      }
    }
  }
});

// Process Actionables (Action Items)
console.log(chalk.green("Counting actionables (AIs) by year..."));
irs.forEach((ir) => {
  if (ir.dates && ir.dates.length > 0) {
    const year = getYearFromDateString(ir.dates[0]);
    if (year) {
      const bucket = getYearBucket(year);
      if (bucket) {
        yearlyData[bucket].actionables += ir.actionables.length;
      }
    }
  }
});

// Process Tasks from PIC CSV
console.log(chalk.green("Counting tasks from PIC CSV..."));
const picTasksCsvPath = join(__dirname, "..", "3-2-compare_tasks_pic.csv");
try {
  const picTasksCsvContent = readFileSync(picTasksCsvPath, "utf-8");
  const parsedPicTasks = Papa.parse(picTasksCsvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const picTasksRecords = parsedPicTasks.data as Array<{ id: string; dateCreated: string }>;

  console.log(chalk.cyan(`Found ${picTasksRecords.length} PIC tasks in CSV`));

  picTasksRecords.forEach((record) => {
    if (record.dateCreated && record.dateCreated !== "NaN") {
      const epochMs = parseFloat(record.dateCreated);
      if (!isNaN(epochMs)) {
        const year = getYearFromEpochMs(epochMs);
        const bucket = getYearBucket(year);
        if (bucket) {
          yearlyData[bucket].tasks++;
        }
      }
    }
  });
} catch (error: any) {
  console.error(chalk.red(`Error reading PIC tasks CSV: ${error.message}`));
}

// Process Code Reviews from PIC CSV
console.log(chalk.green("Counting code reviews from PIC CSV..."));
const picCodeReviewsCsvPath = join(__dirname, "..", "3-2-compare_code_reviews_pic.csv");
try {
  const picCodeReviewsCsvContent = readFileSync(picCodeReviewsCsvPath, "utf-8");
  const parsedPicCodeReviews = Papa.parse(picCodeReviewsCsvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const picCodeReviewsRecords = parsedPicCodeReviews.data as Array<{ id: string; created: string }>;

  console.log(chalk.cyan(`Found ${picCodeReviewsRecords.length} PIC code reviews in CSV`));

  picCodeReviewsRecords.forEach((record) => {
    if (record.created) {
      const year = getYearFromDateString(record.created);
      if (year) {
        const bucket = getYearBucket(year);
        if (bucket) {
          yearlyData[bucket].codeReviews++;
        }
      }
    }
  });
} catch (error: any) {
  console.error(chalk.red(`Error reading PIC code reviews CSV: ${error.message}`));
}

// Process Commits from PIC CSV
console.log(chalk.green("Counting commits from PIC CSV..."));
const picCommitsCsvPath = join(__dirname, "..", "3-2-compare_commits_from_cr_pic.csv");
try {
  const picCommitsCsvContent = readFileSync(picCommitsCsvPath, "utf-8");
  const parsedPicCommits = Papa.parse(picCommitsCsvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const picCommitsRecords = parsedPicCommits.data as Array<{ hash: string; date: string }>;

  console.log(chalk.cyan(`Found ${picCommitsRecords.length} PIC commits in CSV`));

  picCommitsRecords.forEach((record) => {
    if (record.date) {
      const epochMs = parseFloat(record.date);
      if (!isNaN(epochMs)) {
        const year = getYearFromEpochMs(epochMs);
        const bucket = getYearBucket(year);
        if (bucket) {
          yearlyData[bucket].commits++;
        }
      }
    }
  });
} catch (error: any) {
  console.error(chalk.red(`Error reading PIC commits CSV: ${error.message}`));
}

// Process OC Tasks from CSV
console.log(chalk.green("Counting OC tasks from CSV..."));
const ocTasksCsvPath = join(__dirname, "..", "3-2-compare_tasks_oc.csv");
try {
  const ocTasksCsvContent = readFileSync(ocTasksCsvPath, "utf-8");
  const parsedOcTasks = Papa.parse(ocTasksCsvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const ocTasksRecords = parsedOcTasks.data as Array<{ id: string; dateCreated: string }>;

  console.log(chalk.cyan(`Found ${ocTasksRecords.length} OC tasks in CSV`));

  ocTasksRecords.forEach((record) => {
    if (record.dateCreated && record.dateCreated !== "NaN") {
      const epochMs = parseFloat(record.dateCreated);
      if (!isNaN(epochMs)) {
        const year = getYearFromEpochMs(epochMs);
        const bucket = getYearBucket(year);
        if (bucket) {
          yearlyData[bucket].ocTasks++;
        }
      }
    }
  });
} catch (error: any) {
  console.error(chalk.red(`Error reading OC tasks CSV: ${error.message}`));
}

// Process OC Code Reviews from CSV
console.log(chalk.green("Counting OC code reviews from CSV..."));
const ocCodeReviewsCsvPath = join(__dirname, "..", "3-2-compare_code_reviews_oc.csv");
try {
  const ocCodeReviewsCsvContent = readFileSync(ocCodeReviewsCsvPath, "utf-8");
  const parsedOcCodeReviews = Papa.parse(ocCodeReviewsCsvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const ocCodeReviewsRecords = parsedOcCodeReviews.data as Array<{ id: string; created: string }>;

  console.log(chalk.cyan(`Found ${ocCodeReviewsRecords.length} OC code reviews in CSV`));

  ocCodeReviewsRecords.forEach((record) => {
    if (record.created) {
      const year = getYearFromDateString(record.created);
      if (year) {
        const bucket = getYearBucket(year);
        if (bucket) {
          yearlyData[bucket].ocCodeReviews++;
        }
      }
    }
  });
} catch (error: any) {
  console.error(chalk.red(`Error reading OC code reviews CSV: ${error.message}`));
}

// Process OC Commits from CSV
console.log(chalk.green("Counting OC commits from CSV..."));
const ocCommitsCsvPath = join(__dirname, "..", "3-2-compare_commits_from_cr_oc.csv");
try {
  const ocCommitsCsvContent = readFileSync(ocCommitsCsvPath, "utf-8");
  const parsedOcCommits = Papa.parse(ocCommitsCsvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const ocCommitsRecords = parsedOcCommits.data as Array<{ hash: string; date: string }>;

  console.log(chalk.cyan(`Found ${ocCommitsRecords.length} OC commits in CSV`));

  ocCommitsRecords.forEach((record) => {
    if (record.date) {
      const epochMs = parseFloat(record.date);
      if (!isNaN(epochMs)) {
        const year = getYearFromEpochMs(epochMs);
        const bucket = getYearBucket(year);
        if (bucket) {
          yearlyData[bucket].ocCommits++;
        }
      }
    }
  });
} catch (error: any) {
  console.error(chalk.red(`Error reading OC commits CSV: ${error.message}`));
}

// Convert to array and sort by year (Pre-2015 first, then 2015-2025)
const results = Object.values(yearlyData).sort((a, b) => {
  if (a.year === "Pre-2015") return -1;
  if (b.year === "Pre-2015") return 1;
  return (a.year as number) - (b.year as number);
});

// Display results
console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("RESULTS: Artifacts by Year"));
console.log(chalk.blue("###########################################################################"));
console.log("");
console.log(chalk.white("Year      | IRs | AIs | Tasks | CRs | Commits | OC Tasks | OC CRs | OC Commits"));
console.log(chalk.white("----------|-----|-----|-------|-----|---------|----------|--------|-----------"));

results.forEach((yearData) => {
  const yearLabel = yearData.year.toString().padEnd(9); // "Pre-2015 " or "2015     "
  console.log(
    chalk.white(
      `${yearLabel} | ${yearData.irs.toString().padStart(3)} | ${yearData.actionables
        .toString()
        .padStart(3)} | ${yearData.tasks.toString().padStart(5)} | ${yearData.codeReviews
        .toString()
        .padStart(3)} | ${yearData.commits.toString().padStart(7)} | ${yearData.ocTasks
        .toString()
        .padStart(8)} | ${yearData.ocCodeReviews.toString().padStart(6)} | ${yearData.ocCommits
        .toString()
        .padStart(10)}`,
    ),
  );
});

console.log("");
console.log(chalk.blue("###########################################################################"));

// Calculate totals
const totals = results.reduce(
  (acc, yearData) => ({
    irs: acc.irs + yearData.irs,
    actionables: acc.actionables + yearData.actionables,
    tasks: acc.tasks + yearData.tasks,
    codeReviews: acc.codeReviews + yearData.codeReviews,
    commits: acc.commits + yearData.commits,
    ocTasks: acc.ocTasks + yearData.ocTasks,
    ocCodeReviews: acc.ocCodeReviews + yearData.ocCodeReviews,
    ocCommits: acc.ocCommits + yearData.ocCommits,
  }),
  {
    irs: 0,
    actionables: 0,
    tasks: 0,
    codeReviews: 0,
    commits: 0,
    ocTasks: 0,
    ocCodeReviews: 0,
    ocCommits: 0,
  },
);

console.log(chalk.yellow("TOTALS:"));
console.log(
  chalk.yellow(
    `Total     | ${totals.irs.toString().padStart(3)} | ${totals.actionables
      .toString()
      .padStart(3)} | ${totals.tasks.toString().padStart(5)} | ${totals.codeReviews
      .toString()
      .padStart(3)} | ${totals.commits.toString().padStart(7)} | ${totals.ocTasks
      .toString()
      .padStart(8)} | ${totals.ocCodeReviews.toString().padStart(6)} | ${totals.ocCommits
      .toString()
      .padStart(10)}`,
  ),
);
console.log("");

// Write results to JSON file
const outputPath = join(__dirname, "artifacts_by_year.json");
writeFileSync(outputPath, JSON.stringify({ yearly: results, totals }, null, 2));

console.log(chalk.green(`Results written to: ${outputPath}`));
console.log(chalk.blue("###########################################################################"));
