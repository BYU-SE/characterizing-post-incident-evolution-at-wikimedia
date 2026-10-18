import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

interface CommitRow {
  hash: string;
  repo: string;
  date: string;
  numFileChanged: string;
  numInsertions: string;
  numDeletions: string;
  [key: string]: string;
}

interface RepoCount {
  repo: string;
  picCount: number;
  ocCount: number;
  total: number;
  medianFilesChanged: number;
  medianInsertions: number;
  medianDeletions: number;
}

function parseCSV(filePath: string): CommitRow[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = Papa.parse<CommitRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

function countCommitsByRepo(commits: CommitRow[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const commit of commits) {
    const repo = commit.repo;
    counts.set(repo, (counts.get(repo) || 0) + 1);
  }

  return counts;
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

function getRepoMedians(
  commits: CommitRow[],
  repo: string
): {
  medianFilesChanged: number;
  medianInsertions: number;
  medianDeletions: number;
} {
  const repoCommits = commits.filter((c) => c.repo === repo);

  const filesChanged = repoCommits.map((c) => parseInt(c.numFileChanged) || 0);
  const insertions = repoCommits.map((c) => parseInt(c.numInsertions) || 0);
  const deletions = repoCommits.map((c) => parseInt(c.numDeletions) || 0);

  return {
    medianFilesChanged: calculateMedian(filesChanged),
    medianInsertions: calculateMedian(insertions),
    medianDeletions: calculateMedian(deletions),
  };
}

function main() {
  // Read the CSV files
  const picPath = path.join(process.cwd(), "src", "guided", "3-2-compare_commits_pic.csv");
  const ocPath = path.join(process.cwd(), "src", "guided", "3-2-compare_commits_oc.csv");

  console.log("Reading PIC commits...");
  const picCommits = parseCSV(picPath);
  console.log(`Loaded ${picCommits.length} PIC commits`);

  console.log("Reading OC commits...");
  const ocCommits = parseCSV(ocPath);
  console.log(`Loaded ${ocCommits.length} OC commits`);

  // Count commits by repository
  const picCounts = countCommitsByRepo(picCommits);
  const ocCounts = countCommitsByRepo(ocCommits);

  // Get all unique repositories
  const allRepos = new Set([...picCounts.keys(), ...ocCounts.keys()]);

  // Create repo breakdown
  console.log("Calculating medians for each repository...");
  const repoBreakdown: RepoCount[] = [];
  for (const repo of allRepos) {
    const medians = getRepoMedians(picCommits, repo);

    repoBreakdown.push({
      repo,
      picCount: picCounts.get(repo) || 0,
      ocCount: ocCounts.get(repo) || 0,
      total: (picCounts.get(repo) || 0) + (ocCounts.get(repo) || 0),
      medianFilesChanged: medians.medianFilesChanged,
      medianInsertions: medians.medianInsertions,
      medianDeletions: medians.medianDeletions,
    });
  }

  // Sort by PIC commits (descending)
  repoBreakdown.sort((a, b) => b.picCount - a.picCount);

  // Get top 10 and aggregate the rest
  const top10 = repoBreakdown.slice(0, 10);
  const others = repoBreakdown.slice(10);

  // Calculate medians for "Other repos" by aggregating all commits from those repos
  const otherRepoNames = others.map((r) => r.repo);
  const otherRepoCommits = picCommits.filter((c) => otherRepoNames.includes(c.repo));
  const otherMedians = {
    medianFilesChanged: calculateMedian(otherRepoCommits.map((c) => parseInt(c.numFileChanged) || 0)),
    medianInsertions: calculateMedian(otherRepoCommits.map((c) => parseInt(c.numInsertions) || 0)),
    medianDeletions: calculateMedian(otherRepoCommits.map((c) => parseInt(c.numDeletions) || 0)),
  };

  const othersAggregate: RepoCount = {
    repo: "Other repos",
    picCount: others.reduce((sum, r) => sum + r.picCount, 0),
    ocCount: others.reduce((sum, r) => sum + r.ocCount, 0),
    total: others.reduce((sum, r) => sum + r.total, 0),
    medianFilesChanged: otherMedians.medianFilesChanged,
    medianInsertions: otherMedians.medianInsertions,
    medianDeletions: otherMedians.medianDeletions,
  };

  // Combine for final table - top 10 sorted by PIC, then "Other repos" at bottom
  const tableData = [...top10, othersAggregate];

  // Print table
  console.log("\n=== Repository Breakdown: Top 10 + Others ===\n");

  // Print header
  console.log(
    "Repository".padEnd(40) +
      "PIC".padStart(10) +
      "OC".padStart(10) +
      "Total".padStart(10) +
      "Med Files".padStart(12) +
      "Med Ins".padStart(12) +
      "Med Del".padStart(12)
  );
  console.log("=".repeat(106));

  // Print rows
  for (const row of tableData) {
    console.log(
      row.repo.padEnd(40) +
        row.picCount.toString().padStart(10) +
        row.ocCount.toString().padStart(10) +
        row.total.toString().padStart(10) +
        row.medianFilesChanged.toFixed(1).padStart(12) +
        row.medianInsertions.toFixed(1).padStart(12) +
        row.medianDeletions.toFixed(1).padStart(12)
    );
  }

  // Print totals
  console.log("=".repeat(106));
  const totalPic = tableData.reduce((sum, r) => sum + r.picCount, 0);
  const totalOc = tableData.reduce((sum, r) => sum + r.ocCount, 0);
  const totalAll = tableData.reduce((sum, r) => sum + r.total, 0);

  // Calculate overall medians
  const allFilesChanged = picCommits.map((c) => parseInt(c.numFileChanged) || 0);
  const allInsertions = picCommits.map((c) => parseInt(c.numInsertions) || 0);
  const allDeletions = picCommits.map((c) => parseInt(c.numDeletions) || 0);

  console.log(
    "TOTAL".padEnd(40) +
      totalPic.toString().padStart(10) +
      totalOc.toString().padStart(10) +
      totalAll.toString().padStart(10) +
      calculateMedian(allFilesChanged).toFixed(1).padStart(12) +
      calculateMedian(allInsertions).toFixed(1).padStart(12) +
      calculateMedian(allDeletions).toFixed(1).padStart(12)
  );

  console.log(`\nTotal unique repositories: ${allRepos.size}`);
  console.log(`Top 10 repositories shown, ${others.length} aggregated as "Other repos"`);
}

main();
