import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { projectToGitLogMap, repoSourceDir } from "../wikimedia-scraping/git-log-to-json.js";
import chalk from "chalk";

interface RepoSummary {
  reposCommitCounts: Record<string, number>;
  reposCommits: Record<string, string[]>;
  commits: string[];
}

interface RepoAnalysis {
  projectName: string;
  numCommits: number;
  numPICommits: number;
  periodStart: string;
  periodEnd: string;
  numCommitsInPeriod: number;
  numPICommitsInPeriod: number;
}

function getCommitDates(commits: string[], repoPath: string): Record<string, Date> {
  const results: Record<string, Date> = {};
  for (const commit of commits) {
    try {
      const command = `git -C "${repoPath}" show --no-patch --format="%ci" ${commit}`;
      const commandResult = execSync(command, { encoding: "utf-8" });
      console.log(`Ran command to find ${commit} in ${repoPath} and got ${commandResult.trim()}`);
      // If the returned string starts with a date (probably 20XX-MM-DD)
      if (commandResult.startsWith("20")) {
        const d = new Date(commandResult);
        results[commit] = d;
      }
    } catch (error) {
      console.warn(`Failed to filter commits by period for ${repoPath}:`, error);
    }
  }
  return results;
}

function getCommitCount(repoPath: string, since?: string, until?: string): number {
  try {
    let command = `git -C "${repoPath}" rev-list --count HEAD`;
    if (since && until) {
      command = `git -C "${repoPath}" rev-list --count --since="${since}" --until="${until}" HEAD`;
    }
    const result = execSync(command, { encoding: "utf-8" });
    return parseInt(result.trim(), 10);
  } catch (error) {
    console.warn(`Failed to get commit count for ${repoPath}:`, error);
    return 0;
  }
}

function filterCommitsInPeriod(
  commits: string[],
  dateMap: Record<string, Date>,
  since: string,
  until: string
): string[] {
  const startDate = new Date(since);
  const endDate = new Date(until);

  const results: string[] = [];
  for (const commit of commits) {
    const knownDate = dateMap[commit];
    if (knownDate && knownDate >= startDate && knownDate < endDate) {
      results.push(commit);
    }
  }
  return results;
}

function main() {
  const repoSummaryPath = join(process.cwd(), "src", "wikimedia-analysis", "repo_summary.json");
  const repoSummary: RepoSummary = JSON.parse(readFileSync(repoSummaryPath, "utf-8"));

  const sortedRepos = Object.entries(repoSummary.reposCommitCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  console.log(chalk.red("Most common repos are"));
  sortedRepos.forEach((r) => console.log(r));

  const analyses: RepoAnalysis[] = [];
  let output = "";

  const startYear = 2015;
  const endYear = 2025;

  for (const [projectName, numPostIncidentCommits] of sortedRepos) {
    const gitLogName = projectToGitLogMap[projectName];
    if (!gitLogName) {
      console.log(chalk.red(`No git log mapping found for project: ${projectName}\n`));
      continue;
    }

    const repoPath = join(repoSourceDir, gitLogName);

    console.log(chalk.green(`Analyzing ${projectName}...\n`));

    const totalCommits = getCommitCount(repoPath);
    const knownPICommits = repoSummary.reposCommits[projectName] || [];

    console.log(chalk.green(`Finding dates for PIC in ${projectName}...\n`));
    const dateForPICs = getCommitDates(knownPICommits, repoPath);

    console.log(chalk.green(`Filtering by period in ${projectName}...\n`));
    for (let currentYear = startYear; currentYear < endYear; currentYear++) {
      const start = `${currentYear}-01-01`;
      const end = `${currentYear + 1}-01-01`;

      const commitsInPeriod = getCommitCount(repoPath, start, end);

      const piCommitsInPeriod = filterCommitsInPeriod(knownPICommits, dateForPICs, start, end).length;

      const analysis: RepoAnalysis = {
        projectName,
        numCommits: totalCommits,
        numPICommits: numPostIncidentCommits,
        numCommitsInPeriod: commitsInPeriod,
        numPICommitsInPeriod: piCommitsInPeriod,
        periodStart: start,
        periodEnd: end,
      };
      analyses.push(analysis);
    }
  }

  output += "Summary:\n";

  const headerRows = [
    "Project",
    "Total Commits",
    "Total PIC",
    "Period Commits",
    "Period PIC",
    "Period Start",
    "Period End",
  ];

  output += headerRows.join("\t") + "\n";
  output += "=".repeat(80) + "\n";

  for (const a of analyses) {
    const name = a.projectName.length > 50 ? a.projectName.substring(0, 47) + "..." : a.projectName;

    const row = [
      name.padEnd(50),
      a.numCommits,
      a.numPICommits,
      a.numCommitsInPeriod,
      a.numPICommitsInPeriod,
      a.periodStart,
      a.periodEnd,
    ];

    output += row.join("\t") + "\n";
  }

  const outputPath = join(
    process.cwd(),
    "src",
    "wikimedia-analysis",
    "unequal-evolution-topology-over-time.txt"
  );
  writeFileSync(outputPath, output, "utf-8");

  console.log(`Analysis complete. Results written to: ${outputPath}`);
}

main();
