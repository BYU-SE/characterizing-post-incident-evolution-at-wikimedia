import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TimelineItem {
  gen_hash: string;
  gen_date: string;
  gen_headlines: string[];
  gen_body?: string;
}

interface TaskData {
  gen_id: string;
  gen_taskURL: string;
  gen_title: string;
  gen_timeline_items: TimelineItem[];
}

interface BodySample {
  taskId: string;
  taskURL: string;
  taskTitle: string;
  timelineHash: string;
  date: string;
  body: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function extractRandomBodies(numSamples: number = 10): Promise<void> {
  const extractDir = path.join(__dirname, '../../../..', 'data', 'wikimedia-phabricator-extract');

  // Get all YAML files
  const allFiles = fs.readdirSync(extractDir)
    .filter(f => f.endsWith('.yaml') && f !== '.yaml');

  console.log(`Found ${allFiles.length} YAML files`);

  // Shuffle files to process them in random order
  const shuffledFiles = shuffleArray(allFiles);

  const bodySamples: BodySample[] = [];

  // Process files until we have enough samples
  for (const file of shuffledFiles) {
    if (bodySamples.length >= numSamples) {
      break;
    }

    const filePath = path.join(extractDir, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = yaml.parse(content) as TaskData;

      if (!data.gen_timeline_items || data.gen_timeline_items.length === 0) {
        continue;
      }

      // Find timeline items with non-empty gen_body
      const itemsWithBody = data.gen_timeline_items.filter(
        item => item.gen_body && item.gen_body.trim() !== ''
      );

      if (itemsWithBody.length === 0) {
        continue;
      }

      // Randomly select one item from this file
      const randomItem = itemsWithBody[Math.floor(Math.random() * itemsWithBody.length)];

      bodySamples.push({
        taskId: data.gen_id,
        taskURL: data.gen_taskURL,
        taskTitle: data.gen_title,
        timelineHash: randomItem.gen_hash,
        date: randomItem.gen_date,
        body: randomItem.gen_body!
      });

      console.log(`Collected sample ${bodySamples.length}/${numSamples} from ${file}`);

    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  // Write samples to plain text file
  const outputPath = path.join(__dirname, 'timeline-body-samples.txt');
  let outputText = `Random Sample of Timeline Item Bodies\n`;
  outputText += `Generated: ${new Date().toISOString()}\n`;
  outputText += `Total Samples: ${bodySamples.length}\n`;
  outputText += `${'='.repeat(80)}\n\n`;

  bodySamples.forEach((sample, index) => {
    outputText += `Sample ${index + 1}\n`;
    outputText += `${'-'.repeat(80)}\n`;
    outputText += `Task ID: ${sample.taskId}\n`;
    outputText += `Task URL: ${sample.taskURL}\n`;
    outputText += `Task Title: ${sample.taskTitle}\n`;
    outputText += `Timeline Hash: ${sample.timelineHash}\n`;
    outputText += `Date: ${sample.date}\n`;
    outputText += `\nBody:\n`;
    outputText += `${sample.body}\n`;
    outputText += `\n${'='.repeat(80)}\n\n`;
  });

  fs.writeFileSync(outputPath, outputText, 'utf-8');
  console.log(`\nWrote ${bodySamples.length} samples to ${outputPath}`);
}

// Run the extraction
extractRandomBodies(10).catch(console.error);
