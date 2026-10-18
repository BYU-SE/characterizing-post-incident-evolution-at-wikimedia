import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { incidentReportBaseURL, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { delay } from "../wikimedia-scraping/util.js";

let depth = 1;

while (depth < 4) {
  for (const link of incidentReportLinks) {
    const irID = link.slice("/wiki/Incidents/".length);
    console.log(chalk.red(`Starting IR ${irID} with depth ${depth}`));
    await LookupIncremental.loadIncident(irID, depth);
  }
  depth++;
}
