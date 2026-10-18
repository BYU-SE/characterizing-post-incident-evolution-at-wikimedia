import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

interface CommitRow {
  hash: string;
  repo: string;
  hasMetadata: string;
  [key: string]: string;
}

interface RepoCount {
  repo: string;
  picCount: number;
  ocCount: number;
  total: number;
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
  }
  return sorted[mid];
}

function main() {
  // Read the CSV files
  const picPath = path.join(process.cwd(), "src", "guided", "3-2-compare_commits_from_cr_pic.csv");
  const ocPath = path.join(process.cwd(), "src", "guided", "3-2-compare_commits_from_cr_oc.csv");

  console.log("Reading PIC commits (from CR)...");
  const picCommits = parseCSV(picPath);
  console.log(`Loaded ${picCommits.length} PIC commits`);

  console.log("Reading OC commits (from CR)...");
  const ocCommits = parseCSV(ocPath);
  console.log(`Loaded ${ocCommits.length} OC commits`);

  // Count commits by repository
  const picCounts = countCommitsByRepo(picCommits);
  const ocCounts = countCommitsByRepo(ocCommits);

  // Get all unique repositories
  const allRepos = new Set([...picCounts.keys(), ...ocCounts.keys()]);

  // Create repo breakdown
  const repoBreakdown: RepoCount[] = [];
  for (const repo of allRepos) {
    repoBreakdown.push({
      repo,
      picCount: picCounts.get(repo) || 0,
      ocCount: ocCounts.get(repo) || 0,
      total: (picCounts.get(repo) || 0) + (ocCounts.get(repo) || 0),
    });
  }

  // Sort by PIC commits (descending)
  repoBreakdown.sort((a, b) => b.picCount - a.picCount);

  // Get top 10 and aggregate the rest
  const top10 = repoBreakdown.slice(0, 10);
  const others = repoBreakdown.slice(10);

  const othersAggregate: RepoCount = {
    repo: "Other repos",
    picCount: others.reduce((sum, r) => sum + r.picCount, 0),
    ocCount: others.reduce((sum, r) => sum + r.ocCount, 0),
    total: others.reduce((sum, r) => sum + r.total, 0),
  };

  // Combine for final table - top 10 sorted by PIC, then "Other repos" at bottom
  const tableData = [...top10, othersAggregate];

  // Print table
  console.log("\n=== Repository Breakdown (from Code Reviews): Top 10 + Others ===\n");

  // Print header
  console.log(
    "Repository".padEnd(40) +
      "PIC".padStart(10) +
      "OC".padStart(10) +
      "Total".padStart(10)
  );
  console.log("=".repeat(70));

  // Print rows
  for (const row of tableData) {
    console.log(
      row.repo.padEnd(40) +
        row.picCount.toString().padStart(10) +
        row.ocCount.toString().padStart(10) +
        row.total.toString().padStart(10)
    );
  }

  // Print totals
  console.log("=".repeat(70));
  const totalPic = tableData.reduce((sum, r) => sum + r.picCount, 0);
  const totalOc = tableData.reduce((sum, r) => sum + r.ocCount, 0);
  const totalAll = tableData.reduce((sum, r) => sum + r.total, 0);

  console.log(
    "TOTAL".padEnd(40) +
      totalPic.toString().padStart(10) +
      totalOc.toString().padStart(10) +
      totalAll.toString().padStart(10)
  );

  console.log(`\nTotal unique repositories: ${allRepos.size}`);
  console.log(`Top 10 repositories shown, ${others.length} aggregated as "Other repos"`);

  // Second table: sorted by OC popularity
  const repoBreakdownByOC = [...repoBreakdown].sort((a, b) => b.ocCount - a.ocCount);

  const top10OC = repoBreakdownByOC.slice(0, 10);
  const othersOC = repoBreakdownByOC.slice(10);

  const othersOCAggregate: RepoCount = {
    repo: "Other repos",
    picCount: othersOC.reduce((sum, r) => sum + r.picCount, 0),
    ocCount: othersOC.reduce((sum, r) => sum + r.ocCount, 0),
    total: othersOC.reduce((sum, r) => sum + r.total, 0),
  };

  const tableDataOC = [...top10OC, othersOCAggregate];

  console.log("\n=== Repository Breakdown (from Code Reviews): Top 10 by OC + Others ===\n");

  console.log(
    "Repository".padEnd(40) +
      "PIC".padStart(10) +
      "OC".padStart(10) +
      "Total".padStart(10)
  );
  console.log("=".repeat(70));

  for (const row of tableDataOC) {
    console.log(
      row.repo.padEnd(40) +
        row.picCount.toString().padStart(10) +
        row.ocCount.toString().padStart(10) +
        row.total.toString().padStart(10)
    );
  }

  console.log("=".repeat(70));
  console.log(
    "TOTAL".padEnd(40) +
      totalPic.toString().padStart(10) +
      totalOc.toString().padStart(10) +
      totalAll.toString().padStart(10)
  );

  console.log(`\nTop 10 repositories by OC shown, ${othersOC.length} aggregated as "Other repos"`);

  // Third table: sorted by PIC popularity, with OC rank and median metrics
  const ocRankMap = new Map<string, number>();
  repoBreakdownByOC.forEach((r, i) => ocRankMap.set(r.repo, i + 1));

  // Filter to only rows with metadata for median calculations
  const picWithMetadata = picCommits.filter((c) => c.hasMetadata === "true");
  const ocWithMetadata = ocCommits.filter((c) => c.hasMetadata === "true");

  function getRepoMedians(commits: CommitRow[], repo: string) {
    const repoCommits = commits.filter((c) => c.repo === repo);
    if (repoCommits.length === 0) return null;
    return {
      medianFilesChanged: calculateMedian(repoCommits.map((c) => parseInt(c.numFileChanged) || 0)),
      medianInsertions: calculateMedian(repoCommits.map((c) => parseInt(c.numInsertions) || 0)),
      medianDeletions: calculateMedian(repoCommits.map((c) => parseInt(c.numDeletions) || 0)),
    };
  }

  // Only include repos where at least one side has metadata
  const top10WithMetadata = top10.filter((r) => {
    const picM = getRepoMedians(picWithMetadata, r.repo);
    const ocM = getRepoMedians(ocWithMetadata, r.repo);
    return picM != null || ocM != null;
  });

  console.log("\n=== Repository Breakdown (from Code Reviews): Top 10 by PIC with OC Rank + Medians ===\n");

  const hdr =
    "Repository".padEnd(40) +
    "PIC".padStart(16) +
    "OC".padStart(20) +
    "MdFiles(P)".padStart(12) +
    "MdIns(P)".padStart(10) +
    "MdDel(P)".padStart(10) +
    "MdFiles(O)".padStart(12) +
    "MdIns(O)".padStart(10) +
    "MdDel(O)".padStart(10);
  console.log(hdr);
  console.log("=".repeat(hdr.length));

  for (const row of top10WithMetadata) {
    const ocRank = ocRankMap.get(row.repo);
    const ocStr = ocRank != null
      ? `${row.ocCount} (#${ocRank})`
      : row.ocCount.toString();
    const picPct = ((row.picCount / totalPic) * 100).toFixed(1);
    const ocPct = ((row.ocCount / totalOc) * 100).toFixed(1);
    const picStr = `${row.picCount} (${picPct}%)`;

    const picM = getRepoMedians(picWithMetadata, row.repo);
    const ocM = getRepoMedians(ocWithMetadata, row.repo);

    console.log(
      row.repo.padEnd(40) +
        picStr.padStart(16) +
        `${ocStr} (${ocPct}%)`.padStart(20) +
        (picM ? picM.medianFilesChanged.toFixed(1) : "-").padStart(12) +
        (picM ? picM.medianInsertions.toFixed(1) : "-").padStart(10) +
        (picM ? picM.medianDeletions.toFixed(1) : "-").padStart(10) +
        (ocM ? ocM.medianFilesChanged.toFixed(1) : "-").padStart(12) +
        (ocM ? ocM.medianInsertions.toFixed(1) : "-").padStart(10) +
        (ocM ? ocM.medianDeletions.toFixed(1) : "-").padStart(10)
    );
  }

  // Others aggregate with medians
  const otherRepoNames = others.map((r) => r.repo);
  const otherPicM = picWithMetadata.filter((c) => otherRepoNames.includes(c.repo));
  const otherOcM = ocWithMetadata.filter((c) => otherRepoNames.includes(c.repo));

  const otherPicMedians = otherPicM.length > 0 ? {
    medianFilesChanged: calculateMedian(otherPicM.map((c) => parseInt(c.numFileChanged) || 0)),
    medianInsertions: calculateMedian(otherPicM.map((c) => parseInt(c.numInsertions) || 0)),
    medianDeletions: calculateMedian(otherPicM.map((c) => parseInt(c.numDeletions) || 0)),
  } : null;
  const otherOcMedians = otherOcM.length > 0 ? {
    medianFilesChanged: calculateMedian(otherOcM.map((c) => parseInt(c.numFileChanged) || 0)),
    medianInsertions: calculateMedian(otherOcM.map((c) => parseInt(c.numInsertions) || 0)),
    medianDeletions: calculateMedian(otherOcM.map((c) => parseInt(c.numDeletions) || 0)),
  } : null;

  const otherPicPct = ((othersAggregate.picCount / totalPic) * 100).toFixed(1);
  const otherOcPct = ((othersAggregate.ocCount / totalOc) * 100).toFixed(1);
  console.log(
    "Other repos".padEnd(40) +
      `${othersAggregate.picCount} (${otherPicPct}%)`.padStart(16) +
      `${othersAggregate.ocCount} (${otherOcPct}%)`.padStart(20) +
      (otherPicMedians ? otherPicMedians.medianFilesChanged.toFixed(1) : "-").padStart(12) +
      (otherPicMedians ? otherPicMedians.medianInsertions.toFixed(1) : "-").padStart(10) +
      (otherPicMedians ? otherPicMedians.medianDeletions.toFixed(1) : "-").padStart(10) +
      (otherOcMedians ? otherOcMedians.medianFilesChanged.toFixed(1) : "-").padStart(12) +
      (otherOcMedians ? otherOcMedians.medianInsertions.toFixed(1) : "-").padStart(10) +
      (otherOcMedians ? otherOcMedians.medianDeletions.toFixed(1) : "-").padStart(10)
  );

  // Totals
  console.log("=".repeat(hdr.length));
  const allPicMedians = {
    medianFilesChanged: calculateMedian(picWithMetadata.map((c) => parseInt(c.numFileChanged) || 0)),
    medianInsertions: calculateMedian(picWithMetadata.map((c) => parseInt(c.numInsertions) || 0)),
    medianDeletions: calculateMedian(picWithMetadata.map((c) => parseInt(c.numDeletions) || 0)),
  };
  const allOcMedians = ocWithMetadata.length > 0 ? {
    medianFilesChanged: calculateMedian(ocWithMetadata.map((c) => parseInt(c.numFileChanged) || 0)),
    medianInsertions: calculateMedian(ocWithMetadata.map((c) => parseInt(c.numInsertions) || 0)),
    medianDeletions: calculateMedian(ocWithMetadata.map((c) => parseInt(c.numDeletions) || 0)),
  } : null;

  console.log(
    "TOTAL".padEnd(40) +
      totalPic.toString().padStart(16) +
      totalOc.toString().padStart(20) +
      allPicMedians.medianFilesChanged.toFixed(1).padStart(12) +
      allPicMedians.medianInsertions.toFixed(1).padStart(10) +
      allPicMedians.medianDeletions.toFixed(1).padStart(10) +
      (allOcMedians ? allOcMedians.medianFilesChanged.toFixed(1) : "-").padStart(12) +
      (allOcMedians ? allOcMedians.medianInsertions.toFixed(1) : "-").padStart(10) +
      (allOcMedians ? allOcMedians.medianDeletions.toFixed(1) : "-").padStart(10)
  );

  console.log(`\nUnique repositories: ${picCounts.size} PIC, ${ocCounts.size} OC, ${allRepos.size} combined`);
}

main();
