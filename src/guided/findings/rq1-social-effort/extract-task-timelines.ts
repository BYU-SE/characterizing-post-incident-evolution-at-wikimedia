import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

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
  gen_description: string;
  gen_status: string;
  gen_priority: string;
  gen_createdDate: string;
  gen_timeline_items: TimelineItem[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function extractTaskTimelines(numTasks: number = 10): Promise<void> {
  const extractDir = path.join(__dirname, '../../../..', 'data', 'wikimedia-phabricator-extract');

  // Read the CSV file to get valid task IDs
  const csvPath = path.join(__dirname, '../../', '3-2-compare_tasks_pic.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const parseResult = Papa.parse(csvContent, { header: true });
  const validTaskIds = new Set<string>(
    parseResult.data
      .filter((row: any) => row.id)
      .map((row: any) => row.id)
  );

  console.log(`Found ${validTaskIds.size} valid task IDs in CSV`);

  // Get all YAML files that match the valid task IDs
  const allFiles = fs.readdirSync(extractDir)
    .filter(f => f.endsWith('.yaml') && f !== '.yaml')
    .filter(f => {
      const taskId = f.replace('.yaml', '');
      return validTaskIds.has(taskId);
    });

  console.log(`Found ${allFiles.length} matching YAML files`);

  // Shuffle files to process them in random order
  const shuffledFiles = shuffleArray(allFiles);

  const selectedTasks: TaskData[] = [];

  // Process files until we have enough tasks with timeline bodies
  for (const file of shuffledFiles) {
    if (selectedTasks.length >= numTasks) {
      break;
    }

    const filePath = path.join(extractDir, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = yaml.parse(content) as TaskData;

      if (!data.gen_timeline_items || data.gen_timeline_items.length === 0) {
        continue;
      }

      // Check if this task has any timeline items with non-empty gen_body (excluding gerritbot-only items)
      const itemsWithBody = data.gen_timeline_items.filter(item => {
        if (!item.gen_body || item.gen_body.trim() === '') {
          return false;
        }

        // Skip if only one headline and it starts with "gerritbot"
        if (item.gen_headlines &&
            item.gen_headlines.length === 1 &&
            item.gen_headlines[0].startsWith('gerritbot')) {
          return false;
        }

        return true;
      });

      if (itemsWithBody.length === 0) {
        continue;
      }

      selectedTasks.push(data);
      console.log(`Selected task ${selectedTasks.length}/${numTasks}: ${data.gen_id} (${itemsWithBody.length} timeline items with bodies)`);

    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  // Write to markdown file
  const outputPath = path.join(__dirname, 'task-timelines-sample.md');
  let markdown = `# Random Sample of Task Timelines\n\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
  markdown += `**Total Tasks:** ${selectedTasks.length}\n\n`;
  markdown += `---\n\n`;

  selectedTasks.forEach((task, taskIndex) => {
    markdown += `## Task ${taskIndex + 1}: ${task.gen_id} - ${task.gen_title}\n\n`;
    markdown += `- **URL:** ${task.gen_taskURL}\n`;
    markdown += `- **Status:** ${task.gen_status}\n`;
    markdown += `- **Priority:** ${task.gen_priority}\n`;
    if (task.gen_createdDate) {
      markdown += `- **Created:** ${task.gen_createdDate}\n`;
    }
    markdown += `\n`;

    // Add description if it exists
    if (task.gen_description && task.gen_description.trim() !== '') {
      markdown += `**Description:**\n\n${task.gen_description}\n\n`;
    }

    // Count timeline items with bodies (excluding gerritbot-only items)
    const itemsWithBody = task.gen_timeline_items.filter(item => {
      if (!item.gen_body || item.gen_body.trim() === '') {
        return false;
      }

      // Skip if only one headline and it starts with "gerritbot"
      if (item.gen_headlines &&
          item.gen_headlines.length === 1 &&
          item.gen_headlines[0].startsWith('gerritbot')) {
        return false;
      }

      return true;
    });
    markdown += `**Timeline Items with Content:** ${itemsWithBody.length}\n\n`;

    // Output all timeline items with non-empty bodies
    itemsWithBody.forEach((item, itemIndex) => {
      const headlines = item.gen_headlines && item.gen_headlines.length > 0
        ? item.gen_headlines.join(" | ")
        : "No headline";

      markdown += `**Item ${itemIndex + 1}: ${headlines}** ${item.gen_date}\n\n`;
      markdown += `${item.gen_body}\n\n`;
    });

    markdown += `\n`;
  });

  fs.writeFileSync(outputPath, markdown, 'utf-8');
  console.log(`\nWrote ${selectedTasks.length} tasks to ${outputPath}`);

  // Print summary statistics
  const totalTimelineItems = selectedTasks.reduce((sum, task) => {
    return sum + task.gen_timeline_items.filter(
      item => item.gen_body && item.gen_body.trim() !== ''
    ).length;
  }, 0);

  console.log(`Total timeline items with bodies: ${totalTimelineItems}`);
  console.log(`Average per task: ${(totalTimelineItems / selectedTasks.length).toFixed(1)}`);
}

// Run the extraction
extractTaskTimelines(10).catch(console.error);
