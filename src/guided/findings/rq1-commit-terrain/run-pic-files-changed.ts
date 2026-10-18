import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..", "..", "..", "..");
const gitLogDir = join(rootDir, "data", "wikimedia-gitlog");
const csvPath = join(rootDir, "src", "guided", "3-2-compare_commits_from_cr_pic.csv");

interface CommitRow {
  hash: string;
  repo: string;
}

const repos: { project: string; logFile: string }[] = [
  { project: "operations/puppet", logFile: "operations-puppet.json" },
  { project: "operations/mediawiki-config", logFile: "operations-mediawiki-config.json" },
  { project: "mediawiki/core", logFile: "mediawiki-core.json" },
];

const csv = readFileSync(csvPath, "utf-8");
const parsed = Papa.parse<CommitRow>(csv, { header: true, skipEmptyLines: true });

const shouldPrintCommitDetails = true;

for (const { project, logFile } of repos) {
  const hashes = new Set(parsed.data.filter((row) => row.repo === project).map((row) => row.hash));

  const gitLog = JSON.parse(readFileSync(join(gitLogDir, logFile), "utf-8")) as any[];

  const byHash = new Map(gitLog.map((c) => [c.commit, c]));

  console.log(`\n=== ${project} (${hashes.size} PIC commits) ===\n`);

  const fileCounts = new Map<string, number>();
  const dirCounts = new Map<string, number>();

  for (const hash of hashes) {
    const commit = byHash.get(hash);
    if (!commit) {
      shouldPrintCommitDetails && console.log(`${hash}: (not found in git log)`);
      continue;
    }
    const files: string[] = commit.stats?.files ?? [];
    shouldPrintCommitDetails && console.log(`${hash}:`);
    for (const f of files) {
      shouldPrintCommitDetails && console.log(`  ${f}`);
      fileCounts.set(f, (fileCounts.get(f) ?? 0) + 1);

      const parts = f.split("/");
      const dir = parts.length === 1 ? "(root)" : parts.slice(0, 2).join("/");
      dirCounts.set(dir, (dirCounts.get(dir) ?? 0) + 1);
    }
  }

  const top20Files = [...fileCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  const top20Dirs = [...dirCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);

  console.log(`\n--- Top 20 most changed files in ${project} ---`);
  for (const [file, count] of top20Files) {
    console.log(`  ${count}\t${file}`);
  }

  console.log(`\n--- Top 20 most changed directories (2 levels) in ${project} ---`);
  for (const [dir, count] of top20Dirs) {
    console.log(`  ${count}\t${dir}`);
  }
}
