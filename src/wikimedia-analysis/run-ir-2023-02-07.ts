import chalk from "chalk";
import { CodeReview } from "../lib/code-review.js";
import { LookupIncremental } from "../lib/lookup-incremental.js";

const irID = "2023-02-07_mediawiki.page-undelete_event_stream";
const ir = await LookupIncremental.loadIncident(irID, 3);

if (!ir) throw "could not load ir";

console.log(chalk.red(`IR: ${irID}`));

const actionables = ir.actionables;
//console.log("# Actionables:", actionables.length);

actionables.forEach((actionable, index) => {
  console.log(chalk.green(`Actionable ${index + 1}: ${actionable.text}`));

  const tasks = actionable.contextLinksToTaskRelations.map((r) => r.actual);
  //console.log(`  # Tasks: ${tasks.length}`);
  tasks.forEach((task, index) => {
    console.log(chalk.yellow(`  Task ${index + 1}: ${task.title}`));
    console.log(chalk.yellow(`    Status: ${task.dto.gen_status}`));

    const codeReviews = task.detailsMRRelations.map((r) => r.actual);
    if (codeReviews.length == 0) {
      console.log(chalk.blue(`    No CodeReviews`));
    }

    codeReviews.forEach((cr, index) => {
      const numRevisions = Object.keys(cr.dto.revisions).length;
      const revision = cr.dto.revisions[cr.commit];
      console.log(chalk.blue(`    CodeReview ${index + 1}: ${cr.virtual_id_number}`));
      console.log(chalk.blue(`      Change to ${cr.dto.project}#${cr.dto.branch} ${cr.dto.status}`));
      console.log(chalk.blue(`      ${cr.commit} | ${revision.commit.subject}`));
      console.log(chalk.blue(`      ${numRevisions} revisions`));
    });
  });
});

/*
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
*/
