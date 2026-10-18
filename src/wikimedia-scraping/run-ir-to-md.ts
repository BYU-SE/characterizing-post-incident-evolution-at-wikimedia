import * as cheerio from "cheerio";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { scrapedIncidentReportsDir } from "./run-scrape-irs.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { incidentReportBaseURL } from "./incident-reports.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { fastHash, saveOverExistingYAML } from "./util.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = join(__dirname, "..", "..", "data", "wikimedia-incident-reports-extract-md");

// Entry point to scrape
async function convert() {
  console.log(chalk.yellow("Starting convert()"));

  let dir = readdirSync(scrapedIncidentReportsDir).filter((f) => f.endsWith(".html"));

  let all = "";

  // deterministic processing
  dir.sort();

  const nhm = new NodeHtmlMarkdown();

  dir.forEach((reportFileName, index) => {
    const fileData = readFileSync(join(scrapedIncidentReportsDir, reportFileName));
    const $ = cheerio.load(fileData);

    let content = $($("#content").get()[0]).html()!;
    const md = nhm.translate(content);

    // trim it on down
    const header = md.slice(md.indexOf("# Incidents/"), md.indexOf("* [Page]") - 1);
    const body = md.slice(
      md.indexOf(`< [Incidents](/wiki/Incidents "Incidents")`) +
        `< [Incidents](/wiki/Incidents "Incidents")`.length +
        1,
      md.indexOf(`Retrieved from "<https://wikitech.wikimedia.org`)
    );

    all += index > 0 ? "\n\n" : "" + header + body;
  });

  const fileName = join(outputDir, "all.md");
  writeFileSync(fileName, all);
}

await convert();
