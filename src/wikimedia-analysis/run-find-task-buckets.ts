import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { partition, unique } from "underscore";
import { Task } from "../lib/task.js";
import { IR } from "../lib/ir.js";
import { CodeReview } from "../lib/code-review.js";
import { TaskBucketResult, TimeBucket } from "./bucket-types.js";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const result: TaskBucketResult = {
  summary: {
    irMentionedCRs: {
      pre: 0,
      preClosed: 0,
      during: 0,
      post: 0,
    },
    irMentionedTasks: {
      pre: 0,
      preClosed: 0,
      during: 0,
      post: 0,
    },
    childTasks: {
      pre: 0,
      preClosed: 0,
      during: 0,
      post: 0,
    },
    mentionedTasks: {
      pre: 0,
      preClosed: 0,
      during: 0,
      post: 0,
    },
  },
  byTaskBucket: [],
  byTimeAndTaskBucket: [],
};

const ONLY_IDS = false;
// type, task id, distance (days), priority
type DistanceEntry = [string, string, number, string];

const openDistances: DistanceEntry[] = [];
const closedDistances: DistanceEntry[] = [];

function bucketTasksByTime(ir: IR, tasks: Task[], numDays: number = 14): TimeBucket<string[]> {
  const incidentDate = new Date(ir.dates[0]) || new Date(0);

  const afterDate = new Date(incidentDate);
  afterDate.setDate(incidentDate.getDate() + numDays);

  const [preTasks, otherTasks] = partition(tasks, (x) => new Date(x.dto.gen_createdDate) < incidentDate);
  const preClosedTasks = preTasks.filter((t) => {
    const closed = t.getDateClosed();
    if (closed == "") return false;
    return new Date(closed) < incidentDate;
  });
  const [duringTasks, afterTasks] = partition(otherTasks, (x) => new Date(x.dto.gen_createdDate) < afterDate);

  return {
    pre: preTasks.map((t) => (ONLY_IDS ? t.id : `${t.id}|${t.dto.gen_status}`)),
    preClosed: preClosedTasks.map((t) => (ONLY_IDS ? t.id : `${t.id}|${t.dto.gen_status}`)),
    during: duringTasks.map((t) => (ONLY_IDS ? t.id : `${t.id}|${t.dto.gen_status}`)),
    post: afterTasks.map((t) => (ONLY_IDS ? t.id : `${t.id}|${t.dto.gen_status}`)),
  };
}
function bucketCRsByTime(ir: IR, crs: CodeReview[], numDays: number = 14): TimeBucket<string[]> {
  const incidentDate = new Date(ir.dates[0]) || new Date(0);

  const afterDate = new Date(incidentDate);
  afterDate.setDate(incidentDate.getDate() + numDays);

  const [preCRs, otherCRs] = partition(crs, (x) => new Date(x.dto.created) < incidentDate);
  const preClosedCRs = preCRs.filter((cr) => {
    const closed = cr.getDateClosed();
    if (closed == "") return false;
    return new Date(closed) < incidentDate;
  });
  const [duringCRs, afterCRs] = partition(otherCRs, (x) => new Date(x.dto.created) < afterDate);

  return {
    pre: preCRs.map((cr) =>
      ONLY_IDS ? `${cr.virtual_id_number}` : `${cr.virtual_id_number}|${cr.dto.status}`
    ),
    preClosed: preClosedCRs.map((cr) =>
      ONLY_IDS ? `${cr.virtual_id_number}` : `${cr.virtual_id_number}|${cr.dto.status}`
    ),
    during: duringCRs.map((cr) =>
      ONLY_IDS ? `${cr.virtual_id_number}` : `${cr.virtual_id_number}|${cr.dto.status}`
    ),
    post: afterCRs.map((cr) =>
      ONLY_IDS ? `${cr.virtual_id_number}` : `${cr.virtual_id_number}|${cr.dto.status}`
    ),
  };
}

function taskOpenDistanceToIncident(ir: IR, task: Task) {
  const incidentDate = new Date(ir.dates[0]) || new Date(0);
  const createdDate = new Date(task.dto.gen_createdDate);
  return Math.floor((+createdDate - +incidentDate) / 86400000); // by days
}
function taskClosedDistanceToIncident(ir: IR, task: Task) {
  const incidentDate = new Date(ir.dates[0]) || new Date(0);
  const closed = task.getDateClosed();
  if (closed == "") return "";
  const closedDate = new Date(closed);
  return Math.floor((+closedDate - +incidentDate) / 86400000); // by days
}
function crOpenDistanceToIncident(ir: IR, cr: CodeReview) {
  const incidentDate = new Date(ir.dates[0]) || new Date(0);
  const createdDate = new Date(cr.dto.created);
  return Math.floor((+createdDate - +incidentDate) / 86400000); // by days
}
function crClosedDistanceToIncident(ir: IR, cr: CodeReview): number | "" {
  const incidentDate = new Date(ir.dates[0]) || new Date(0);
  const closed = cr.getDateClosed();
  if (closed == "") return "";
  const closedDate = new Date(closed);
  return Math.floor((+closedDate - +incidentDate) / 86400000); // by days
}

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.red(`IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) throw "could not load ir";

  const actionables = ir.actionables;
  const actionablesWithTask = actionables.filter((a) => a.contextLinksToTaskRelations.length > 0);
  const actionablesWithCodeReview = actionables.filter((a) => a.contextLinksToCodeReviewRelations.length > 0);

  const tasks = unique(
    actionablesWithTask.flatMap((a) => a.contextLinksToTaskRelations.map((r) => r.actual)),
    false,
    (t) => t.id
  );
  const directCodeReviews = unique(
    actionablesWithCodeReview.flatMap((a) => a.contextLinksToCodeReviewRelations.map((r) => r.actual)),
    false,
    (cr) => cr.virtual_id_number
  );

  // Bin into Task buckets
  const irMentionedTasks = tasks;
  const childTasks = unique(
    tasks
      .filter((t) => t.relatedTaskRelations.length > 0)
      .flatMap((t) => t.relatedTaskRelations.map((r) => r.actual)),
    false,
    (t) => t.id
  );
  const mentionedTasks = unique(
    tasks
      .filter((t) => t.mentionedTaskRelations.length > 0)
      .flatMap((t) => t.mentionedTaskRelations.map((r) => r.actual)),
    false,
    (t) => t.id
  );

  // Append to raw distances
  openDistances.push(
    ...directCodeReviews.map(
      (cr) =>
        [
          "directCodeReviews",
          "" + cr.virtual_id_number,
          crOpenDistanceToIncident(ir, cr),
          "",
        ] as DistanceEntry
    )
  );
  openDistances.push(
    ...irMentionedTasks.map(
      (t) =>
        ["irMentionedTasks", t.id, taskOpenDistanceToIncident(ir, t), t.getPriorityAtClose()] as DistanceEntry
    )
  );
  openDistances.push(
    ...childTasks.map(
      (t) => ["childTasks", t.id, taskOpenDistanceToIncident(ir, t), t.getPriorityAtClose()] as DistanceEntry
    )
  );
  openDistances.push(
    ...mentionedTasks.map(
      (t) =>
        ["mentionedTasks", t.id, taskOpenDistanceToIncident(ir, t), t.getPriorityAtClose()] as DistanceEntry
    )
  );

  closedDistances.push(
    ...directCodeReviews.map(
      (cr) =>
        [
          "directCodeReviews",
          "" + cr.virtual_id_number,
          crClosedDistanceToIncident(ir, cr),
          "",
        ] as DistanceEntry
    )
  );
  closedDistances.push(
    ...irMentionedTasks.map(
      (t) =>
        [
          "irMentionedTasks",
          t.id,
          taskClosedDistanceToIncident(ir, t),
          t.getPriorityAtClose(),
        ] as DistanceEntry
    )
  );
  closedDistances.push(
    ...childTasks.map(
      (t) =>
        ["childTasks", t.id, taskClosedDistanceToIncident(ir, t), t.getPriorityAtClose()] as DistanceEntry
    )
  );
  closedDistances.push(
    ...mentionedTasks.map(
      (t) =>
        ["mentionedTasks", t.id, taskClosedDistanceToIncident(ir, t), t.getPriorityAtClose()] as DistanceEntry
    )
  );

  // Append to results
  result.byTaskBucket.push({
    ir: ir.id,
    irMentionedCRs: directCodeReviews.map((cr) => "" + cr.virtual_id_number),
    irMentionedTasks: irMentionedTasks.map((t) => t.id),
    childTasks: childTasks.map((t) => t.id),
    mentionedTasks: mentionedTasks.map((t) => t.id),
  });

  const byTimeAndTask = {
    ir: ir.id,
    irMentionedCRs: bucketCRsByTime(ir, directCodeReviews),
    irMentionedTasks: bucketTasksByTime(ir, irMentionedTasks),
    childTasks: bucketTasksByTime(ir, childTasks),
    mentionedTasks: bucketTasksByTime(ir, mentionedTasks),
  };
  result.byTimeAndTaskBucket.push(byTimeAndTask);

  result.summary.irMentionedCRs.pre += byTimeAndTask.irMentionedCRs.pre.length;
  result.summary.irMentionedCRs.preClosed += byTimeAndTask.irMentionedCRs.preClosed.length;
  result.summary.irMentionedCRs.during += byTimeAndTask.irMentionedCRs.during.length;
  result.summary.irMentionedCRs.post += byTimeAndTask.irMentionedCRs.post.length;

  result.summary.irMentionedTasks.pre += byTimeAndTask.irMentionedTasks.pre.length;
  result.summary.irMentionedTasks.preClosed += byTimeAndTask.irMentionedTasks.preClosed.length;
  result.summary.irMentionedTasks.during += byTimeAndTask.irMentionedTasks.during.length;
  result.summary.irMentionedTasks.post += byTimeAndTask.irMentionedTasks.post.length;

  result.summary.childTasks.pre += byTimeAndTask.childTasks.pre.length;
  result.summary.childTasks.preClosed += byTimeAndTask.childTasks.preClosed.length;
  result.summary.childTasks.during += byTimeAndTask.childTasks.during.length;
  result.summary.childTasks.post += byTimeAndTask.childTasks.post.length;

  result.summary.mentionedTasks.pre += byTimeAndTask.mentionedTasks.pre.length;
  result.summary.mentionedTasks.preClosed += byTimeAndTask.mentionedTasks.preClosed.length;
  result.summary.mentionedTasks.during += byTimeAndTask.mentionedTasks.during.length;
  result.summary.mentionedTasks.post += byTimeAndTask.mentionedTasks.post.length;
}

// write file
writeFileSync(join(__dirname, "task_buckets.json"), JSON.stringify(result, null, "  "));

// Only irMentionedCRs and Tasks, with Declined, Invalid, Duplicate
const abandonedOnly = JSON.parse(JSON.stringify(result)) as Partial<TaskBucketResult>;
delete abandonedOnly.byTaskBucket;
delete abandonedOnly.summary;
abandonedOnly.byTimeAndTaskBucket = abandonedOnly.byTimeAndTaskBucket!.filter((x) => {
  const join =
    x.irMentionedCRs.pre.join("") +
    x.irMentionedCRs.during.join("") +
    x.irMentionedCRs.post.join("") +
    x.irMentionedTasks.pre.join("") +
    x.irMentionedTasks.during.join("") +
    x.irMentionedTasks.post.join("");
  // Closed, Declined (238), Closed, Invalid (107), Closed, Duplicate (83).
  return (
    join.includes("Closed, Declined") ||
    join.includes("Closed, Invalid") ||
    join.includes("Closed, Duplicate") ||
    join.includes("ABANDONED")
  );
});

writeFileSync(
  join(__dirname, "task_buckets_filtered_abandoned.json"),
  JSON.stringify(abandonedOnly, null, "  ")
);

writeFileSync(
  join(__dirname, "task_buckets_open_distances.csv"),
  Papa.unparse(openDistances, { header: true })
);
writeFileSync(
  join(__dirname, "task_buckets_closed_distances.csv"),
  Papa.unparse(closedDistances, { header: true })
);
