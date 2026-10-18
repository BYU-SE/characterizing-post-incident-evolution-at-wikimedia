import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import chalk from "chalk";
import {
  phabricatorScrapedDir,
  phabricatorExtractedDir,
  extractPhabricatorByPhabId,
  GeneratedTask,
} from "./phabricator.js";

// One-off backfill: walks every scraped Phabricator task HTML and re-runs
// extractPhabricatorByPhabId to populate the new gen_details_mrs[].gen_repo
// field. saveOverExistingYAML deepMerges by gen_hash, so existing entries get
// gen_repo added without disturbing other fields.

async function backfill() {
  const htmlFiles = readdirSync(phabricatorScrapedDir).filter((f) => f.endsWith(".html"));
  htmlFiles.sort();

  console.log(chalk.yellow(`Backfilling gen_repo for ${htmlFiles.length} task HTML files`));

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < htmlFiles.length; i++) {
    const phabId = htmlFiles[i].slice(0, -".html".length);

    // Skip if the YAML already has gen_repo populated on every MR
    const yamlPath = join(phabricatorExtractedDir, `${phabId}.yaml`);
    try {
      const existing = parse(readFileSync(yamlPath, "utf-8")) as GeneratedTask | null;
      const mrs = existing?.gen_details_mrs ?? [];
      if (mrs.length === 0 || mrs.every((m) => typeof m.gen_repo === "string" && m.gen_repo.length > 0)) {
        skipped++;
        continue;
      }
    } catch {
      // missing/unreadable yaml — fall through and (re-)extract
    }

    try {
      await extractPhabricatorByPhabId(phabId);
      updated++;
    } catch (e) {
      console.log(chalk.red(`Failed to extract ${phabId}: ${e}`));
      failed++;
    }

    if ((i + 1) % 200 === 0) {
      console.log(
        chalk.blue(`Progress: ${i + 1}/${htmlFiles.length} (updated=${updated}, skipped=${skipped}, failed=${failed})`)
      );
    }
  }

  console.log(chalk.green(`Done. updated=${updated}, skipped=${skipped}, failed=${failed}`));
}

backfill();
