import { countBy } from "underscore";
import { Lookup } from "../lib/lookup.js";
import { Commit } from "../lib/commit.js";
import { CodeReview } from "../lib/code-review.js";

const lookup = Lookup.loadAll();
//const lookup = Lookup.loadSome([Commit, CodeReview]);

const irs = lookup.irs;
console.log("# IRs:", irs.length);

const irsWithActionables = irs.filter((ir) => ir.actionables.length > 0);
console.log("# IRs with Actionables:", irsWithActionables.length);

const actionables = irs.flatMap((ir) => ir.actionables);
console.log("# Actionables:", actionables.length);

const actionablesWithTasks = actionables.filter((a) => a.tasks.length > 0);
console.log("# Actionables With Tasks:", actionablesWithTasks.length);

const actionablesWithCodeReviews = actionables.filter((a) => a.codeReviews.length > 0);
console.log("# Actionables With Code Reviews:", actionablesWithCodeReviews.length);

const tasks = lookup.tasks;
console.log("# Tasks:", tasks.length);

const tasksWithCodeReviews = tasks.filter((t) => t.codeReviews.length > 0);
console.log("# Tasks with Code Reviews:", tasksWithCodeReviews.length);

const codeReviews = lookup.codeReviews;
console.log("# Code Reviews:", codeReviews.length);

let codeReviewsGroups = countBy(codeReviews, (cr) => cr.dto.status);
console.log("# Code Reviews Status Groups", codeReviewsGroups);

const codeReviewsForPuppet = codeReviews.filter((cr) => cr.dto.project == "operations/puppet");
console.log("# Code Reviews (project=operations/puppet)", codeReviewsForPuppet.length);

let codeReviewsForPuppetGroups = countBy(codeReviewsForPuppet, (cr) => cr.dto.status);
console.log("# Code Reviews (project=operations/puppet) Status Groups", codeReviewsForPuppetGroups);

const commits = lookup.commits;
console.log("# Commits (repo=operations/puppet):", commits.length);

const commitsFromIncidents = codeReviewsForPuppet
  .flatMap((cr) => cr.commits) // consider any commit from a code review on the operations/puppet repo
  .filter((incidentCommit) => commits.find((c) => incidentCommit.dto.hash == c.dto.hash));
console.log("# Commits (repo=operations/puppet) from an Incident:", commitsFromIncidents.length);
