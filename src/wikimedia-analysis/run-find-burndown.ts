import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { unique } from "underscore";
import { TaskBucketResult, TaskTimeBucketedGroup } from "./bucket-types.js";
import { CodeReview } from "../lib/code-review.js";
import { IR } from "../lib/ir.js";
import { createDepthTracker } from "../lib/depth-tracker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const binned = JSON.parse(readFileSync(join(__dirname, "task_buckets.json"), "utf-8")) as TaskBucketResult;
type Entries = [number, string][];
type Sum = {
  irMentionedCRs: {
    pre: Entries;
    preClosed: Entries;
    during: Entries;
    post: Entries;
  };
  irMentionedTasks: {
    pre: Entries;
    preClosed: Entries;
    during: Entries;
    post: Entries;
  };
  childTasks: {
    pre: Entries;
    preClosed: Entries;
    during: Entries;
    post: Entries;
  };
  mentionedTasks: {
    pre: Entries;
    preClosed: Entries;
    during: Entries;
    post: Entries;
  };
};
const all: Sum = {
  irMentionedCRs: {
    pre: [],
    preClosed: [],
    during: [],
    post: [],
  },
  irMentionedTasks: {
    pre: [],
    preClosed: [],
    during: [],
    post: [],
  },
  childTasks: {
    pre: [],
    preClosed: [],
    during: [],
    post: [],
  },
  mentionedTasks: {
    pre: [],
    preClosed: [],
    during: [],
    post: [],
  },
};

for(const record of binned.byTimeAndTaskBucket) {
  const ir = await IR.loadById(record.ir);
  const incidentDate = new Date(ir.dates[0]) || new Date(0);

  for(const crId of record.irMentionedCRs.pre) {
    const cr = await CodeReview.loadById(crId, createDepthTracker(0));
    if (cr) {
      const timeOpen = cr.getTimeOpen();
      if (typeof timeOpen === 'number') {
        all.irMentionedCRs.pre.push([timeOpen, crId]);
      }
    }
  }
}
  //all.irMentionedCRs.pre.push(...ir.irMentionedCRs.pre);
  //all.irMentionedCRs.preClosed.push(...ir.irMentionedCRs.preClosed);
  //all.irMentionedCRs.during.push(...ir.irMentionedCRs.during);
  //all.irMentionedCRs.post.push(...ir.irMentionedCRs.post);
  //all.irMentionedTasks.pre.push(...ir.irMentionedTasks.pre);
  //all.irMentionedTasks.preClosed.push(...ir.irMentionedTasks.preClosed);
  //all.irMentionedTasks.during.push(...ir.irMentionedTasks.during);
  //all.irMentionedTasks.post.push(...ir.irMentionedTasks.post);
  //all.childTasks.pre.push(...ir.childTasks.pre);
  //all.childTasks.preClosed.push(...ir.childTasks.preClosed);
  //all.childTasks.during.push(...ir.childTasks.during);
  //all.childTasks.post.push(...ir.childTasks.post);
  //all.mentionedTasks.pre.push(...ir.mentionedTasks.pre);
  //all.mentionedTasks.preClosed.push(...ir.mentionedTasks.preClosed);
  //all.mentionedTasks.during.push(...ir.mentionedTasks.during);
  //all.mentionedTasks.post.push(...ir.mentionedTasks.post);
});

//writeFileSync(join(__dirname, "burndown_summary.json"), JSON.stringify(results, null, "  "));
