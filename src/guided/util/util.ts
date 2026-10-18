import chalk from "chalk";
import { readFileSync } from "fs";
import Papa from "papaparse";
import { getExtensionCategory, type FileExtensionCategory } from "./file-extension-categories.js";

const unfoundFileExtensionMap: Record<string, number> = {};
const unfoundFileExtensionToFiles: Record<string, { file: string; metadata?: any }[]> = {};

/**
 * Converts a Git path string that may contain a rename statement
 * (e.g., `{from => to}`) into a clean file path.
 *
 * The function handles two types of rename statements:
 * 1. `{from => to}`: Replaces the 'from' part of the path with the 'to' part.
 * 2. `{from => }`: Removes the 'from' part from the path.
 *
 * If no rename statement is present, the original path is returned unchanged.
 *
 * @param gitPath The Git path string to convert.
 * @returns The cleaned file path string.
 */
function convertGitPath(gitPath: string): string {
  // Handle all rename patterns: {old => new}, {old => }, { => new}
  // This regex globally matches all rename patterns and processes them
  let cleanedPath = gitPath;

  // Process all rename patterns in the path
  cleanedPath = cleanedPath.replace(/\{([^}]*?)\s*=>\s*([^}]*?)\}/g, (match, from, to) => {
    // Return the "to" part, or empty string if "to" is empty
    return to.trim();
  });

  // Clean up any resulting double slashes, leading/trailing slashes
  cleanedPath = cleanedPath
    .replace(/\/+/g, "/") // Replace multiple slashes with single slash
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/\/+$/, ""); // Remove trailing slashes

  if (cleanedPath.endsWith("}") && !cleanedPath.includes("{")) {
    // recurse once
    return convertGitPath("{" + cleanedPath);
  }

  if (cleanedPath.endsWith("}")) cleanedPath = cleanedPath.slice(0, -1);

  return cleanedPath;
}

export function getFileExtensionType(file: string, exampleMetadata?: any): FileExtensionCategory | "other" {
  let normalPath = convertGitPath(file);

  // only consider after slash
  const slashLoc = normalPath.lastIndexOf("/");
  if (slashLoc != -1) {
    normalPath = normalPath.slice(slashLoc + 1);
  }

  let extension = "NONE";

  const extensions = normalPath.split(".").reverse();
  if (extensions.length == 1) {
    // if just a filename like MAKEFILE, try using the whole filename
    extension = normalPath.toLowerCase();
  } else {
    // iterate from the last most extension forward (its reversed above)
    for (const individualExtension of extensions) {
      // skip numbers
      if (!isNaN(parseInt(individualExtension))) {
        continue;
      }

      // break on the first normal extension
      extension = individualExtension;
      break;
    }
  }

  const category = getExtensionCategory(extension);
  if (category !== "other") return category;

  // Track unfound extensions for analysis
  unfoundFileExtensionMap[extension] = (unfoundFileExtensionMap[extension] || 0) + 1;

  if (!unfoundFileExtensionToFiles[extension]) {
    unfoundFileExtensionToFiles[extension] = [];
  }
  unfoundFileExtensionToFiles[extension].push({ file, metadata: exampleMetadata });

  return "other";
}

export function printUnfoundFileExtensionFiles(
  countThreshold: number,
  numExamples: number = 2,
  showMap: boolean = false
) {
  const extensions = Object.keys(unfoundFileExtensionMap);
  if (showMap) {
    console.log(
      chalk.red(Object.keys(unfoundFileExtensionMap).length),
      chalk.blue("Unfound File Extensions:"),
      JSON.stringify(unfoundFileExtensionMap)
    );
  }

  for (const ext of extensions) {
    // arbitrary threshold that we should tune downward
    if (unfoundFileExtensionToFiles[ext].length >= countThreshold) {
      console.log(
        chalk.red(
          `Ext: '.${ext}' Found ${unfoundFileExtensionToFiles[ext].length} instances.      Here are ${numExamples} examples:`
        )
      );
      for (let i = 0; i < numExamples; i++) {
        const randomSampleIndex = Math.floor(Math.random() * unfoundFileExtensionToFiles[ext].length);
        const example = unfoundFileExtensionToFiles[ext][randomSampleIndex];
        console.log(`${example.file}    Metadata: ${JSON.stringify(example.metadata)}`);
      }
    }
  }
}

export function calculateStats(values: number[]): {
  mean: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
} {
  if (values.length === 0) return { mean: 0, min: 0, q1: 0, median: 0, q3: 0, max: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const q1Index = Math.floor(sorted.length * 0.25);
  const medianIndex = Math.floor(sorted.length * 0.5);
  const q3Index = Math.floor(sorted.length * 0.75);

  return {
    mean: Math.round(mean * 100) / 100,
    min,
    q1: sorted[q1Index],
    median: sorted[medianIndex],
    q3: sorted[q3Index],
    max,
  };
}

export function countNumWordsInString(str: string) {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
}

/**
 * Convenience function to read CSV files with consistent Papa.parse options
 * @param filePath Path to the CSV file
 * @returns Parsed CSV data with header and dynamic typing enabled
 */
export function readCSV<T = any>(filePath: string): T[] {
  const csvContent = readFileSync(filePath, "utf-8");
  return Papa.parse<T>(csvContent, {
    header: true,
    dynamicTyping: true,
  }).data;
}

/**
 * Formats a time duration in milliseconds to the most intuitive unit.
 * Only increases unit when the larger unit would be >= 2.
 *
 * @param milliseconds Time duration in milliseconds
 * @returns Formatted string with value and unit (e.g., "45 minutes", "2.3 hours")
 */
export function formatTimeInIntuitiveUnits(milliseconds: number): string {
  const minutes = milliseconds / (1000 * 60);
  if (minutes < 120) {
    // Less than 2 hours
    return `${Math.round(minutes * 10) / 10} minutes`;
  }

  const hours = minutes / 60;
  if (hours < 48) {
    // Less than 2 days
    return `${Math.round(hours * 10) / 10} hours`;
  }

  const days = hours / 24;
  if (days < 14) {
    // Less than 2 weeks
    return `${Math.round(days * 10) / 10} days`;
  }

  const weeks = days / 7;
  if (weeks < 8.7) {
    // Less than ~2 months (8.7 weeks ≈ 2 months)
    return `${Math.round(weeks * 10) / 10} weeks`;
  }

  const months = days / 30.44; // Average days per month
  if (months < 24) {
    // Less than 2 years
    return `${Math.round(months * 10) / 10} months`;
  }

  const years = days / 365.25;
  return `${Math.round(years * 10) / 10} years`;
}

/**
 * Formats statistical values (mean, min, q1, median, q3, max) from milliseconds
 * to intuitive time units. Each stat is formatted independently.
 *
 * @param stats Object containing statistical values in milliseconds
 * @returns Object with formatted string values for each statistic
 */
export function formatStatsInIntuitiveUnits(stats: {
  mean: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}): {
  mean: string;
  min: string;
  q1: string;
  median: string;
  q3: string;
  max: string;
} {
  return {
    mean: formatTimeInIntuitiveUnits(stats.mean),
    min: formatTimeInIntuitiveUnits(stats.min),
    q1: formatTimeInIntuitiveUnits(stats.q1),
    median: formatTimeInIntuitiveUnits(stats.median),
    q3: formatTimeInIntuitiveUnits(stats.q3),
    max: formatTimeInIntuitiveUnits(stats.max),
  };
}
