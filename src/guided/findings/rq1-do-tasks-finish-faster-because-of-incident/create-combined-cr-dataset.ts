// Create a combined dataset with code reviews from OC and PIC datasets

import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readCSV } from "../../util/util.js";
import Papa from "papaparse";
import { FlatCREntry } from "../../../lib/code-review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CombinedCRRecord extends FlatCREntry {
  source: "OC" | "PIC"; // OC = Other Context, PIC = Post-Incident Context
}

// Load the two CSV files
const ocCsvPath = path.join(process.cwd(), "src", "guided", "3-2-compare_code_reviews_oc.csv");
const picCsvPath = path.join(process.cwd(), "src", "guided", "3-2-compare_code_reviews_pic.csv");

console.log("Loading CSV files...");
const ocCodeReviews = readCSV<FlatCREntry>(ocCsvPath);
const picCodeReviews = readCSV<FlatCREntry>(picCsvPath);

console.log(`Loaded ${ocCodeReviews.length} OC code reviews and ${picCodeReviews.length} PIC code reviews`);

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let selectedOcCodeReviews = ocCodeReviews;
let selectedPicCodeReviews = picCodeReviews;

const randomlySample = false;
const randomSampleAmount = 300;

if (randomlySample) {
  // Randomly sample code reviews from each dataset
  const shuffledOcCodeReviews = shuffleArray(ocCodeReviews);
  const shuffledPicCodeReviews = shuffleArray(picCodeReviews);

  selectedOcCodeReviews = shuffledOcCodeReviews.slice(0, randomSampleAmount);
  selectedPicCodeReviews = shuffledPicCodeReviews.slice(0, randomSampleAmount);
}

console.log(
  `Selected ${selectedOcCodeReviews.length} OC code reviews and ${selectedPicCodeReviews.length} PIC code reviews`,
);

// Add source labels and combine
const combinedCodeReviews: CombinedCRRecord[] = [
  ...selectedOcCodeReviews.map((cr) => ({ ...cr, source: "OC" as const })),
  ...selectedPicCodeReviews.map((cr) => ({ ...cr, source: "PIC" as const })),
];

// Sort by the first column (id)
combinedCodeReviews.sort((a, b) => String(a.id).localeCompare(String(b.id)));

console.log(`Created combined dataset with ${combinedCodeReviews.length} code reviews total`);

// Convert to CSV format
const csvContent = Papa.unparse(combinedCodeReviews, {
  header: true,
  delimiter: ",",
});

// Save the combined dataset
const outputPath = path.join(__dirname, "combined-oc-pic-code-reviews.csv");
fs.writeFileSync(outputPath, csvContent);

console.log(`Combined dataset saved to: ${outputPath}`);

// Display summary statistics
const ocCount = combinedCodeReviews.filter((cr) => cr.source === "OC").length;
const picCount = combinedCodeReviews.filter((cr) => cr.source === "PIC").length;

console.log("\n=== Dataset Summary ===");
console.log(`Total code reviews: ${combinedCodeReviews.length}`);
console.log(`OC code reviews: ${ocCount} (${((ocCount / combinedCodeReviews.length) * 100).toFixed(1)}%)`);
console.log(`PIC code reviews: ${picCount} (${((picCount / combinedCodeReviews.length) * 100).toFixed(1)}%)`);
