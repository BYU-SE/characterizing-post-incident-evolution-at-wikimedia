import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const repoFiles = [
  "mediawiki-extensions.json",
  "operations-puppet.json",
  "mediawiki-core.json",
  "operations-software-spicerack.json",
];
const commitsPerRepo = 12; // Will get us ~50 total commits
const gitLogDir = "../../../data/wikimedia-gitlog";

function getRandomSample<T>(array: T[], size: number): T[] {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

function extractCommitMessage(commit: any): string {
  // Handle literal \n characters in commit messages from JSON and escape quotes
  return commit.message.replace(/\n/g, "\\n").replace(/"/g, '\\"');
}

async function extractSampleCommits() {
  const allSampleCommits: Array<{ repo: string; hash: string; message: string }> = [];

  for (const repoFile of repoFiles) {
    const filePath = path.join(__dirname, gitLogDir, repoFile);

    try {
      console.log(`Processing ${repoFile}...`);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Filter out merge commits for cleaner examples
      const nonMergeCommits = data.filter((commit: any) => !commit.merge);

      // Get random sample
      const sample = getRandomSample(nonMergeCommits, commitsPerRepo);

      // Extract messages and add repo info
      const messages = sample.map((commit: any) => ({
        repo: repoFile.replace(".json", ""),
        hash: commit.commit,
        message: extractCommitMessage(commit),
      }));

      allSampleCommits.push(...messages);
      console.log(`  Selected ${messages.length} commits from ${repoFile}`);
    } catch (error: any) {
      console.error(`Error processing ${repoFile}:`, error.message);
    }
  }

  // Write TypeScript array format for easy copy-paste
  const tsArrayContent = allSampleCommits
    .map((commit, index) => {
      const escapedMessage = commit.message.replaceAll("`", "'");
      const commentLine = `  // ${index + 1} ${commit.repo} - ${commit.hash.substring(0, 7)}`;
      const messageLine = "  `" + escapedMessage + "`";
      return commentLine + "\n" + messageLine;
    })
    .join(",\n\n");

  const output = `// Sample commit messages from 4 different repositories
const testMessages = [
${tsArrayContent}
];

export default testMessages;`;

  fs.writeFileSync(path.join(__dirname, "sample-commit-messages.ts"), output);

  console.log(`\nExtracted ${allSampleCommits.length} total commit messages`);
  console.log("Written to sample-commit-messages.ts");
}

extractSampleCommits().catch(console.error);
