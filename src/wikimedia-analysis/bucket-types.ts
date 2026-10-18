import { countBy, groupBy } from "underscore";
import { Task } from "../lib/task.js";

export type TimeBucket<TimeType> = {
  pre: TimeType;
  preClosed: TimeType;
  during: TimeType;
  post: TimeType;
};
export type TaskTimeBucketedGroup = {
  irMentionedCRs: TimeBucket<string[]>;
  irMentionedTasks: TimeBucket<string[]>;
  childTasks: TimeBucket<string[]>;
  mentionedTasks: TimeBucket<string[]>;
};

export type TaskBucketedGroup = {
  irMentionedCRs: string[];
  irMentionedTasks: string[];
  childTasks: string[];
  mentionedTasks: string[];
};

export type TaskBucketResult = {
  summary: {
    irMentionedCRs: TimeBucket<number>;
    irMentionedTasks: TimeBucket<number>;
    childTasks: TimeBucket<number>;
    mentionedTasks: TimeBucket<number>;
  };
  byTaskBucket: (TaskBucketedGroup & { ir: string })[];
  byTimeAndTaskBucket: (TaskTimeBucketedGroup & { ir: string })[];
};
export function appendToFirstTimeBucket<T>(first: TimeBucket<T[]>, tb2: TimeBucket<T[]>): void {
  first.pre.push(...tb2.pre);
  first.preClosed.push(...tb2.preClosed);
  first.during.push(...tb2.during);
  first.post.push(...tb2.post);
}
export function printBucketCounts(b: TimeBucket<any[]>) {
  console.log("Bucket Contents");
  console.log(`PRE: ${b.pre.length}`);
  console.log(`PRE CLOSED: ${b.preClosed.length}`);
  console.log(`DURING: ${b.during.length}`);
  console.log(`POST: ${b.post.length}`);
}
export function printTaskBucketCounts(b: TimeBucket<Task[]> | undefined) {
  console.log("Bucket Contents");

  if (b === undefined) {
    console.log("No Bucket");
    return;
  }

  console.log(`PRE: ${b.pre.length} ${taskShortHand(b.pre)}`);
  console.log(`PRE CLOSED: ${b.preClosed.length} ${taskShortHand(b.preClosed)}`);
  console.log(`DURING: ${b.during.length} ${taskShortHand(b.during)}`);
  console.log(`POST: ${b.post.length} ${taskShortHand(b.post)}`);
}

function taskShortHand(tasks: Task[]): string {
  const g = countBy(tasks, (x) =>
    x.dto.gen_status.includes("Resolved")
      ? "Resolved"
      : x.dto.gen_status.includes("Declined")
      ? "Declined"
      : x.dto.gen_status.includes("Duplicate")
      ? "Duplicate"
      : x.dto.gen_status.includes("Invalid")
      ? "Invalid"
      : "Other"
  );
  return JSON.stringify(g);
}
