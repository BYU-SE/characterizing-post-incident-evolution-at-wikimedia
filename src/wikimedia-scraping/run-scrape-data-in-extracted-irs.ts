/*
Current understanding of  links:

phabricator.wikimedia.org

  These are change tasks. They may group many commits across many repos.

  - Want to scrape all Merge Requests in the "Details" box of the Task Page.
  - May want to scrape all Related Tasks in the "Related Objects" box. Not sure yet how to handle that.



gerrit.wikimedia.org

  These are code reviews. These will show how changes started and then evolved through feedback and approval or closure.

  - Want to scrape the most recent patchset ID, which can be found in the "Files" tab, with a copyable link.
  - May want to scrape how many patchsets there are and how changes evolved across time.
*/

import { parse } from "yaml";
import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import { irOutputDir, type GeneratedIR } from "./run-extract-irs.js";
import chalk from "chalk";
import { fetchPhabricator } from "./phabricator.js";
import { fetchGerrit } from "./gerrit.js";

// Entry point to scrape
export async function scrapeLinks() {
  console.log(chalk.yellow("Starting scrapeLinks()"));

  // go through the wikimedia-incident-reports-extract and find links in items[].gen_context_links[]:gen_link

  const phabricatorLinks: string[] = [];
  const gerritLinks: string[] = [];

  const irs = readdirSync(irOutputDir).filter((f) => f.endsWith(".yaml"));
  irs.forEach((irFile) => {
    const data = readFileSync(join(irOutputDir, irFile), "utf-8");
    const parsedData = parse(data) as GeneratedIR;

    parsedData.items.forEach((item) => {
      item.gen_context_links.forEach((link) => {
        if (link.gen_link.includes("phabricator.wikimedia.org")) phabricatorLinks.push(link.gen_link);
        else if (link.gen_link.includes("gerrit.wikimedia.org")) gerritLinks.push(link.gen_link);
      });
    });
  });

  console.log(chalk.green("Found", phabricatorLinks.length, "phabricator links"));
  console.log(chalk.green("Found", gerritLinks.length, "gerrit links"));

  for (let i = 0; i < phabricatorLinks.length; i++) {
    await fetchPhabricator(phabricatorLinks[i]);
  }
  for (let i = 0; i < gerritLinks.length; i++) {
    await fetchGerrit(gerritLinks[i]);
  }
}
