import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { IR } from "../lib/ir.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Task } from "../lib/task.js";
import { SummaryOfLifecycle } from "./summary-types.js";
import { CodeReview } from "../lib/code-review.js";

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

console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));

// survive groups
const irsWithActionables = irs.filter((ir) => ir.actionables.length > 0);
// death groups
const irsWithoutActionables = irs.filter((ir) => ir.actionables.length == 0);

const actionables = irsWithActionables.flatMap((ir) => ir.actionables);
// survive groups
const actionablesWithTask = actionables.filter((a) => a.contextLinksToTaskRelations.length > 0);
const actionablesWithCodeReview = actionables.filter((a) => a.contextLinksToCodeReviewRelations.length > 0);
// death groups
const actionablesWithoutTaskOrCodeReview = actionables.filter(
  (a) => a.contextLinksToCodeReviewRelations.length == 0 && a.contextLinksToTaskRelations.length == 0
);

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

const childCodeReviews = childTasksWithChildCodeReview.flatMap((t) =>
  t.detailsMRRelations.map((r) => r.actual)
);
// survive groups
const childCodeReviewsWithChildCommits = childCodeReviews.filter((cr) => cr.dto.status == "MERGED");
// death groups
const childCodeReviewsWithoutChildCommits = childCodeReviews.filter((cr) => cr.dto.status != "MERGED");

const childCommits = childCodeReviewsWithChildCommits.flatMap((cr) => cr.commit);

console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));
console.log(chalk.blue("###########################################################################"));

const results: SummaryOfLifecycle = {
  irs: {
    count: irs.length,
    survived: {
      irsWithActionables: {
        count: irsWithActionables.length,
        ids: irsWithActionables.map(
          (ir) => `file://./../../data/wikimedia-incident-reports-extract/${ir.id}.yaml`
        ),
      },
    },
    died: {
      irsWithoutActionables: {
        count: irsWithoutActionables.length,
        ids: irsWithoutActionables.map(
          (ir) => `file://./../../data/wikimedia-incident-reports-extract/${ir.id}.yaml`
        ),
      },
    },
  },
  actionables: {
    count: actionables.length,
    survived: {
      actionablesWithTask: {
        count: actionablesWithTask.length,
        ids: actionablesWithTask.map((a) => a.id),
      },
      actionablesWithCodeReview: {
        count: actionablesWithCodeReview.length,
        ids: actionablesWithCodeReview.map((a) => a.id),
      },
    },
    died: {
      actionablesWithoutTaskOrCodeReview: {
        count: actionablesWithoutTaskOrCodeReview.length,
        ids: actionablesWithoutTaskOrCodeReview.map((a) => a.id),
      },
    },
  },
  directCodeReviews: {
    count: directCodeReviews.length,
    survived: {
      directCodeReviewsWithCommits: {
        count: directCodeReviewsWithDirectCommits.length,
        ids: directCodeReviewsWithDirectCommits.map((cr) => "" + cr.virtual_id_number),
      },
    },
    died: {
      directCodeReviewsWithoutCommits: {
        count: directCodeReviewsWithoutDirectCommits.length,
        ids: directCodeReviewsWithoutDirectCommits.map((cr) => "" + cr.virtual_id_number),
      },
    },
  },
  directCommits: {
    count: directCommits.length,
  },
  tasks: {
    count: tasks.length,
    survived: {
      tasksWithCodeReview: {
        count: tasksWithCodeReview.length,
        ids: tasksWithCodeReview.map((t) => t.id),
      },
      tasksWithChildTasks: {
        count: tasksWithChildTasks.length,
        ids: tasksWithChildTasks.map((t) => t.id),
      },
    },
    died: {
      tasksWithoutCodeReviewsOrChildTasks: {
        count: tasksWithoutCodeReviewsOrChildTasks.length,
        ids: tasksWithoutCodeReviewsOrChildTasks.map((t) => t.id),
      },
    },
  },
  codeReviews: {
    count: codeReviews.length,
    survived: {
      codeReviewsWithCommits: {
        count: codeReviewsWithCommits.length,
        ids: codeReviewsWithCommits.map((cr) => "" + cr.virtual_id_number),
      },
    },
    died: {
      codeReviewsWithoutCommits: {
        count: codeReviewsWithoutCommits.length,
        ids: codeReviewsWithoutCommits.map((cr) => "" + cr.virtual_id_number),
      },
    },
  },
  commits: {
    count: commits.length,
  },
  childTasks: {
    count: childTasks.length,
    survived: {
      childTasksWithChildCodeReview: {
        count: childTasksWithChildCodeReview.length,
        ids: childTasksWithChildCodeReview.map((t) => t.id),
      },
      childTasksWithNthChildTasks: {
        count: childTasksWithNthChildTasks.length,
        ids: childTasksWithNthChildTasks.map((t) => t.id),
      },
    },
    died: {
      childTasksWithoutCodeReviewsOrNthChildTasks: {
        count: childTasksWithoutCodeReviewsOrNthChildTasks.length,
        ids: childTasksWithoutCodeReviewsOrNthChildTasks.map((t) => t.id),
      },
    },
  },
  childCodeReviews: {
    count: childCodeReviews.length,
    survived: {
      childCodeReviewsWithCommits: {
        count: childCodeReviewsWithChildCommits.length,
        ids: childCodeReviewsWithChildCommits.map((cr) => "" + cr.virtual_id_number),
      },
    },
    died: {
      childCodeReviewsWithoutCommits: {
        count: childCodeReviewsWithoutChildCommits.length,
        ids: childCodeReviewsWithoutChildCommits.map((cr) => "" + cr.virtual_id_number),
      },
    },
  },
  childCommits: {
    count: childCommits.length,
  },
};

writeFileSync(join(__dirname, "lifecycle_summary.json"), JSON.stringify(results, null, "  "));

const relationChain: Record<string, string[]> = {};
Task.all.forEach((t) => {
  relationChain[t.id] = t.relationChain.map((depthTracker) => depthTracker.stamps.join(" => "));
});
CodeReview.all.forEach((cr) => {
  relationChain["" + cr.virtual_id_number] = cr.relationChain.map((depthTracker) =>
    depthTracker.stamps.join(" => ")
  );
});
writeFileSync(join(__dirname, "relationship_chains.json"), JSON.stringify(relationChain, null, "  "));
