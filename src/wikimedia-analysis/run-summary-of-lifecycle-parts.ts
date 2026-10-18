import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { IR } from "../lib/ir.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Task } from "../lib/task.js";
import { CodeReview } from "../lib/code-review.js";
import Papa from "papaparse";
import { formatDate } from "../wikimedia-scraping/util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const irs: IR[] = [];

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.red(`IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) throw "could not load ir";

  irs.push(ir);
}
const irsWithActionables = irs.filter((ir) => ir.actionables.length > 0);
const irsWithoutActionables = irs.filter((ir) => ir.actionables.length == 0);

const actionables = irsWithActionables.flatMap((ir) => ir.actionables);
const actionablesWithTask = actionables.filter((a) => a.contextLinksToTaskRelations.length > 0);
const actionablesWithCodeReview = actionables.filter((a) => a.contextLinksToCodeReviewRelations.length > 0);
const actionablesWithoutTaskOrCodeReview = actionables.filter(
  (a) => a.contextLinksToCodeReviewRelations.length == 0 && a.contextLinksToTaskRelations.length == 0
);
const tasks = actionablesWithTask.flatMap((a) => a.contextLinksToTaskRelations.map((r) => r.actual));
const tasksWithCodeReview = tasks.filter((t) => t.detailsMRRelations.length > 0);
const tasksWithChildTasks = tasks.filter(
  (t) => t.relatedTaskRelations.length > 0
  //  || t.mentionedTaskRelations.length > 0 // TODO: is mentioned tasks classified as child?
);
const tasksWithoutCodeReviewsOrChildTasks = tasks.filter(
  (task) => task.detailsMRRelations.length == 0 && task.relatedTaskRelations.length == 0
);
const directCodeReviews = actionablesWithCodeReview.flatMap((a) =>
  a.contextLinksToCodeReviewRelations.map((r) => r.actual)
);
const directCodeReviewsWithDirectCommits = directCodeReviews.filter((cr) => cr.dto.status == "MERGED");
const directCodeReviewsWithoutDirectCommits = directCodeReviews.filter((cr) => cr.dto.status != "MERGED");
const directCommits = directCodeReviewsWithDirectCommits.flatMap((cr) => cr.commit);
const codeReviews = tasksWithCodeReview.flatMap((t) => t.detailsMRRelations.map((r) => r.actual));
const codeReviewsWithCommits = codeReviews.filter((cr) => cr.dto.status == "MERGED");
const codeReviewsWithoutCommits = codeReviews.filter((cr) => cr.dto.status != "MERGED");
const commits = codeReviewsWithCommits.flatMap((cr) => cr.commit);
const childTasks = tasksWithChildTasks.flatMap((t) => t.relatedTaskRelations.map((r) => r.actual));
const childTasksWithChildCodeReview = childTasks.filter((t) => t.detailsMRRelations.length > 0);
const childTasksWithNthChildTasks = childTasks.filter(
  (t) => t.relatedTaskRelations.length > 0
  //  || t.mentionedTaskRelations.length > 0 // TODO: is mentioned tasks classified as child?
);
const childTasksWithoutCodeReviewsOrNthChildTasks = childTasks.filter(
  (task) => task.detailsMRRelations.length == 0 && task.relatedTaskRelations.length == 0
);

const childCodeReviews = childTasksWithChildCodeReview.flatMap((t) =>
  t.detailsMRRelations.map((r) => r.actual)
);
const childCodeReviewsWithChildCommits = childCodeReviews.filter((cr) => cr.dto.status == "MERGED");
const childCodeReviewsWithoutChildCommits = childCodeReviews.filter((cr) => cr.dto.status != "MERGED");

const childCommits = childCodeReviewsWithChildCommits.flatMap((cr) => cr.commit);

console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));

function determineWhichCRSAreFromBeforeIncident() {
  type IRToCRMap = {
    ir: IR;
    crs: CodeReview[];
    dcrs: CodeReview[];
  };

  const maps: IRToCRMap[] = [];
  irs.forEach((ir) => {
    const crs: CodeReview[] = [];
    const dcrs: CodeReview[] = [];
    ir.actionables.forEach((a) => {
      a.contextLinksToCodeReviewRelations
        .map((a) => a.actual)
        .forEach((cr) => {
          dcrs.push(cr);
        });
      a.contextLinksToTaskRelations
        .map((a) => a.actual)
        .forEach((task) => {
          task.detailsMRRelations
            .map((a) => a.actual)
            .forEach((cr) => {
              crs.push(cr);
            });
        });
    });
    maps.push({
      ir,
      crs,
      dcrs,
    });
  });

  maps.forEach((m) => {
    const irDate = new Date(m.ir.dates[0]);

    const beforeDCR = m.dcrs
      .filter((cr) => {
        const d = new Date(cr.dto.created);
        return d < irDate;
      })
      .map((cr) => cr.virtual_id_number);

    const beforeCR = m.crs
      .filter((cr) => {
        const d = new Date(cr.dto.created);
        return d < irDate;
      })
      .map((cr) => cr.virtual_id_number);

    (beforeDCR.length > 0 || beforeCR.length > 0) && console.log(chalk.red(m.ir.id));
    beforeDCR.length > 0 &&
      console.log(
        "Before DCR: " + beforeDCR,
        chalk.blue(Math.floor((100 * beforeDCR.length) / m.dcrs.length))
      );
    beforeCR.length > 0 &&
      console.log("Before CR: " + beforeCR, chalk.blue(Math.floor((100 * beforeCR.length) / m.crs.length)));
  });
}

function irToCSV(ir: IR) {
  return {
    id: ir.id,
    checked: !!ir.dto.item_extraction_notes,
    firstDate: ir.dates[0],
    numActionables: ir.dto.items.length,
    numActionablesWithCodeReview: ir.actionables.flatMap((a) => a.contextLinksToCodeReviewRelations).length,
    numActionablesWithTasks: ir.actionables.flatMap((a) => a.contextLinksToTaskRelations).length,
  };
}

writeFileSync(join(__dirname, "ir.csv"), Papa.unparse(irs.map((ir) => irToCSV(ir))));

function taskToCSV(task: Task) {
  return {
    id: task.id,
    priority: task.dto.gen_priority,
    numComments: task.dto.gen_numComments,
    created: formatDate(new Date(task.dto.gen_createdDate)),
    status: task.dto.gen_status,
    statusFirst: task.dto.gen_status.includes("Open")
      ? "Open"
      : task.dto.gen_status.includes("Closed")
      ? "Closed"
      : "Other",
    statusSecond: task.dto.gen_status.includes("Closed") ? task.dto.gen_status.split(",")[1]! : "Other",

    numSubTasks: task.dto.gen_related_tasks.filter((x) => x.gen_relation.includes("subtask")).length,
    numDirectSubTasks: task.dto.gen_related_tasks.filter((x) => x.gen_relation.includes("direct subtask"))
      .length,
    numMRs: task.dto.gen_details_mrs.length,
  };
}

writeFileSync(join(__dirname, "tasks.csv"), Papa.unparse(tasks.map((t) => taskToCSV(t))));
writeFileSync(join(__dirname, "child-tasks.csv"), Papa.unparse(childTasks.map((t) => taskToCSV(t))));

function crToCSV(cr: CodeReview) {
  const labelVer = cr.getVerifiedLabelVotes();
  const labelCR = cr.getCodeReviewLabelVotes();
  return {
    id: cr.virtual_id_number,
    numRevisions: cr.numRevisions,
    isRevert: cr.getDoesRevertPreviousCommit(),
    hasTaskIdsInMessage: cr.getTaskIdsInMessage().length > 0,
    hasBugIDsInMessage: cr.getBugIdsInMessage().length > 0,
    bugIDsInMessage: cr.getBugIdsInMessage().join("|"),
    numBugIDsInMessage: cr.getBugIdsInMessage().length,
    created: formatDate(new Date(cr.dto.created)),
    updated: formatDate(new Date(cr.dto.updated)),
    timeOpen: cr.getTimeOpen(),
    numComments: cr.dto.total_comment_count,
    numMessages: cr.dto.messages.length,
    status: cr.dto.status,
    "labelCodeReview-2": labelCR[-2],
    "labelCodeReview-1": labelCR[-1],
    labelCodeReview0: labelCR[0],
    "labelCodeReview+1": labelCR[1],
    "labelCodeReview+2": labelCR[2],
    "labelVerified-1": labelVer[-1],
    labelVerified0: labelVer[0],
    "labelVerified+1": labelVer[1],
    "labelVerified+2": labelVer[2],
  };
}

writeFileSync(
  join(__dirname, "direct-code-reviews.csv"),
  Papa.unparse(directCodeReviews.map((cr) => crToCSV(cr)))
);
writeFileSync(join(__dirname, "code-reviews.csv"), Papa.unparse(codeReviews.map((cr) => crToCSV(cr))));
