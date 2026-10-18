import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CommitRow {
  hash: string;
  repo: string;
  date: string;
  isMerge: string;
  numFileChanged: string;
  numInsertions: string;
  numDeletions: string;
  numFileExtScripting: string;
  numFileExtWeb: string;
  numFileExtConfig: string;
  numFileExtInfrastructure: string;
  numFileExtTest: string;
  numFileExtData: string;
  numFileExtDocumentation: string;
  numFileExtImage: string;
  numFileExtTemplate: string;
  numFileExtAssets: string;
  numFileExtOther: string;
  commitMessageLength: string;
  commitMessageNumWords: string;
}

const allRepoCommits = new Map<string, string[]>();
const allCommits: string[] = [];

const csvPath = join(__dirname, "..", "..", "3-2-compare_commits_pic.csv");
const csvContent = readFileSync(csvPath, "utf-8");

const parsed = Papa.parse<CommitRow>(csvContent, {
  header: true,
  skipEmptyLines: true,
});

for (const row of parsed.data) {
  const hash = row.hash;
  const repo = row.repo;

  if (!hash || !repo) {
    continue;
  }

  allCommits.push(hash);

  const arr = allRepoCommits.get(repo) || [];
  arr.push(hash);
  allRepoCommits.set(repo, arr);
}

// unique the commits
for (const key of allRepoCommits.keys()) {
  const arr = allRepoCommits.get(key);
  if (arr) {
    const newArr = [...new Set(arr)];
    allRepoCommits.set(key, newArr);
  }
}

// hack to get counts
const counts: Record<string, number> = {};
for (const [k, v] of Object.entries(Object.fromEntries(allRepoCommits))) {
  counts[k] = v.length;
}

const results: any = {
  reposCommitCounts: counts,
  reposCommits: Object.fromEntries(allRepoCommits),
  commits: [...new Set(allCommits)].sort(),
};

writeFileSync(join(__dirname, "repo_summary_from_commits.json"), JSON.stringify(results, null, "  "));

console.log(`Processed ${allCommits.length} total commits`);
console.log(`Found ${[...new Set(allCommits)].length} unique commits`);
console.log(`Across ${allRepoCommits.size} repositories`);
console.log(`Output written to: ${join(__dirname, "repo_summary_from_commits.json")}`);
