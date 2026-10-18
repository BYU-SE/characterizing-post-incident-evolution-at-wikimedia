import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Task } from "../lib/task.js";
import { CodeReview } from "../lib/code-review.js";
import stringify from "json-stringify-pretty-compact";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type SummaryOfIR = {
  ir: string;
  directCodeReviews: Container;
  directCommits: Container;
  tasks: Container;
  tasksAfter: Container;
  codeReviews: Container;
  codeReviewsAfter: Container;
  commits: Container;
  childTasks: Container;
  childTasksAfter: Container;
  childCodeReviews: Container;
  childCommits: Container;
};
type Container = { count: number; survived?: Flow; died?: Flow };
type Flow = Record<string, ResultsGroup>;
type ResultsGroup = {
  count: number;
  ids?: string[];
};

const results: SummaryOfIR[] = [];

function getCRContainer(
  items: CodeReview[],
  survived: [string, items: CodeReview[]][],
  died: [string, items: CodeReview[]][]
): Container {
  let obj = {
    count: items.length,
    survived: {} as Record<string, ResultsGroup>,
    died: {} as Record<string, ResultsGroup>,
  };
  survived.forEach((s) => {
    obj.survived[s[0]] = {
      count: s[1].length,
      ids: s[1].map((c) => "" + c.virtual_id_number),
    };
  });
  died.forEach((s) => {
    obj.died[s[0]] = {
      count: s[1].length,
      ids: s[1].map((c) => "" + c.virtual_id_number),
    };
  });
  return obj;
}
function getTaskContainer(
  items: Task[],
  survived: [string, items: Task[]][],
  died: [string, items: Task[]][]
): Container {
  let obj = {
    count: items.length,
    survived: {} as Record<string, ResultsGroup>,
    died: {} as Record<string, ResultsGroup>,
  };
  survived.forEach((s) => {
    obj.survived[s[0]] = {
      count: s[1].length,
      ids: s[1].map((x) => x.id),
    };
  });
  died.forEach((s) => {
    obj.died[s[0]] = {
      count: s[1].length,
      ids: s[1].map((x) => x.id),
    };
  });
  return obj;
}

function getCRResultsGroup(cr: CodeReview[]): ResultsGroup {
  return {
    count: cr.length,
    ids: cr.map((c) => "" + c.virtual_id_number),
  };
}
function getTasksResultsGroup(tasks: Task[]): ResultsGroup {
  return {
    count: tasks.length,
    ids: tasks.map((t) => t.id),
  };
}

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.red(`IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) throw "could not load ir";

  const actionables = ir.actionables;
  // survive groups
  const actionablesWithTask = actionables.filter((a) => a.contextLinksToTaskRelations.length > 0);
  const actionablesWithCodeReview = actionables.filter((a) => a.contextLinksToCodeReviewRelations.length > 0);
  // death groups

  const tasks = actionablesWithTask.flatMap((a) => a.contextLinksToTaskRelations.map((r) => r.actual));
  // survive groups
  const tasksWithCodeReview = tasks.filter((t) => t.detailsMRRelations.length > 0);
  const tasksWithChildTasks = tasks.filter(
    (t) => t.relatedTaskRelations.length > 0
    //  || t.mentionedTaskRelations.length > 0 // TODO: is mentioned tasks classified as child?
  );
  // death groups
  const tasksWithoutCodeReviewsOrChildTasks = tasks.filter(
    (task) => task.detailsMRRelations.length == 0 && task.relatedTaskRelations.length == 0
  );

  const incidentDate = new Date(ir.dates[0]) || new Date(0);
  // tasks after
  const tasksAfter = tasks.filter((t) => new Date(t.dto.gen_createdDate) > incidentDate);
  const tasksWithCodeReviewAfter = tasksWithCodeReview.filter(
    (t) => new Date(t.dto.gen_createdDate) > incidentDate
  );
  const tasksWithChildTasksAfter = tasksWithChildTasks.filter(
    (t) => new Date(t.dto.gen_createdDate) > incidentDate
  );
  const tasksWithoutCodeReviewsOrChildTasksAfter = tasksWithoutCodeReviewsOrChildTasks.filter(
    (t) => new Date(t.dto.gen_createdDate) > incidentDate
  );

  const directCodeReviews = actionablesWithCodeReview.flatMap((a) =>
    a.contextLinksToCodeReviewRelations.map((r) => r.actual)
  );
  // survive groups
  const directCodeReviewsWithDirectCommits = directCodeReviews.filter((cr) => cr.dto.status == "MERGED");
  // death groups
  const directCodeReviewsWithoutDirectCommits = directCodeReviews.filter((cr) => cr.dto.status != "MERGED");

  const directCommits = directCodeReviewsWithDirectCommits.flatMap((cr) => cr.commit);
  // TODO: Finish what happens with commits

  const codeReviews = tasksWithCodeReview.flatMap((t) => t.detailsMRRelations.map((r) => r.actual));
  // survive groups
  const codeReviewsWithCommits = codeReviews.filter((cr) => cr.dto.status == "MERGED");
  // death groups
  const codeReviewsWithoutCommits = codeReviews.filter((cr) => cr.dto.status != "MERGED");

  // code reviews after
  const codeReviewsAfter = codeReviews.filter((t) => new Date(t.dto.created) > incidentDate);
  const codeReviewsWithCommitsAfter = codeReviewsWithCommits.filter(
    (t) => new Date(t.dto.created) > incidentDate
  );
  const codeReviewsWithoutCommitsAfter = codeReviewsWithoutCommits.filter(
    (t) => new Date(t.dto.created) > incidentDate
  );

  const commits = codeReviewsWithCommits.flatMap((cr) => cr.commit);

  const childTasks = tasksWithChildTasks.flatMap((t) => t.relatedTaskRelations.map((r) => r.actual));
  // survive groups
  const childTasksWithChildCodeReview = childTasks.filter((t) => t.detailsMRRelations.length > 0);
  const childTasksWithNthChildTasks = childTasks.filter(
    (t) => t.relatedTaskRelations.length > 0
    //  || t.mentionedTaskRelations.length > 0 // TODO: is mentioned tasks classified as child?
  );
  // death groups
  const childTasksWithoutCodeReviewsOrNthChildTasks = childTasks.filter(
    (task) => task.detailsMRRelations.length == 0 && task.relatedTaskRelations.length == 0
  );

  // child tasks after
  const childTasksAfter = childTasks.filter((t) => new Date(t.dto.gen_createdDate) > incidentDate);
  const childTasksWithChildCodeReviewAfter = childTasksWithChildCodeReview.filter(
    (t) => new Date(t.dto.gen_createdDate) > incidentDate
  );
  const childTasksWithNthChildTasksAfter = childTasksWithNthChildTasks.filter(
    (t) => new Date(t.dto.gen_createdDate) > incidentDate
  );
  const childTasksWithoutCodeReviewsOrNthChildTasksAfter = childTasksWithoutCodeReviewsOrNthChildTasks.filter(
    (t) => new Date(t.dto.gen_createdDate) > incidentDate
  );

  const childCodeReviews = childTasksWithChildCodeReview.flatMap((t) =>
    t.detailsMRRelations.map((r) => r.actual)
  );
  // survive groups
  const childCodeReviewsWithChildCommits = childCodeReviews.filter((cr) => cr.dto.status == "MERGED");
  // death groups
  const childCodeReviewsWithoutChildCommits = childCodeReviews.filter((cr) => cr.dto.status != "MERGED");

  const childCommits = childCodeReviewsWithChildCommits.flatMap((cr) => cr.commit);

  results.push({
    ir: ir.id,
    directCodeReviews: getCRContainer(
      directCodeReviews,
      [["directCodeReviewsWithDirectCommits", directCodeReviewsWithDirectCommits]],
      [["directCodeReviewsWithoutDirectCommits", directCodeReviewsWithoutDirectCommits]]
    ),
    directCommits: {
      count: directCommits.length,
    },
    tasks: getTaskContainer(
      tasks,
      [
        ["tasksWithCodeReview", tasksWithCodeReview],
        ["tasksWithChildTasks", tasksWithChildTasks],
      ],
      [["tasksWithoutCodeReviewsOrChildTasks", tasksWithoutCodeReviewsOrChildTasks]]
    ),
    tasksAfter: getTaskContainer(
      tasksAfter,
      [
        ["tasksWithCodeReviewAfter", tasksWithCodeReviewAfter],
        ["tasksWithChildTasksAfter", tasksWithChildTasksAfter],
      ],
      [["tasksWithoutCodeReviewsOrChildTasksAfter", tasksWithoutCodeReviewsOrChildTasksAfter]]
    ),
    codeReviews: getCRContainer(
      codeReviews,
      [["codeReviewsWithCommits", codeReviewsWithCommits]],
      [["codeReviewsWithoutCommits", codeReviewsWithoutCommits]]
    ),
    codeReviewsAfter: getCRContainer(
      codeReviewsAfter,
      [["codeReviewsWithCommitsAfter", codeReviewsWithCommitsAfter]],
      [["codeReviewsWithoutCommitsAfter", codeReviewsWithoutCommitsAfter]]
    ),
    commits: {
      count: commits.length,
    },
    childTasks: getTaskContainer(
      childTasks,
      [
        ["childTasksWithChildCodeReview", childTasksWithChildCodeReview],
        ["childTasksWithNthChildTasks", childTasksWithNthChildTasks],
      ],
      [["childTasksWithoutCodeReviewsOrNthChildTasks", childTasksWithoutCodeReviewsOrNthChildTasks]]
    ),
    childTasksAfter: getTaskContainer(
      childTasksAfter,
      [
        ["childTasksWithChildCodeReviewAfter", childTasksWithChildCodeReviewAfter],
        ["childTasksWithNthChildTasksAfter", childTasksWithNthChildTasksAfter],
      ],
      [["childTasksWithoutCodeReviewsOrNthChildTasksAfter", childTasksWithoutCodeReviewsOrNthChildTasksAfter]]
    ),
    childCodeReviews: getCRContainer(
      childCodeReviews,
      [["childCodeReviewsWithChildCommits", childCodeReviewsWithChildCommits]],
      [["childCodeReviewsWithoutChildCommits", childCodeReviewsWithoutChildCommits]]
    ),
    childCommits: {
      count: childCommits.length,
    },
  });
}

console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));

writeFileSync(join(__dirname, "ir_summary.json"), stringify(results));
