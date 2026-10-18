import { readFileSync, writeFileSync } from "fs";
import { isEqual } from "underscore";
import { parse, stringify } from "yaml";

export function saveOverExistingYAML(fileName: string, yaml: any) {
  let existingRawData: string = "";
  try {
    existingRawData = readFileSync(fileName, "utf-8");
  } catch (e) {} // file does not exist, thats OK.

  let existingParsed: any = {};
  try {
    if (existingRawData) {
      existingParsed = parse(existingRawData);
    }
  } catch (e) {
    // parsing issue
    throw `Parsing issue with ${fileName}, aborting operation. Details: ${e}`;
  }

  if (!isEqual(existingParsed, yaml)) {
    console.log(`Found changed YAML at ${fileName}. Merging instead.`);
    yaml = deepMerge(existingParsed, yaml);
  }

  writeFileSync(fileName, stringify(yaml, { lineWidth: 0 }).trim());
}

type TaggedGenElement = {
  gen_hash: string;
};

/**
 * Merge source into target, but only when a key is prefixed with gen_. Uses gen_id to match objects
 * @param target
 * @param source
 * @returns
 */
export function deepMerge(target: any, source: any) {
  for (const key in source) {
    // do nothing if its a key (id or hash) property
    //if (key == "gen_id") continue;

    if (source[key] instanceof Array) {
      // For arrays, only make sure every property in source is in target
      let sourceArr = source[key];
      let targetArr = target[key];

      // if it doesn't exist, we create a new array.
      if (!targetArr) {
        targetArr = [];
        target[key] = targetArr;
      }

      sourceArr.forEach((element: TaggedGenElement) => {
        let targetElement = targetArr.find((e: TaggedGenElement) => e.gen_hash == element.gen_hash);

        if (!targetElement) {
          // if not found, add
          targetArr.push(element);
        } else {
          // recurse over that element specifically
          targetElement = deepMerge(targetElement, element);
        }
      });
    } else if (typeof source[key] === "object" && source[key] !== null) {
      // For Objects, we make sure each property is checked
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      // For primitives, we only copy over gen_
      if (key.startsWith("gen_")) target[key] = source[key];
    }
  }
  return target;
}

export function fastHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  let num = Math.abs(hash & hash);
  return num.toString(16);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
