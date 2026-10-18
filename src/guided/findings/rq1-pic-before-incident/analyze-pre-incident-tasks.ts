// Analyze tasks and code reviews that were created before the incident from which they were linked

import fs from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import { IR } from "../../../lib/ir.js";
import { Task } from "../../../lib/task.js";
import { DepthTracker } from "../../../lib/depth-tracker.js";
import { calculateStats } from "../../util/util.js";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SHOULD_OVERWRITE_YAML = false;

interface TaskCategory {
  count: number;
  ids: string[];
}

interface TaskSection {
  count: number;
  survived: {
    tasksWithCodeReview: TaskCategory;
    tasksWithChildTasks: TaskCategory;
  };
  died: {
    tasksWithoutCodeReviewsOrChildTasks: TaskCategory;
  };
}

interface TaskAfterSection {
  count: number;
  survived: {
    tasksWithCodeReviewAfter: TaskCategory;
    tasksWithChildTasksAfter: TaskCategory;
  };
  died: {
    tasksWithoutCodeReviewsOrChildTasksAfter: TaskCategory;
  };
}

interface IRData {
  ir: string;
  tasks: TaskSection;
  tasksAfter: TaskAfterSection;
}

interface DiffResult {
  ir: string;
  tasksCount: number;
  tasksAfterCount: number;
  diffs: Record<string, number>; // task ID -> days difference (negative = before incident)
}

// Load ir_summary.json
const irSummaryPath = path.join(process.cwd(), "src", "wikimedia-analysis", "ir_summary.json");
const irData: IRData[] = JSON.parse(fs.readFileSync(irSummaryPath, "utf-8"));

// Function to get IR date using IR.loadById
async function getIRDate(irName: string): Promise<Date | null> {
  try {
    const ir = await IR.loadById(irName);
    if (ir && ir.dto.gen_dates && ir.dto.gen_dates.length > 0) {
      return new Date(ir.dto.gen_dates[0].date);
    }
    return null;
  } catch (error) {
    console.warn(`Could not load IR date for ${irName}:`, error);
    return null;
  }
}

// Function to get task creation date and status using Task.loadById
async function getTaskInfo(taskId: string): Promise<{ date: Date | null; status: string | null }> {
  try {
    const task = await Task.loadById(taskId, DepthTracker.create(1));
    if (task) {
      let date: Date | null = null;
      if (task.dto.gen_createdDate) {
        // Parse date format: "2011-09-26 19:11:00 (UTC+0)"
        const dateStr = task.dto.gen_createdDate.split(" (")[0]; // Remove timezone part
        date = new Date(dateStr);
      }

      const status = task.dto.gen_status || null;
      return { date, status };
    }
    return { date: null, status: null };
  } catch (error) {
    console.warn(`Could not load task info for ${taskId}:`, error);
    return { date: null, status: null };
  }
}

// Function to get task creation date using Task.loadById (for backward compatibility)
async function getTaskCreationDate(taskId: string): Promise<Date | null> {
  const taskInfo = await getTaskInfo(taskId);
  return taskInfo.date;
}

// Function to calculate days difference (negative = task created before incident)
function calculateDaysDifference(taskDate: Date, incidentDate: Date): number {
  const diffMs = taskDate.getTime() - incidentDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.round(diffDays);
}

// Function to get all task IDs from a task section
function getAllTaskIds(taskSection: TaskSection | TaskAfterSection): string[] {
  const survived = taskSection.survived;
  const died = taskSection.died;

  let allIds: string[] = [];

  // Add survived task IDs
  if ("tasksWithCodeReview" in survived) {
    allIds = allIds.concat(survived.tasksWithCodeReview.ids);
    allIds = allIds.concat(survived.tasksWithChildTasks.ids);
  } else {
    // This is tasksAfter section
    const survivedAfter = survived as TaskAfterSection["survived"];
    allIds = allIds.concat(survivedAfter.tasksWithCodeReviewAfter.ids);
    allIds = allIds.concat(survivedAfter.tasksWithChildTasksAfter.ids);
  }

  // Add died task IDs
  if ("tasksWithoutCodeReviewsOrChildTasks" in died) {
    allIds = allIds.concat(died.tasksWithoutCodeReviewsOrChildTasks.ids);
  } else {
    // This is tasksAfter section
    const diedAfter = died as TaskAfterSection["died"];
    allIds = allIds.concat(diedAfter.tasksWithoutCodeReviewsOrChildTasksAfter.ids);
  }

  return allIds;
}

// Function to find the difference between two arrays
function arrayDiff(arr1: string[], arr2: string[]): string[] {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const diff: string[] = [];

  // Items in arr1 but not in arr2
  for (const item of set1) {
    if (!set2.has(item)) {
      diff.push(item);
    }
  }

  // Items in arr2 but not in arr1
  for (const item of set2) {
    if (!set1.has(item)) {
      diff.push(item);
    }
  }

  return diff;
}

// Analyze IRs with different task counts
const irsWithDifferentCounts: DiffResult[] = [];

for (const ir of irData) {
  const tasksCount = ir.tasks.count;
  const tasksAfterCount = ir.tasksAfter.count;

  // Check if counts are different
  if (tasksCount !== tasksAfterCount) {
    // Get all task IDs from both sections
    const tasksIds = getAllTaskIds(ir.tasks);
    const tasksAfterIds = getAllTaskIds(ir.tasksAfter);

    // Find the difference and calculate time differences
    const taskIdDiffs = arrayDiff(tasksIds, tasksAfterIds);
    const irDate = await getIRDate(ir.ir);
    const diffs: Record<string, number> = {};

    if (irDate) {
      for (const taskId of taskIdDiffs) {
        const taskInfo = await getTaskInfo(taskId);
        if (taskInfo.date) {
          diffs[taskId] = calculateDaysDifference(taskInfo.date, irDate);
        } else {
          diffs[taskId] = NaN; // Could not determine task date
        }
      }
    } else {
      // If we can't get IR date, mark all as NaN
      for (const taskId of taskIdDiffs) {
        diffs[taskId] = NaN;
      }
    }

    irsWithDifferentCounts.push({
      ir: ir.ir,
      tasksCount,
      tasksAfterCount,
      diffs,
    });
  }
}

// Display results
console.log("=== IRs with Different Task Counts ===");
console.log(`Found ${irsWithDifferentCounts.length} IRs with different task counts\n`);

for (const result of irsWithDifferentCounts) {
  console.log(`IR: ${result.ir}`);
  console.log(`  Tasks count: ${result.tasksCount}`);
  console.log(`  TasksAfter count: ${result.tasksAfterCount}`);
  console.log(`  Task differences:`);

  if (Object.keys(result.diffs).length === 0) {
    console.log(`    None`);
  } else {
    for (const [taskId, daysDiff] of Object.entries(result.diffs)) {
      if (isNaN(daysDiff)) {
        console.log(`    ${taskId}: Unable to calculate (missing date data)`);
      } else if (daysDiff < 0) {
        console.log(`    ${taskId}: ${Math.abs(daysDiff)} days BEFORE incident`);
      } else if (daysDiff > 0) {
        console.log(`    ${taskId}: ${daysDiff} days AFTER incident`);
      } else {
        console.log(`    ${taskId}: Same day as incident`);
      }
    }
  }
  console.log("");
}

// Collect all days before incident values and task statuses for statistics
const daysBeforeIncident: number[] = [];
const taskStatusCounts: Record<string, number> = {};
let totalTasksAnalyzed = 0;
let tasksWithValidDates = 0;
let preIncidentTasks: string[] = [];

for (const result of irsWithDifferentCounts) {
  for (const [taskId, daysDiff] of Object.entries(result.diffs)) {
    totalTasksAnalyzed++;
    if (!isNaN(daysDiff)) {
      tasksWithValidDates++;
      // Only include negative values (tasks created before incident)
      if (daysDiff < 0) {
        daysBeforeIncident.push(Math.abs(daysDiff));
        preIncidentTasks.push(taskId);
      }
    }
  }
}

// Collect status information for pre-incident tasks
console.log("\nCollecting task status information...");
for (const taskId of preIncidentTasks) {
  const taskInfo = await getTaskInfo(taskId);
  if (taskInfo.status) {
    const status = taskInfo.status.toLowerCase();
    taskStatusCounts[status] = (taskStatusCounts[status] || 0) + 1;
  } else {
    taskStatusCounts["unknown"] = (taskStatusCounts["unknown"] || 0) + 1;
  }
}

// Calculate and display statistics
console.log("\n=== Statistics for Tasks Created Before Incidents ===");
console.log(`Total tasks analyzed: ${totalTasksAnalyzed}`);
console.log(`Tasks with valid dates: ${tasksWithValidDates}`);
console.log(`Tasks created before incident: ${daysBeforeIncident.length}`);

if (daysBeforeIncident.length > 0) {
  const stats = calculateStats(daysBeforeIncident);
  console.log("\nDays before incident statistics:");
  console.log(`  Mean: ${stats.mean} days`);
  console.log(`  Median: ${stats.median} days`);
  console.log(`  Min: ${stats.min} days`);
  console.log(`  Max: ${stats.max} days`);
  console.log(`  Q1: ${stats.q1} days`);
  console.log(`  Q3: ${stats.q3} days`);
} else {
  console.log("\nNo tasks found that were created before their associated incidents.");
}

// Display task status statistics
console.log("\n=== Task Status Summary for Pre-Incident Tasks ===");
if (Object.keys(taskStatusCounts).length > 0) {
  console.log(`Total pre-incident tasks with status data: ${preIncidentTasks.length}`);
  console.log("\nStatus breakdown:");

  // Sort statuses by count (descending)
  const sortedStatuses = Object.entries(taskStatusCounts)
    .sort(([,a], [,b]) => b - a);

  for (const [status, count] of sortedStatuses) {
    const percentage = ((count / preIncidentTasks.length) * 100).toFixed(1);
    console.log(`  ${status.padEnd(20)}: ${count.toString().padStart(3)} tasks (${percentage}%)`);
  }
} else {
  console.log("No status information available for pre-incident tasks.");
}

// Save results to JSON file
const outputPath = path.join(__dirname, "pre-incident-task-analysis.json");
fs.writeFileSync(outputPath, JSON.stringify(irsWithDifferentCounts, null, 2));
console.log(`\nResults saved to: ${outputPath}`);

// Save results to YAML file if flag is set
if (SHOULD_OVERWRITE_YAML) {
  const yamlOutputPath = path.join(__dirname, "pre-incident-task-analysis.yaml");
  const yamlContent = yaml.stringify(irsWithDifferentCounts);
  fs.writeFileSync(yamlOutputPath, yamlContent);
  console.log(`YAML results saved to: ${yamlOutputPath}`);
}
