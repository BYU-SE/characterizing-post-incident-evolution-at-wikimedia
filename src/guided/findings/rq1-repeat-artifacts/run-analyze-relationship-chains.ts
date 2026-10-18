// Which artifacts are repeatedly sourced, from different incidents. Why?
import fs, { writeFileSync } from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type RelationshipChainsFile = Record<string, string[]>;

const relationshipChainsPath = path.join(
  process.cwd(),
  "src",
  "wikimedia-analysis",
  "relationship_chains.json"
);
const all = JSON.parse(fs.readFileSync(relationshipChainsPath, "utf-8")) as RelationshipChainsFile;

const keyedSome = Object.keys(all)
  .filter((key) => all[key].length > 1)
  .map((key) => ({ key, stamps: all[key] }));

// Any item IRs
const itemsFromMultipleIRs = keyedSome.filter((item) => {
  // count the number of IRs. Must be > 1
  return [...new Set(item.stamps.map((stamp) => stamp.split("=>")[1]))].length > 1;
});

const outputDir = join(__dirname, "multiple_irs_items.json");
writeFileSync(outputDir, JSON.stringify(itemsFromMultipleIRs, null, "  "));

// Analysis: 2x2 grid based on IR count and linkage type
const analysisGrid: Record<string, any[]> = {
  "2_IRs_direct": [],
  "2plus_IRs_direct": [],
  "2_IRs_deep": [],
  "2plus_IRs_deep": [],
};

itemsFromMultipleIRs.forEach((item) => {
  const uniqueIRs = [...new Set(item.stamps.map((stamp) => stamp.split("=>")[1]))];
  const irCount = uniqueIRs.length;

  // Determine if it's direct or deep linked
  const isTask = item.key.startsWith("T");
  let isDirect = false;

  // Check if any stamp represents direct linkage
  for (const stamp of item.stamps) {
    const parts = stamp.split("=>");
    if (isTask) {
      // For tasks: direct is 3 parts, deep is 4+
      isDirect = parts.length === 3;
    } else {
      // For code reviews: direct is 3 parts, or 4 if middle is a Task
      if (parts.length === 3) {
        isDirect = true;
      } else if (parts.length === 4 && parts[1].trim().startsWith("T")) {
        isDirect = true;
      }
    }
    if (isDirect) break;
  }

  // Categorize into the 2x2 grid
  if (irCount === 2) {
    if (isDirect) {
      analysisGrid["2_IRs_direct"].push(item);
    } else {
      analysisGrid["2_IRs_deep"].push(item);
    }
  } else {
    // 2+ IRs
    if (isDirect) {
      analysisGrid["2plus_IRs_direct"].push(item);
    } else {
      analysisGrid["2plus_IRs_deep"].push(item);
    }
  }
});

// Print the 2x2 grid
console.log("\n=== 2x2 Analysis Grid ===");
console.log("IR Count vs Linkage Type Distribution:");
console.log("");
console.log("┌─────────────────┬──────────────────┬──────────────────┐");
console.log("│                 │   2 IRs          │   2+ IRs         │");
console.log("├─────────────────┼──────────────────┼──────────────────┤");
console.log(
  `│ Direct Linkage  │ ${analysisGrid["2_IRs_direct"].length.toString().padStart(8)} items   │ ${analysisGrid[
    "2plus_IRs_direct"
  ].length
    .toString()
    .padStart(8)} items   │`
);
console.log("├─────────────────┼──────────────────┼──────────────────┤");
console.log(
  `│ Deep Linkage    │ ${analysisGrid["2_IRs_deep"].length.toString().padStart(8)} items   │ ${analysisGrid[
    "2plus_IRs_deep"
  ].length
    .toString()
    .padStart(8)} items   │`
);
console.log("└─────────────────┴──────────────────┴──────────────────┘");
console.log("");

// Print some examples from each category
console.log("=== Examples from each category ===");
Object.entries(analysisGrid).forEach(([category, items]) => {
  console.log(`\n${category.replace(/_/g, " ").toUpperCase()}:`);
  items.slice(0, 3).forEach((item) => {
    console.log(`  - ${item.key}: ${item.stamps[0]}`);
  });
  if (items.length > 3) {
    console.log(`  ... and ${items.length - 3} more`);
  }
});

// Save the analysis grid to a JSON file
const groupedItemsPath = join(__dirname, "grouped_items.json");
writeFileSync(groupedItemsPath, JSON.stringify(analysisGrid, null, "  "));
console.log(`\nAnalysis results saved to: ${groupedItemsPath}`);
