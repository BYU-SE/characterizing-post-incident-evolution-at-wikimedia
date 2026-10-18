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
  totalCommits: number;
  commitsInPeriod: number;
  numPostIncidentCommits: number;
  postIncidentCommitsInPeriod: number;
}

const START_DATE = "2015-01-01";
const END_DATE = "2020-01-01";

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
  repoPath: string,
  since?: string,
  until?: string
): string[] {
  if (commits.length === 0) return [];

  const results = [];
  for (const commit of commits) {
    try {
      const command = `git -C "${repoPath}" log --since="${since}" --until="${until}" --format="%H" ${commit} -1`;
      const commandResult = execSync(command, { encoding: "utf-8" });
      console.log(`Ran command to find ${commit} in ${repoPath} and got ${commandResult.trim()}`);
      // If we get back a commit hash, then it exists. Otherwise, we get nothing or an error.
      if (commandResult.trim().length == 40) {
        results.push(commit);
      }
    } catch (error) {
      console.warn(`Failed to filter commits by period for ${repoPath}:`, error);
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

  for (const [projectName, numPostIncidentCommits] of sortedRepos) {
    const gitLogName = projectToGitLogMap[projectName];
    if (!gitLogName) {
      console.log(chalk.red(`No git log mapping found for project: ${projectName}\n`));
      continue;
    }

    const repoPath = join(repoSourceDir, gitLogName);

    console.log(`Analyzing ${projectName}...\n`);

    const totalCommits = getCommitCount(repoPath);
    const commitsInPeriod = getCommitCount(repoPath, START_DATE, END_DATE);

    const knownCommits = repoSummary.reposCommits[projectName];
    const postIncidentCommitsInPeriod = filterCommitsInPeriod(
      knownCommits || [],
      repoPath,
      START_DATE,
      END_DATE
    ).length;

    const analysis: RepoAnalysis = {
      projectName,
      totalCommits,
      commitsInPeriod,
      numPostIncidentCommits,
      postIncidentCommitsInPeriod,
    };

    analyses.push(analysis);

    output += `  Total commits: ${totalCommits}\n`;
    output += `  Commits in period (${START_DATE} to ${END_DATE}): ${commitsInPeriod}\n`;
    output += `  Post-incident commits: ${numPostIncidentCommits}\n`;
    output += `  Post-incident commits in period: ${postIncidentCommitsInPeriod}\n`;
    output += "\n";
  }

  output += "Summary:\n";
  output += "Project\t\t\t\t\tTotal\tPeriod\tPost-Inc\tPost-Inc-Period\n";
  output += "=".repeat(80) + "\n";

  for (const analysis of analyses) {
    const name =
      analysis.projectName.length > 50 ? analysis.projectName.substring(0, 47) + "..." : analysis.projectName;
    output += `${name.padEnd(50)}\t${analysis.totalCommits}\t${analysis.commitsInPeriod}\t${
      analysis.numPostIncidentCommits
    }\t${analysis.postIncidentCommitsInPeriod}\n`;
  }

  const outputPath = join(process.cwd(), "src", "wikimedia-analysis", "unequal-evolution-topology.txt");
  writeFileSync(outputPath, output, "utf-8");

  console.log(`Analysis complete. Results written to: ${outputPath}`);
}

main();
