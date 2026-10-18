import { CodeReview } from "../lib/code-review.js";
import { LookupIncremental } from "../lib/lookup-incremental.js";

const ir = await LookupIncremental.loadIncident("2017-03-06_maps", 3);

if (!ir) throw "could not load ir";

const actionables = ir.actionables;
console.log("# Actionables:", actionables.length);
const tasks = actionables.flatMap((a) => a.contextLinksToTaskRelations).map((r) => r.actual);

// direct
const codeReviewsTaggedWithBug = tasks.flatMap((task) => task.detailsMRRelations).map((r) => r.actual);
console.log("# Code Reviews (Direct)", codeReviewsTaggedWithBug.length);

// second direct (task graph)
const relatedTasks = tasks.flatMap((task) => task.relatedTaskRelations).map((r) => r.actual);
const relatedCodeReviews = relatedTasks.flatMap((task) => task.detailsMRRelations).map((r) => r.actual);
console.log("# Code Reviews (Second - Task Graph)", relatedCodeReviews.length);

// second direct (mentioned)
const mentionedTasks = tasks.flatMap((task) => task.mentionedTaskRelations).map((r) => r.actual);
const mentionedCodeReviews = mentionedTasks.flatMap((task) => task.detailsMRRelations).map((r) => r.actual);
console.log("# Code Reviews (Second - Mentioned)", mentionedCodeReviews.length);

const collected = Array.from(
  new Set([...codeReviewsTaggedWithBug, ...relatedCodeReviews, ...mentionedCodeReviews])
);
console.log("# Code Reviews (Collected)", collected.length);

console.log(CodeReview.all.length);

console.log("Done");
