import chalk from "chalk";
import { extractPhabricatorByLink, phabricatorExtractedDir } from "../wikimedia-scraping/phabricator.js";
import { readdirSync } from "fs";

console.log(chalk.yellow("Starting phab timeline extract()"));

let dir = readdirSync(phabricatorExtractedDir).filter((f) => f.endsWith(".yaml"));

for (const fileName of dir) {
  const id = fileName.split(".yaml")[0]!;
  await extractPhabricatorByLink("https://phabricator.wikimedia.org/" + id);
}
