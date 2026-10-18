import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import Papa from "papaparse";
import { fetchGerritComments } from "./gerrit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set to true to only process 1 code review for testing
const TEST_MODE = false;

interface CodeReviewRow {
  id: string;
  numPatchsets: string;
  numMessages: string;
  numReviewers: string;
  numComments: string;
  numMessagesFromJenkinsBot: string;
  numHumanComments: string;
  status: string;
  created: string;
  timeOpen: string;
}

async function main() {
  const csvFiles = [
    join(__dirname, "..", "guided", "3-2-compare_code_reviews_pic.csv"),
    join(__dirname, "..", "guided", "3-2-compare_code_reviews_oc.csv"),
  ];

  const allRowsWithComments: CodeReviewRow[] = [];

  // Read and parse both CSV files
  for (const csvFile of csvFiles) {
    console.log(`Reading ${csvFile}`);
    const csvContent = readFileSync(csvFile, "utf-8");
    const parsed = Papa.parse<CodeReviewRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    // Filter rows with numComments > 0
    const rowsWithComments = parsed.data.filter((row) => parseInt(row.numComments, 10) > 0);
    console.log(`Found ${rowsWithComments.length} rows with comments in ${csvFile}`);
    allRowsWithComments.push(...rowsWithComments);
  }

  console.log(`\nTotal rows with comments: ${allRowsWithComments.length}`);

  // In test mode, only process the first one
  const rowsToProcess = TEST_MODE ? allRowsWithComments.slice(0, 1) : allRowsWithComments;

  if (TEST_MODE) {
    console.log(`\n=== TEST MODE: Processing only 1 code review ===\n`);
  }

  let successCount = 0;
  let skipCount = 0;

  for (const row of rowsToProcess) {
    const resourceID = row.id;
    console.log(`\nProcessing code review ${resourceID} (has ${row.numComments} comments)`);

    const success = await fetchGerritComments(resourceID);
    if (success) {
      successCount++;
    } else {
      skipCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Successfully fetched: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Total processed: ${rowsToProcess.length}`);

  if (TEST_MODE) {
    console.log(`\nTo process all ${allRowsWithComments.length} code reviews, set TEST_MODE = false`);
  }
}

main().catch(console.error);
