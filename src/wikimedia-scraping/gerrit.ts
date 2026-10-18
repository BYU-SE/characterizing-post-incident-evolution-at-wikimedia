import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { delay } from "./util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const gerritScrapedDir = join(__dirname, "..", "..", "data", "wikimedia-gerrit");

function getJSONEndpointFromGerritLink(url: string): string {
  const resourceID = getGerritResourceID(url);
  if (resourceID) {
    return `https://gerrit.wikimedia.org/r/changes/${resourceID}/detail?O=1996394`;
  }
  return "";
}

export function getGerritResourceID(str: string) {
  const regexp = /(\d{2,8})/;
  const match = str.match(regexp);
  if (match && match[1]) {
    return match[1];
  }
  return "";
}

export async function fetchGerrit(gerritLink: string) {
  let resourceID = getGerritResourceID(gerritLink);
  if (!resourceID) {
    console.log("Skipping Fetching", gerritLink, "since link is not typical code review link");
    return;
  }

  let sanitizedFileName = join(gerritScrapedDir, `${resourceID}.json`);

  if (existsSync(sanitizedFileName)) return;

  console.log("Fetching", gerritLink);

  let jsonEndpoint = getJSONEndpointFromGerritLink(gerritLink);

  if (!jsonEndpoint) {
    console.log("Skipping Fetching", gerritLink, "since link is not typical code review link");
    return;
  }

  let resp = await fetch(jsonEndpoint, {
    headers: {
      "User-Agent":
        "byu.edu Software Engineering Lab - Understanding Post-Incident Changes Scraping Bot (matt4530@byu.edu)",
    },
  });
  let text = await resp.text();
  writeFileSync(sanitizedFileName, text.slice(5)); // remove the garbage they have at the beginning to prevent running this as code.

  let secondsToWait = 20 + Math.floor(Math.random() * 5);
  await delay(secondsToWait * 1000);
}

function getCommentsEndpoint(changeId: string): string {
  return `https://gerrit.wikimedia.org/r/changes/${changeId}/comments?enable-context=true&context-padding=3`;
}

/**
 * Fetches comments for a Gerrit change and appends them to the existing JSON file.
 * @param resourceID The resource ID (filename without .json extension, e.g., "201678")
 * @returns true if comments were fetched and saved, false otherwise
 */
export async function fetchGerritComments(resourceID: string): Promise<boolean> {
  const jsonFilePath = join(gerritScrapedDir, `${resourceID}.json`);

  if (!existsSync(jsonFilePath)) {
    console.log(`Skipping ${resourceID}: JSON file does not exist`);
    return false;
  }

  // Read existing JSON to get the change ID
  const existingData = JSON.parse(readFileSync(jsonFilePath, "utf-8"));

  // Check if comments already exist
  if (existingData.comments !== undefined) {
    console.log(`Skipping ${resourceID}: comments already fetched`);
    return false;
  }

  const changeId = existingData.id;
  if (!changeId) {
    console.log(`Skipping ${resourceID}: no id field in JSON`);
    return false;
  }

  console.log(`Fetching comments for ${resourceID} (change-id: ${changeId})`);

  const commentsEndpoint = getCommentsEndpoint(changeId);

  const resp = await fetch(commentsEndpoint, {
    headers: {
      "User-Agent":
        "byu.edu Software Engineering Lab - Understanding Post-Incident Changes Scraping Bot (matt4530@byu.edu)",
    },
  });

  const text = await resp.text();
  const commentsData = JSON.parse(text.slice(5)); // Remove garbage prefix like the other endpoint

  // Append comments to existing data and save
  existingData.comments = commentsData;
  writeFileSync(jsonFilePath, JSON.stringify(existingData));

  const secondsToWait = 20 + Math.floor(Math.random() * 5);
  await delay(secondsToWait * 1000);

  return true;
}
