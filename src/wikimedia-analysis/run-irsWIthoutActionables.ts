import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { IR } from "../lib/ir.js";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { SummaryOfLifecycle } from "./summary-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const json = readFileSync(join(__dirname, "lifecycle_summary.json"), "utf-8");
const data = JSON.parse(json) as SummaryOfLifecycle;
console.log(data);
const irIDs = data.irs.died!.irsWithoutActionables.ids!;

const irs: IR[] = [];

for (const id of irIDs) {
  const ir = await LookupIncremental.loadIncident(id, 2);
  if (!ir) throw "could not load ir";

  irs.push(ir);
}

irs.forEach((ir, index) => {
  if (!ir.dto.item_extraction_notes) {
    console.log(`${index + 1}) Finish checking`, ir.reportURL);
  }
});
