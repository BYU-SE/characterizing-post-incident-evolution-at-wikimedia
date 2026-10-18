import Papa from "papaparse";
import fs from "fs";

const statusCols = ["isOpen", "isClosed", "isResolved", "isDeclined", "isDuplicate", "isInvalid"] as const;

function buildMatrix(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = Papa.parse<Record<string, string>>(raw, { header: true, skipEmptyLines: true });

  // Collect unique priorities
  const priorities = [...new Set(data.map(r => r.priority))].sort();

  // Build counts matrix
  const matrix: Record<string, Record<string, number>> = {};
  for (const p of priorities) {
    matrix[p] = {};
    for (const s of statusCols) {
      matrix[p][s] = 0;
    }
  }

  for (const row of data) {
    const p = row.priority;
    for (const s of statusCols) {
      if (row[s] === "true") {
        matrix[p][s]++;
      }
    }
  }

  // Print as table
  console.log(`\nFile: ${filePath}`);
  console.log(`Total rows: ${data.length}\n`);

  // Header
  const header = ["Priority", ...statusCols].map(h => h.padEnd(14)).join(" | ");
  console.log(header);
  console.log("-".repeat(header.length));

  for (const p of priorities) {
    const row = [p.padEnd(14), ...statusCols.map(s => String(matrix[p][s]).padEnd(14))].join(" | ");
    console.log(row);
  }

  // Median timeOpen per priority (only rows with a timeOpen value)
  const timesByPriority: Record<string, number[]> = {};
  for (const p of priorities) {
    timesByPriority[p] = [];
  }
  for (const row of data) {
    const t = row.timeOpen;
    if (t && t !== "" && t !== "0") {
      timesByPriority[row.priority].push(Number(t));
    }
  }

  function percentile(sorted: number[], p: number): number {
    const idx = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (idx - lower) * (sorted[upper] - sorted[lower]);
  }

  const MS_TO_DAYS = 1000 * 60 * 60 * 24;

  console.log(`\nMedian timeOpen by priority (days):\n`);
  console.log(`${"Priority".padEnd(14)} | ${"Median".padEnd(10)} | ${"IQR".padEnd(10)} | Count`);
  console.log("-".repeat(55));
  for (const p of priorities) {
    const times = timesByPriority[p].sort((a, b) => a - b);
    if (times.length === 0) {
      console.log(`${p.padEnd(14)} | ${"N/A".padEnd(10)} | ${"N/A".padEnd(10)} | 0`);
      continue;
    }
    const q1 = percentile(times, 25);
    const median = percentile(times, 50);
    const q3 = percentile(times, 75);
    const iqr = q3 - q1;
    const medianDays = (median / MS_TO_DAYS).toFixed(1);
    const iqrDays = (iqr / MS_TO_DAYS).toFixed(1);
    console.log(`${p.padEnd(14)} | ${medianDays.padStart(10)} | ${iqrDays.padStart(10)} | ${times.length}`);
  }
}

buildMatrix("src/guided/3-2-compare_tasks_pic.csv");
buildMatrix("src/guided/3-2-compare_tasks_oc.csv");
