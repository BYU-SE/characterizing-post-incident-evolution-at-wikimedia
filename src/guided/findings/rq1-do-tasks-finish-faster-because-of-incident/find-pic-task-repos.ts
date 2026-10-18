import chalk from "chalk";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";
import { Task } from "../../../lib/task.js";
import { DepthTracker } from "../../../lib/depth-tracker.js";
import { readCSV } from "../../util/util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CombinedTaskRow {
  id: string;
  source: "OC" | "PIC";
}

const inputPath = join(__dirname, "combined-oc-pic-tasks.csv");
const outputPath = join(__dirname, "task-repos.csv");

const rows = readCSV<CombinedTaskRow>(inputPath);
const taskRows = rows.filter((r) => r.id && r.source);

console.log(chalk.blue(`Loaded ${taskRows.length} task rows (OC + PIC) from combined-oc-pic-tasks.csv`));

// taskId -> { source, repos }
const taskRepos = new Map<string, { source: "OC" | "PIC"; repos: Set<string> }>();

for (const row of taskRows) {
  // depth 0 — we only need the YAML's gen_details_mrs[].gen_repo, no relation loading
  const task = await Task.loadById(row.id, DepthTracker.create(0, "find-task-repos"));
  if (!task) {
    console.log(chalk.yellow(`Could not load Task ${row.id}`));
    continue;
  }

  const repos = new Set<string>();
  for (const mr of task.dto.gen_details_mrs) {
    if (mr.gen_repo) repos.add(mr.gen_repo);
  }
  taskRepos.set(row.id, { source: row.source, repos });
}

const flatRows: { taskId: string; source: "OC" | "PIC"; repo: string }[] = [];
for (const [taskId, { source, repos }] of taskRepos) {
  if (repos.size === 0) {
    flatRows.push({ taskId, source, repo: "" });
  } else {
    for (const repo of repos) {
      flatRows.push({ taskId, source, repo });
    }
  }
}

writeFileSync(outputPath, Papa.unparse(flatRows, { header: true }));
console.log(chalk.green(`Wrote ${flatRows.length} rows to ${outputPath}`));

// repo -> { pic: count, oc: count }
const repoCounts = new Map<string, { pic: number; oc: number }>();
for (const [, { source, repos }] of taskRepos) {
  for (const repo of repos) {
    if (!repoCounts.has(repo)) repoCounts.set(repo, { pic: 0, oc: 0 });
    const c = repoCounts.get(repo)!;
    if (source === "PIC") c.pic++;
    else c.oc++;
  }
}

const summarize = (filter: (v: { source: "OC" | "PIC"; repos: Set<string> }) => boolean) => {
  const entries = [...taskRepos.values()].filter(filter);
  const withRepo = entries.filter((v) => v.repos.size > 0).length;
  return { total: entries.length, withRepo, withoutRepo: entries.length - withRepo };
};

const picStats = summarize((v) => v.source === "PIC");
const ocStats = summarize((v) => v.source === "OC");

console.log(chalk.cyan("\n=== Summary ==="));
console.log(`PIC: ${picStats.withRepo}/${picStats.total} tasks have at least one repo`);
console.log(`OC:  ${ocStats.withRepo}/${ocStats.total} tasks have at least one repo`);

const sorted = [...repoCounts.entries()].sort(
  (a, b) => b[1].pic + b[1].oc - (a[1].pic + a[1].oc)
);
console.log(chalk.cyan("\n=== Tasks per repo (PIC | OC | total) ==="));
for (const [repo, { pic, oc }] of sorted) {
  console.log(`  ${pic}\t${oc}\t${pic + oc}\t${repo}`);
}
