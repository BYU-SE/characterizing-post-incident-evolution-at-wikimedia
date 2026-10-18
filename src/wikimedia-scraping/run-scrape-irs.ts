import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { cleanIRLink, incidentReportBaseURL, incidentReportLinks } from "./incident-reports.js";
import { existsSync, writeFileSync } from "fs";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const scrapedIncidentReportsDir = join(__dirname, "..", "..", "data", "wikimedia-incident-reports");

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchReport(incidentReportLink: string) {
  let id = cleanIRLink(incidentReportLink).slice("/wiki/Incidents/".length);

  let scrapedFileName = join(scrapedIncidentReportsDir, `${id}.html`);

  if (existsSync(scrapedFileName)) return;

  console.log("Fetching", incidentReportLink, "and saving to", scrapedFileName);

  let resp = await fetch(incidentReportBaseURL + incidentReportLink, {
    headers: {
      "User-Agent":
        "byu.edu Software Engineering Lab - Understanding Post-Incident Changes Scraping Bot (matt4530@byu.edu)",
    },
  });
  let text = await resp.text();

  writeFileSync(scrapedFileName, text);

  let secondsToWait = 2 + Math.floor(Math.random() * 5);
  await delay(secondsToWait * 1000);
}

// Entry point to scrape
export async function scrapeReports() {
  console.log(chalk.yellow("Starting scrapeReports()"));

  for (let i = 0; i < incidentReportLinks.length; i++) {
    await fetchReport(incidentReportLinks[i]);
  }
}

//await scrapeReports();