import { readFileSync, writeFileSync } from "fs";
import Papa from "papaparse";
import { Task } from "../../../lib/task.js";

// Load all tasks first
Task.loadAll();

// Read the CSV
const csvPath = "src/guided/findings/rq1-do-tasks-finish-faster-because-of-incident/combined-oc-pic-tasks.csv";
const csvContent = readFileSync(csvPath, "utf-8");
const parsed = Papa.parse<Record<string, string>>(csvContent, { header: true });

// Helper to convert priority string to numerical value (same logic as Task class)
function priorityToNumericalValue(priority: string): number {
  switch (priority) {
    case "Unbreak Now!":
      return 5;
    case "High":
      return 4;
    case "Medium":
      return 3;
    case "Low":
      return 2;
    case "Lowest":
      return 1;
    case "Needs Triage":
    default:
      return 0;
  }
}

// Process each row
const results = parsed.data.map((row) => {
  const numPriorityChanges = parseInt(row.numPriorityChanges || "0", 10);

  let numPriorityIncreases = 0;
  let numPriorityDecreases = 0;

  if (numPriorityChanges > 0) {
    const task = Task.getById(row.id);
    if (task) {
      const priorities = task.getAllPriorities();

      // Compare consecutive priorities, skipping any involving "Needs Triage"
      for (let i = 1; i < priorities.length; i++) {
        const prev = priorities[i - 1];
        const curr = priorities[i];

        // Skip transitions involving "Needs Triage" - these are initial assignments, not real changes
        if (prev === "Needs Triage" || curr === "Needs Triage") {
          continue;
        }

        const prevValue = priorityToNumericalValue(prev);
        const currValue = priorityToNumericalValue(curr);

        if (currValue > prevValue) {
          numPriorityIncreases++;
        } else if (currValue < prevValue) {
          numPriorityDecreases++;
        }
        // If equal, it's neither increase nor decrease (could be a re-triage to same level)
      }
    } else {
      console.log(`Warning: Could not find task ${row.id}`);
    }
  }

  return {
    ...row,
    numPriorityIncreases,
    numPriorityDecreases,
  };
});

// Write output CSV
const outputCsv = Papa.unparse(results);
const outputPath = "src/guided/findings/rq1-do-tasks-finish-faster-because-of-incident/combined-oc-pic-tasks-with-priority-directions.csv";
writeFileSync(outputPath, outputCsv);

console.log(`Wrote ${results.length} rows to ${outputPath}`);

// Summary statistics
const tasksWithChanges = results.filter((r) => r.numPriorityIncreases > 0 || r.numPriorityDecreases > 0);
const totalIncreases = results.reduce((sum, r) => sum + r.numPriorityIncreases, 0);
const totalDecreases = results.reduce((sum, r) => sum + r.numPriorityDecreases, 0);

console.log(`\nSummary:`);
console.log(`Tasks with priority changes: ${tasksWithChanges.length}`);
console.log(`Total priority increases: ${totalIncreases}`);
console.log(`Total priority decreases: ${totalDecreases}`);
