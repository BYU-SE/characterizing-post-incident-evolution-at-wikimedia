import chalk from "chalk";
import { LookupIncremental } from "../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../wikimedia-scraping/incident-reports.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { unique } from "underscore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allRepoCommits = new Map<string, string[]>();
const allCommits: string[] = [];

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.red(`IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) throw "could not load ir";

  const actionables = ir.actionables;
  const actionablesWithTask = actionables.filter((a) => a.contextLinksToTaskRelations.length > 0);
  const actionablesWithCodeReview = actionables.filter((a) => a.contextLinksToCodeReviewRelations.length > 0);

  const tasks = actionablesWithTask.flatMap((a) => a.contextLinksToTaskRelations.map((r) => r.actual));
  const tasksWithCodeReview = tasks.filter((t) => t.detailsMRRelations.length > 0);
  const tasksWithChildTasks = tasks.filter((t) => t.relatedTaskRelations.length > 0);
  const directCodeReviews = actionablesWithCodeReview.flatMap((a) =>
    a.contextLinksToCodeReviewRelations.map((r) => r.actual)
  );
  const directCodeReviewsWithDirectCommits = directCodeReviews.filter((cr) => cr.dto.status == "MERGED");
  const codeReviews = tasksWithCodeReview.flatMap((t) => t.detailsMRRelations.map((r) => r.actual));
  const codeReviewsWithCommits = codeReviews.filter((cr) => cr.dto.status == "MERGED");

  const childTasks = tasksWithChildTasks.flatMap((t) => t.relatedTaskRelations.map((r) => r.actual));
  const childTasksWithChildCodeReview = childTasks.filter((t) => t.detailsMRRelations.length > 0);
  const childCodeReviews = childTasksWithChildCodeReview.flatMap((t) =>
    t.detailsMRRelations.map((r) => r.actual)
  );
  const childCodeReviewsWithChildCommits = childCodeReviews.filter((cr) => cr.dto.status == "MERGED");

  /*
   * Get all commits that are direct or normal commits
   */
  const directCommits = directCodeReviewsWithDirectCommits.flatMap((cr) => cr.commit);
  const commits = codeReviewsWithCommits.flatMap((cr) => cr.commit);
  //const childCommits = childCodeReviewsWithChildCommits.flatMap((cr) => cr.commit);

  const thisIRCommits = directCommits.slice().concat(commits.slice());
  allCommits.push(...directCommits);
  allCommits.push(...commits);
  //allCommits.push(...childCommits)

  const hasOverlap = new Set([...thisIRCommits]).size != thisIRCommits.length;
  if (hasOverlap) console.log("This IR has overlap");

  /*
   * Get the commit hashes count by repo
   */
  directCodeReviewsWithDirectCommits.forEach((cr) => {
    const arr = allRepoCommits.get(cr.dto.project) || [];
    arr.push(cr.commit);
    allRepoCommits.set(cr.dto.project, arr);
    /*if (!arr.includes(cr.commit)) {
      arr.push(cr.commit);
    } else {
      const others = directCodeReviewsWithDirectCommits.filter((dup) => dup.commit == cr.commit);
      console.log(
        "We found a duplicate directCodeReviewsWithDirectCommits",
        cr.commit,
        "num others",
        others.length,
        "ids",
        others.map((o) => o.virtual_id_number).join(",")
      );
    };*/
  });
  codeReviewsWithCommits.forEach((cr) => {
    const arr = allRepoCommits.get(cr.dto.project) || [];
    arr.push(cr.commit);
    allRepoCommits.set(cr.dto.project, arr);

    /*if (!arr.includes(cr.commit)) {
      arr.push(cr.commit);
    } else {
      const others = codeReviewsWithCommits.filter((dup) => dup.commit == cr.commit);
      console.log(
        "We found a duplicate codeReviewsWithCommits",
        cr.commit,
        "num others",
        others.length,
        "ids",
        others.map((o) => o.virtual_id_number).join(",")
      );
    }*/
  });
}

// unique the commits
for (const key of allRepoCommits.keys()) {
  const arr = allRepoCommits.get(key);
  const newArr = [...new Set(arr)];
  allRepoCommits.set(key, newArr);
}

// hack to get counts
const counts: Record<string, number> = {};
for (const [k, v] of Object.entries(Object.fromEntries(allRepoCommits))) {
  counts[k] = v.length;
}

const results: any = {
  reposCommitCounts: counts,
  reposCommits: Object.fromEntries(allRepoCommits),
  commits: [...new Set(allCommits)].sort(),
};

writeFileSync(join(__dirname, "repo_summary.json"), JSON.stringify(results, null, "  "));
