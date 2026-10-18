import chalk from "chalk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";
import { CommitLogEntry, gitLogDir, projectToGitLogMap } from "../wikimedia-scraping/git-log-to-json.js";
import { GerritCodeReview } from "../wikimedia-scraping/gerrit-types.js";
import { gerritScrapedDir } from "../wikimedia-scraping/gerrit.js";
import { RepoSummary } from "../wikimedia-analysis/summary-types.js";
import { acceptStartDate, acceptEndDate } from "./config.js";
import { FlatCREntry } from "../lib/code-review.js";
import {
  getFileExtensionType,
  calculateStats,
  printUnfoundFileExtensionFiles,
  countNumWordsInString,
  readCSV,
} from "./util/util.js";
import { currentClassificationKeywords } from "./3-2-helpers/classification-keywords.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const repoSummary = JSON.parse(
  readFileSync(join(__dirname, "..", "wikimedia-analysis", "repo_summary.json"), "utf-8"),
) as RepoSummary;

const postIncidentPath = join(__dirname, "3-2-compare_commits_pic.csv");
const otherCommitsPath = join(__dirname, "3-2-compare_commits_oc.csv");

const postIncidentFromCRPath = join(__dirname, "3-2-compare_commits_from_cr_pic.csv");
const otherCommitsFromCRPath = join(__dirname, "3-2-compare_commits_from_cr_oc.csv");

const crPicCsvPath = join(__dirname, "3-2-compare_code_reviews_pic.csv");
const crOcCsvPath = join(__dirname, "3-2-compare_code_reviews_oc.csv");

console.log(chalk.blue(`Post-incident commits (from CR) CSV exists: ${existsSync(postIncidentFromCRPath)}`));
console.log(chalk.blue(`Other commits (from CR) CSV exists: ${existsSync(otherCommitsFromCRPath)}`));

type FlatCommitLogEntry = {
  hasMetadata: boolean;
  hash: string;
  repo: string;
  date: number | string;
  isMerge: boolean | string;
  numFileChanged: number | string;
  numInsertions: number | string;
  numDeletions: number | string;
  numFileExtScripting: number | string;
  numFileExtWeb: number | string;
  numFileExtConfig: number | string;
  numFileExtInfrastructure: number | string;
  numFileExtTest: number | string;
  numFileExtData: number | string;
  numFileExtDocumentation: number | string;
  numFileExtImage: number | string;
  numFileExtTemplate: number | string;
  numFileExtAssets: number | string;
  numFileExtOther: number | string;
  commitMessageLength: number | string;
  commitMessageNumWords: number | string;
  commitMessage: string;
};

async function generateCommitCSVFilesFromGitLogs() {
  const postIncidentCommits: FlatCommitLogEntry[] = [];
  const otherCommits: FlatCommitLogEntry[] = [];

  console.log(chalk.blue("Processing commits from git logs..."));
  let reposWithKnownPICs: string[] = [];
  for (const [repo, repoFolderName] of Object.entries(projectToGitLogMap)) {
    let log: CommitLogEntry[] = [];

    try {
      log = JSON.parse(readFileSync(join(gitLogDir, `${repoFolderName}.json`), "utf-8")) as CommitLogEntry[];
    } catch (e) {
      console.error("Error trying to read", repo, repoFolderName, e);
      throw "Halt";
    }

    /*const before = log.length;
    // divide by 1000 for date format. Also add just a little padding since it seems that there might be some bad date coersion going on
    log = log.filter((x) => x.epoch > acceptStartDate / 1000 && x.epoch < acceptEndDate / 1000);

    const after = log.length;
    console.log("Our time filtering changed num commits from ", before, "to", after);
    */
    log = log.filter((x) => !!x.message);

    let count = 0;

    log.forEach((x) => {
      if (x.merge) return;

      let flat: FlatCommitLogEntry = {
        hash: x.commit,
        repo,
        date: x.epoch * 1000, // just convert all date formats across all artifacts to use the same units
        isMerge: !!x.merge,
        numFileChanged: x.stats?.files_changed || 0,
        numInsertions: x.stats?.insertions || 0,
        numDeletions: x.stats?.deletions || 0,
        numFileExtScripting: 0,
        numFileExtWeb: 0,
        numFileExtConfig: 0,
        numFileExtInfrastructure: 0,
        numFileExtTest: 0,
        numFileExtData: 0,
        numFileExtDocumentation: 0,
        numFileExtImage: 0,
        numFileExtTemplate: 0,
        numFileExtAssets: 0,
        numFileExtOther: 0,
        commitMessageLength: x.message?.length || 0,
        commitMessageNumWords: countNumWordsInString(x.message),
        commitMessage: x.message,
      };

      x.stats?.files.forEach((f) => {
        const extType = getFileExtensionType(f, { repo, commit: x.commit });
        if (extType == "scripting") flat.numFileExtScripting++;
        else if (extType == "web") flat.numFileExtWeb++;
        else if (extType == "config") flat.numFileExtConfig++;
        else if (extType == "infrastructure") flat.numFileExtInfrastructure++;
        else if (extType == "test") flat.numFileExtTest++;
        else if (extType == "data") flat.numFileExtData++;
        else if (extType == "documentation") flat.numFileExtDocumentation++;
        else if (extType == "image") flat.numFileExtImage++;
        else if (extType == "template") flat.numFileExtTemplate++;
        else if (extType == "assets") flat.numFileExtAssets++;
        else if (extType == "other") flat.numFileExtOther++;
      });

      if (repoSummary.commits.includes(x.commit)) {
        // if its a known post-incident commit
        postIncidentCommits.push(flat);

        if (!reposWithKnownPICs.includes(repo)) reposWithKnownPICs.push(repo);
      } else {
        // if its other commits we only want to sample in the date range
        if (x.epoch > acceptStartDate / 1000 && x.epoch < acceptEndDate / 1000) {
          count++;
          if (count % 1000 == 0) {
            otherCommits.push(flat);
          }
        }
      }
    });
  }

  // we have to filter OC because there may be commits that are from repos which don't actually have changes.
  // We assumed that all changes would come from these 99 repos, but its possible some never actually had any.

  console.log(
    "Filtering out OC commits which aren't in our list of",
    reposWithKnownPICs.length,
    "repos with commits",
  );
  const before = otherCommits.length;
  const keptOC = otherCommits.filter((x) => reposWithKnownPICs.includes(x.repo));
  const after = keptOC.length;
  console.log("We trimmed out", before - after, "commits which are from repos with no PIC.");

  console.log(chalk.green(`Found ${postIncidentCommits.length} post-incident commits`));
  console.log(chalk.green(`Found ${keptOC.length} other commits.`));

  // Write CSV files to guided directory
  writeFileSync(postIncidentPath, Papa.unparse(postIncidentCommits, { header: true }));
  writeFileSync(otherCommitsPath, Papa.unparse(keptOC, { header: true }));

  console.log(chalk.yellow("CSV files written:"));
  console.log(chalk.yellow(`- ${postIncidentPath}`));
  console.log(chalk.yellow(`- ${otherCommitsPath}`));

  //printUnfoundFileExtensionFiles(500, 3, true);
}

function buildFlatCommitLogEntry(x: CommitLogEntry, repo: string): FlatCommitLogEntry {
  let flat: FlatCommitLogEntry = {
    hasMetadata: true,
    hash: x.commit,
    repo,
    date: x.epoch * 1000,
    isMerge: !!x.merge,
    numFileChanged: x.stats?.files_changed || 0,
    numInsertions: x.stats?.insertions || 0,
    numDeletions: x.stats?.deletions || 0,
    numFileExtScripting: 0,
    numFileExtWeb: 0,
    numFileExtConfig: 0,
    numFileExtInfrastructure: 0,
    numFileExtTest: 0,
    numFileExtData: 0,
    numFileExtDocumentation: 0,
    numFileExtImage: 0,
    numFileExtTemplate: 0,
    numFileExtAssets: 0,
    numFileExtOther: 0,
    commitMessageLength: x.message?.length || 0,
    commitMessageNumWords: countNumWordsInString(x.message),
    commitMessage: x.message,
  };

  x.stats?.files.forEach((f) => {
    const extType = getFileExtensionType(f, { repo, commit: x.commit });
    if (extType == "scripting") flat.numFileExtScripting++;
    else if (extType == "web") flat.numFileExtWeb++;
    else if (extType == "config") flat.numFileExtConfig++;
    else if (extType == "infrastructure") flat.numFileExtInfrastructure++;
    else if (extType == "test") flat.numFileExtTest++;
    else if (extType == "data") flat.numFileExtData++;
    else if (extType == "documentation") flat.numFileExtDocumentation++;
    else if (extType == "image") flat.numFileExtImage++;
    else if (extType == "template") flat.numFileExtTemplate++;
    else if (extType == "assets") flat.numFileExtAssets++;
    else if (extType == "other") flat.numFileExtOther++;
  });

  return flat;
}

async function generateCommitCSVFilesFromCRs() {
  console.log(chalk.blue("Processing commits from code review CSVs..."));

  // Cache for loaded git logs keyed by repo folder name
  const gitLogCache = new Map<string, CommitLogEntry[]>();

  function loadGitLog(repoFolderName: string): CommitLogEntry[] {
    if (gitLogCache.has(repoFolderName)) {
      return gitLogCache.get(repoFolderName)!;
    }
    const log = JSON.parse(readFileSync(join(gitLogDir, `${repoFolderName}.json`), "utf-8")) as CommitLogEntry[];
    gitLogCache.set(repoFolderName, log);
    return log;
  }

  function processCodeReviewCSV(crCsvPath: string, label: string): FlatCommitLogEntry[] {
    const crEntries = readCSV<FlatCREntry>(crCsvPath);
    const results: FlatCommitLogEntry[] = [];
    const seenCommitHashes = new Set<string>();
    const missingGitLogProjects = new Set<string>();
    let commitNotFoundCount = 0;
    let gerritJsonNotFoundCount = 0;

    const mergedEntries = crEntries.filter((cr) => cr.status === "MERGED");
    console.log(chalk.blue(`Processing ${mergedEntries.length} ${label} MERGED code reviews (${crEntries.length - mergedEntries.length} non-merged skipped)...`));

    for (const crEntry of mergedEntries) {
      const crId = crEntry.id;

      // Read the Gerrit JSON for this code review
      let gerritData: GerritCodeReview;
      try {
        gerritData = JSON.parse(readFileSync(join(gerritScrapedDir, `${crId}.json`), "utf-8")) as GerritCodeReview;
      } catch (e) {
        gerritJsonNotFoundCount++;
        continue;
      }

      const project = gerritData.project;
      const commitHash = gerritData.current_revision;

      // Check for duplicate commit hashes across CRs
      if (seenCommitHashes.has(commitHash)) {
        console.log(chalk.yellow(`  Duplicate commit hash ${commitHash} from CR ${crId} (project: ${project}) — skipping`));
        continue;
      }
      seenCommitHashes.add(commitHash);

      // Look up the git log file for this project
      const repoFolderName = projectToGitLogMap[project];
      if (!repoFolderName) {
        missingGitLogProjects.add(project);
        const revision = gerritData.revisions[gerritData.current_revision];
        const commitDate = revision?.commit?.committer?.date;
        results.push({
          hasMetadata: false,
          hash: commitHash,
          repo: project,
          date: commitDate ? new Date(commitDate).getTime() : "",
          isMerge: "",
          numFileChanged: "",
          numInsertions: "",
          numDeletions: "",
          numFileExtScripting: "",
          numFileExtWeb: "",
          numFileExtConfig: "",
          numFileExtInfrastructure: "",
          numFileExtTest: "",
          numFileExtData: "",
          numFileExtDocumentation: "",
          numFileExtImage: "",
          numFileExtTemplate: "",
          numFileExtAssets: "",
          numFileExtOther: "",
          commitMessageLength: "",
          commitMessageNumWords: "",
          commitMessage: "",
        });
        continue;
      }

      // Load the git log and find the commit
      let log: CommitLogEntry[];
      try {
        log = loadGitLog(repoFolderName);
      } catch (e) {
        console.error(chalk.red(`  Error reading git log for ${project} (${repoFolderName}): ${e}`));
        continue;
      }

      const commitEntry = log.find((x) => x.commit === commitHash);
      if (!commitEntry) {
        commitNotFoundCount++;
        continue;
      }

      results.push(buildFlatCommitLogEntry(commitEntry, project));
    }

    // Summary logging
    if (gerritJsonNotFoundCount > 0) {
      console.log(chalk.red(`  ${label}: ${gerritJsonNotFoundCount} Gerrit JSON files not found`));
    }
    if (missingGitLogProjects.size > 0) {
      console.log(chalk.yellow(`  ${label}: ${missingGitLogProjects.size} projects not in projectToGitLogMap:`));
      for (const p of missingGitLogProjects) {
        console.log(chalk.yellow(`    - ${p}`));
      }
    }
    if (commitNotFoundCount > 0) {
      console.log(chalk.yellow(`  ${label}: ${commitNotFoundCount} commits not found in git logs`));
    }
    console.log(chalk.green(`  ${label}: ${results.length} commits resolved from ${mergedEntries.length} merged code reviews`));

    return results;
  }

  const picCommits = processCodeReviewCSV(crPicCsvPath, "PIC");
  const ocCommits = processCodeReviewCSV(crOcCsvPath, "OC");

  writeFileSync(postIncidentFromCRPath, Papa.unparse(picCommits, { header: true }));
  writeFileSync(otherCommitsFromCRPath, Papa.unparse(ocCommits, { header: true }));

  console.log(chalk.yellow("CSV files written:"));
  console.log(chalk.yellow(`- ${postIncidentFromCRPath}`));
  console.log(chalk.yellow(`- ${otherCommitsFromCRPath}`));
}

function summarizeCommitMetrics() {
  if (!existsSync(postIncidentFromCRPath) || !existsSync(otherCommitsFromCRPath)) {
    console.log(chalk.red("No CSV files found. Run generateCommitCSVFilesFromCRs() first"));
    return;
  }

  const postIncidentData = readCSV<FlatCommitLogEntry>(postIncidentFromCRPath).filter((row) => row.hasMetadata);
  const otherCommitsData = readCSV<FlatCommitLogEntry>(otherCommitsFromCRPath).filter((row) => row.hasMetadata);

  console.log(chalk.cyan("=".repeat(80)));
  console.log(chalk.cyan.bold("COMMIT METRICS SUMMARY"));
  console.log(chalk.cyan("=".repeat(80)));

  console.log(chalk.blue(`Post-Incident Commits: ${postIncidentData.length}`));
  console.log(chalk.blue(`Other Commits: ${otherCommitsData.length}`));
  console.log();

  // Handle numerical metrics
  const metrics = [
    "numFileChanged",
    "numInsertions",
    "numDeletions",
    "numFileExtScripting",
    "numFileExtWeb",
    "numFileExtConfig",
    "numFileExtInfrastructure",
    "numFileExtTest",
    "numFileExtData",
    "numFileExtDocumentation",
    "numFileExtImage",
    "numFileExtTemplate",
    "numFileExtAssets",
    "numFileExtOther",
  ] as const;

  for (const metric of metrics) {
    console.log(chalk.yellow.bold(`\n${metric}`));
    console.log(chalk.yellow("-".repeat(metric.length)));

    const postIncidentValues = postIncidentData.map((row) => Number(row[metric]) || 0);
    const otherValues = otherCommitsData.map((row) => Number(row[metric]) || 0);

    const postIncidentStats = calculateStats(postIncidentValues);
    const otherStats = calculateStats(otherValues);

    console.log(
      chalk.green("Post-Incident:"),
      `  Mean: ${postIncidentStats.mean}, Min: ${postIncidentStats.min}, Q1: ${postIncidentStats.q1}, Median: ${postIncidentStats.median}, Q3: ${postIncidentStats.q3}, Max: ${postIncidentStats.max}`,
    );

    console.log(
      chalk.white("Other Commits:"),
      `  Mean: ${otherStats.mean}, Min: ${otherStats.min}, Q1: ${otherStats.q1}, Median: ${otherStats.median}, Q3: ${otherStats.q3}, Max: ${otherStats.max}`,
    );
  }

  // Special handling for isMerge (boolean metric)
  console.log(chalk.yellow.bold(`\nISMERGE (Boolean)`));
  console.log(chalk.yellow("-".repeat(15)));

  const postIncidentMerges = postIncidentData.filter((row) => row.isMerge).length;
  const postIncidentMergeRate = ((postIncidentMerges / postIncidentData.length) * 100).toFixed(2);

  const otherMerges = otherCommitsData.filter((row) => row.isMerge).length;
  const otherMergeRate = ((otherMerges / otherCommitsData.length) * 100).toFixed(2);

  console.log(
    chalk.green(
      `Post-Incident: ${postIncidentMerges}/${postIncidentData.length} (${postIncidentMergeRate}%)`,
    ),
  );
  console.log(chalk.white(`Other Commits: ${otherMerges}/${otherCommitsData.length} (${otherMergeRate}%)`));

  console.log(chalk.cyan("=".repeat(80)));
}

// Dynamic classification type based on available categories
type CommitClassification = Record<string, boolean>;

function classifyCommitMessage(message: string): CommitClassification {
  // Convert to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();

  // Remove common trailing patterns to focus on the main content
  const cleanMessage = lowerMessage
    .replace(/\n\nbug:\s*t\d+.*$/s, "") // Remove Bug: references and everything after
    .replace(/\n\nchange-id:\s*i[a-f0-9]+.*$/s, "") // Remove Change-Id and everything after
    .replace(/\n\nsigned-off-by:.*$/s, "") // Remove Signed-off-by and everything after
    .trim();

  const classification: CommitClassification = {};

  // Check for keywords (word boundary matching to avoid partial matches)
  const hasKeyword = (keywords: string[], text: string): boolean => {
    return keywords.some((keyword) => {
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`, "i");
      return regex.test(text);
    });
  };

  // Dynamically classify based on available categories
  for (const [category, keywords] of Object.entries(currentClassificationKeywords)) {
    classification[`is${category.charAt(0).toUpperCase() + category.slice(1)}`] = hasKeyword(
      keywords,
      cleanMessage,
    );
  }

  return classification;
}

/*
function analyzeCommitClassifications() {
  const postIncidentPath = join(__dirname, "compare_commits_pic.csv");
  const otherCommitsPath = join(__dirname, "compare_commits_oc.csv");

  if (!existingPic || !existingOc) {
    console.log(chalk.red("CSV files not found. Run compareCommits() first"));
    return;
  }

  console.log(chalk.blue("Loading commit data for classification analysis..."));

  const postIncidentData = readCSV<FlatCommitLogEntry>(postIncidentPath).slice(0, 100); // Limit to first 100 rows for testing

  const otherCommitsData = readCSV<FlatCommitLogEntry>(otherCommitsPath).slice(0, 100); // Limit to first 100 rows for testing

  // Classify all commits
  const postIncidentClassifications = postIncidentData.map((commit) => {
    const classification = classifyCommitMessage(commit.commitMessage || "");
    return { ...commit, ...classification };
  });

  const otherClassifications = otherCommitsData.map((commit) => {
    const classification = classifyCommitMessage(commit.commitMessage || "");
    return { ...commit, ...classification };
  });

  // Calculate statistics dynamically based on available categories
  const calculateClassificationStats = (data: any[]) => {
    const total = data.length;
    const stats: Record<string, number> = {};
    const percentages: Record<string, string> = {};

    // Dynamically calculate stats for all available categories
    for (const category of Object.keys(currentClassificationKeywords)) {
      const propertyName = `is${category.charAt(0).toUpperCase() + category.slice(1)}`;
      stats[category] = data.filter((c) => c[propertyName]).length;
      percentages[category] = ((stats[category] / total) * 100).toFixed(2);
    }

    return { stats, percentages, total };
  };

  const postIncidentStats = calculateClassificationStats(postIncidentClassifications);
  const otherStats = calculateClassificationStats(otherClassifications);

  // Display results
  console.log(chalk.cyan("=".repeat(80)));
  console.log(chalk.cyan.bold("COMMIT MESSAGE CLASSIFICATION ANALYSIS"));
  console.log(chalk.cyan("=".repeat(80)));

  console.log(chalk.blue(`Post-Incident Commits: ${postIncidentStats.total}`));
  console.log(chalk.blue(`Other Commits: ${otherStats.total}`));
  console.log();

  for (const category of Object.keys(currentClassificationKeywords)) {
    console.log(chalk.yellow.bold(`${category.toUpperCase()}`));
    console.log(chalk.yellow("-".repeat(category.length)));

    console.log(
      chalk.green(
        `Post-Incident: ${postIncidentStats.stats[category]} (${postIncidentStats.percentages[category]}%)`
      )
    );
    console.log(
      chalk.white(`Other Commits: ${otherStats.stats[category]} (${otherStats.percentages[category]}%)`)
    );
    console.log();
  }

  // Show examples for validation
  console.log(chalk.magenta.bold("SAMPLE CLASSIFICATIONS (for validation):"));
  console.log(chalk.magenta("=".repeat(50)));

  const showExamples = (data: any[], title: string, category: string, limit: number = 3) => {
    const propertyName = `is${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const examples = data.filter((c: any) => c[propertyName]).slice(0, limit);
    if (examples.length > 0) {
      console.log(chalk.yellow(`\n${title} - ${category} examples:`));
      examples.forEach((c: any) => {
        const shortMessage = (c.commitMessage || "").split("\n")[0].substring(0, 80);
        console.log(`  "${shortMessage}"`);
      });
    }
  };

  // Show examples for the most relevant categories
  showExamples(postIncidentClassifications, "Post-Incident", "fix");
  showExamples(postIncidentClassifications, "Post-Incident", "refactor");
  if (currentClassificationKeywords.build) {
    showExamples(postIncidentClassifications, "Post-Incident", "build");
  }
  showExamples(otherClassifications, "Other Commits", "fix");
  showExamples(otherClassifications, "Other Commits", "test");
  if (currentClassificationKeywords.build) {
    showExamples(otherClassifications, "Other Commits", "build");
  }

  console.log(chalk.cyan("=".repeat(80)));
}
  */

// Main execution
await generateCommitCSVFilesFromCRs();
summarizeCommitMetrics();

// Run the classification analysis
//analyzeCommitClassifications();
