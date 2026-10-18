import { readFileSync } from "fs";
import Papa from "papaparse";

// Read the CSV
const csvPath = "src/guided/3-2-compare_tasks_pic.csv";
const csvContent = readFileSync(csvPath, "utf-8");
const parsed = Papa.parse<Record<string, string>>(csvContent, { header: true });

// Filter to rows with valid timeOpen and isResolved = true
const rows = parsed.data.filter((row) => row.timeOpen && row.timeOpen.length > 0 && row.priority && row.isResolved === "true");

// Group by priority
const byPriority: Record<string, { id: string; timeOpen: number }[]> = {};
for (const row of rows) {
  const priority = row.priority;
  const timeOpen = parseInt(row.timeOpen, 10);
  if (isNaN(timeOpen)) continue;

  if (!byPriority[priority]) {
    byPriority[priority] = [];
  }
  byPriority[priority].push({ id: row.id, timeOpen });
}

// Helper to calculate median
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

// For each priority, find tasks above median and rank them
for (const priority of Object.keys(byPriority).sort()) {
  const tasks = byPriority[priority];
  const medianTime = median(tasks.map((t) => t.timeOpen));

  // Filter to above median
  const aboveMedian = tasks.filter((t) => t.timeOpen > medianTime);

  // Sort by timeOpen descending (slowest first) and assign rank
  aboveMedian.sort((a, b) => b.timeOpen - a.timeOpen);

  console.log(`\n=== Priority: ${priority} ===`);
  console.log(`Median timeOpen: ${medianTime} ms (${(medianTime / 1000 / 60 / 60 / 24).toFixed(1)} days)`);
  console.log(`Tasks above median: ${aboveMedian.length} / ${tasks.length}`);
  console.log(`\nTask ID\t\tSlowness Rank\tTime Open (days)`);
  console.log("-".repeat(50));

  aboveMedian.forEach((task, index) => {
    const rank = index + 1;
    const days = (task.timeOpen / 1000 / 60 / 60 / 24).toFixed(1);
    console.log(`${task.id}\t\t${rank}\t\t${days}`);
  });
}
