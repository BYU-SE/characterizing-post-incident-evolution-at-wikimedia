import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import {
  cleanIRLink,
  incidentReportBaseURL,
  incidentReportLinks,
} from "../wikimedia-scraping/incident-reports.js";

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.red(`IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 2);

  if (!ir) throw "could not load ir";

  /*const actionables = ir.actionables;
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
  });*/
}
