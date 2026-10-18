import { readFileSync } from "fs";
import Papa from "papaparse";
import { Task } from "../lib/task.js";

// Load all tasks first
Task.loadAll();

// Read the CSV
const csvPath = "src/guided/3-2-compare_tasks_pic.csv";
const csvContent = readFileSync(csvPath, "utf-8");
const parsed = Papa.parse<Record<string, string>>(csvContent, { header: true });

// Helper to convert priority string to numerical value
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

// Analyze each task
interface TaskAnalysis {
  id: string;
  priority: string;
  numIncreases: number;
  numDecreases: number;
  numReprioritizations: number;
  priorities: string[];
}

const analyses: TaskAnalysis[] = [];

for (const row of parsed.data) {
  if (!row.id) continue;

  const task = Task.getById(row.id);
  if (!task) continue;

  const priorities = task.getAllPriorities();
  let numIncreases = 0;
  let numDecreases = 0;

  // Compare consecutive priorities, skipping Needs Triage
  for (let i = 1; i < priorities.length; i++) {
    const prev = priorities[i - 1];
    const curr = priorities[i];

    // Skip transitions involving "Needs Triage"
    if (prev === "Needs Triage" || curr === "Needs Triage") {
      continue;
    }

    const prevValue = priorityToNumericalValue(prev);
    const currValue = priorityToNumericalValue(curr);

    if (currValue > prevValue) {
      numIncreases++;
    } else if (currValue < prevValue) {
      numDecreases++;
    }
  }

  analyses.push({
    id: row.id,
    priority: row.priority,
    numIncreases,
    numDecreases,
    numReprioritizations: priorities.length - 1,
    priorities,
  });
}

// (1) Tasks with at least one increase AND ending priority is "Unbreak Now!" or "High"
const escalatedToHighPriority = analyses.filter(
  (a) => a.numIncreases >= 1 && (a.priority === "Unbreak Now!" || a.priority === "High")
);

console.log("=== (1) Tasks escalated to Unbreak Now! or High ===");
console.log(`Count: ${escalatedToHighPriority.length}`);
console.log("\nTask ID\t\tFinal Priority\t\tIncreases\tDecreases\tPriority History");
console.log("-".repeat(100));
for (const a of escalatedToHighPriority) {
  console.log(`${a.id}\t\t${a.priority}\t\t\t${a.numIncreases}\t\t${a.numDecreases}\t\t${a.priorities.join(" -> ")}`);
}

// (2) Tasks with more than 3 reprioritizations
const manyReprioritizations = analyses.filter((a) => a.numReprioritizations > 3);

console.log("\n\n=== (2) Tasks with more than 3 reprioritizations ===");
console.log(`Count: ${manyReprioritizations.length}`);
console.log("\nTask ID\t\tFinal Priority\t\tReprioritizations\tPriority History");
console.log("-".repeat(100));
for (const a of manyReprioritizations) {
  console.log(`${a.id}\t\t${a.priority}\t\t\t${a.numReprioritizations}\t\t\t${a.priorities.join(" -> ")}`);
}

// (3) Tasks with more increases than decreases
const moreIncreasesThanDecreases = analyses.filter((a) => a.numIncreases > a.numDecreases && a.numIncreases > 0);

console.log("\n\n=== (3) Tasks with more increases than decreases ===");
console.log(`Count: ${moreIncreasesThanDecreases.length}`);
console.log("\nTask ID\t\tFinal Priority\t\tIncreases\tDecreases\tPriority History");
console.log("-".repeat(100));
for (const a of moreIncreasesThanDecreases) {
  console.log(`${a.id}\t\t${a.priority}\t\t\t${a.numIncreases}\t\t${a.numDecreases}\t\t${a.priorities.join(" -> ")}`);
}
