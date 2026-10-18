// Create a combined dataset with 300 tasks each from OC and PIC datasets

import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readCSV } from "../../util/util.js";
import Papa from "papaparse";
import { FlatTaskEntry } from "../../../lib/task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Gemini recommends
// id -> id
// time to completion days -> timeOpen
// is resolved -> isResolved
// task_creation_date ->

interface CombinedTaskRecord extends FlatTaskEntry {
  source: "OC" | "PIC"; // OC = Other Context, PIC = Post-Incident Context
}

// Load the two CSV files
const ocCsvPath = path.join(process.cwd(), "src", "guided", "3-2-compare_tasks_oc.csv");
const picCsvPath = path.join(process.cwd(), "src", "guided", "3-2-compare_tasks_pic.csv");

console.log("Loading CSV files...");
const ocTasks = readCSV<FlatTaskEntry>(ocCsvPath);
const picTasks = readCSV<FlatTaskEntry>(picCsvPath);

console.log(`Loaded ${ocTasks.length} OC tasks and ${picTasks.length} PIC tasks`);

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let selectedOcTasks = ocTasks;
let selectedPicTasks = picTasks;

const randomlySample = false;
const randomSampleAmout = 300;

if (randomlySample) {
  // Randomly sample 300 tasks from each dataset
  const shuffledOcTasks = shuffleArray(ocTasks);
  const shuffledPicTasks = shuffleArray(picTasks);

  selectedOcTasks = shuffledOcTasks.slice(0, randomSampleAmout);
  selectedPicTasks = shuffledPicTasks.slice(0, randomSampleAmout);
}

console.log(`Selected ${selectedOcTasks.length} OC tasks and ${selectedPicTasks.length} PIC tasks`);

// Add source labels and combine
const combinedTasks: CombinedTaskRecord[] = [
  ...selectedOcTasks.map((task) => ({ ...task, source: "OC" as const })),
  ...selectedPicTasks.map((task) => ({ ...task, source: "PIC" as const })),
];

// Sort by the first column (id)
combinedTasks.sort((a, b) => String(a.id).localeCompare(String(b.id)));

console.log(`Created combined dataset with ${combinedTasks.length} tasks total`);

// Convert to CSV format
const csvContent = Papa.unparse(combinedTasks, {
  header: true,
  delimiter: ",",
});

// Save the combined dataset
const outputPath = path.join(__dirname, "combined-oc-pic-tasks.csv");
fs.writeFileSync(outputPath, csvContent);

console.log(`Combined dataset saved to: ${outputPath}`);

// Display summary statistics
const ocCount = combinedTasks.filter((task) => task.source === "OC").length;
const picCount = combinedTasks.filter((task) => task.source === "PIC").length;

console.log("\n=== Dataset Summary ===");
console.log(`Total tasks: ${combinedTasks.length}`);
console.log(`OC tasks: ${ocCount} (${((ocCount / combinedTasks.length) * 100).toFixed(1)}%)`);
console.log(`PIC tasks: ${picCount} (${((picCount / combinedTasks.length) * 100).toFixed(1)}%)`);
