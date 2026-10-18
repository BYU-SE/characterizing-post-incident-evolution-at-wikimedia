import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { load as cheerioLoad } from "cheerio";
import { extractDescription, phabricatorScrapedDir, phabricatorExtractedDir } from "./phabricator.js";

async function addDescriptionsToYAML() {
  const yamlFiles = readdirSync(phabricatorExtractedDir).filter((f) => f.endsWith(".yaml"));
  yamlFiles.sort(); // Deterministic processing

  let updated = 0;
  let skipped = 0;
  let alreadyHas = 0;

  for (const yamlFile of yamlFiles) {
    const phabId = yamlFile.slice(0, -5); // Remove .yaml extension
    const htmlPath = join(phabricatorScrapedDir, `${phabId}.html`);
    const yamlPath = join(phabricatorExtractedDir, yamlFile);

    // Skip if HTML file doesn't exist
    if (!existsSync(htmlPath)) {
      console.log(`Skipping ${phabId}: HTML file not found`);
      skipped++;
      continue;
    }

    // Read existing YAML file
    const yamlContent = readFileSync(yamlPath, "utf-8");

    // Check if gen_description already exists
    if (yamlContent.includes("gen_description:")) {
      alreadyHas++;
      continue;
    }

    // Extract description from HTML
    const htmlContent = readFileSync(htmlPath);
    const $ = cheerioLoad(htmlContent);
    const description = extractDescription($);

    // Insert gen_description field above gen_timeline_items
    const updatedYAML = insertDescriptionField(yamlContent, description);

    // Write back to file
    writeFileSync(yamlPath, updatedYAML, "utf-8");

    console.log(`Updated ${phabId}`);
    updated++;
  }

  console.log("\n=== Summary ===");
  console.log(`Updated: ${updated}`);
  console.log(`Already had description: ${alreadyHas}`);
  console.log(`Skipped (no HTML): ${skipped}`);
  console.log(`Total processed: ${yamlFiles.length}`);
}

function insertDescriptionField(yamlContent: string, description: string): string {
  // Find the line containing "gen_timeline_items:"
  const lines = yamlContent.split("\n");
  const timelineIndex = lines.findIndex((line) => line.trim().startsWith("gen_timeline_items:"));

  if (timelineIndex === -1) {
    console.warn("Could not find gen_timeline_items in YAML");
    return yamlContent;
  }

  // Format the description for YAML
  const yamlDescription = formatDescriptionForYAML(description);

  // Insert gen_description before gen_timeline_items
  lines.splice(timelineIndex, 0, yamlDescription);

  return lines.join("\n");
}

function formatDescriptionForYAML(description: string): string {
  if (!description || description.trim() === "") {
    return 'gen_description: ""';
  }

  // If description is multiline or contains special characters, use block scalar (|-)
  if (description.includes("\n") || description.length > 80) {
    const indentedLines = description.split("\n").map((line) => "  " + line).join("\n");
    return `gen_description: |-\n${indentedLines}`;
  }

  // For simple single-line descriptions, use quoted string
  const escaped = description.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
  return `gen_description: "${escaped}"`;
}

addDescriptionsToYAML();
