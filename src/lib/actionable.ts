import chalk from "chalk";
import type { GeneratedIR } from "../wikimedia-scraping/run-extract-irs.js";
import { Task } from "./task.js";
import { IR } from "./ir.js";
import { CodeReview } from "./code-review.js";
import { Relation } from "./relation.js";
import { DepthTracker } from "./depth-tracker.js";
import { NetworkNode, NetworkEdge } from "./network-types.js";

type GeneratedActionable = GeneratedIR["items"][0];

export class Actionable {
  public static all: Actionable[] = [];

  id: string;
  text: string;
  tasks: Task[];
  codeReviews: CodeReview[];
  irs: IR[];

  contextLinksToTaskRelations: Relation<Task>[];
  contextLinksToCodeReviewRelations: Relation<CodeReview>[];

  relationChain: DepthTracker[];

  constructor(public readonly dto: GeneratedActionable, ir: IR) {
    this.id = ir.id + "#" + dto.gen_hash;
    this.text = dto.gen_context_text;
    this.tasks = [];
    this.codeReviews = [];
    this.irs = [];

    this.contextLinksToTaskRelations = [];
    this.contextLinksToCodeReviewRelations = [];

    this.relationChain = [];

    Actionable.all.push(this);
  }

  getGoogleAIForTaskId(id: string): string {
    return (
      this.dto.gen_context_links.find((x) => x.gen_link == `https://phabricator.wikimedia.org/${id}`)
        ?.google_ai! || ""
    );
  }

  async loadRelations(depthTracker: DepthTracker) {
    this.relationChain.push(depthTracker);
    //console.log(chalk.blue(`loadRelations(${depthTracker.depth}) for Actionable [${this.dto.gen_hash}]`));

    for (const x of this.dto.gen_context_links) {
      if (x.gen_link.includes("phabricator.wikimedia.org")) {
        //console.log(chalk.green(`Trying to link Actionable [${this.dto.gen_hash}] to Task [${x.gen_link}]`));
        const task = await Task.loadByLink(x.gen_link, depthTracker.stampOnly(this.id));
        if (task) {
          this.contextLinksToTaskRelations.push(new Relation(task, x));
        } else {
          console.log(
            chalk.yellow(`Could not load Actionable [${this.dto.gen_hash}]'s link to a Task [${x.gen_link}]`)
          );
        }
      } else if (x.gen_link.includes("gerrit.wikimedia.org")) {
        /*console.log(
          chalk.green(`Trying to link Actionable [${this.dto.gen_hash}] to Code Review [${x.gen_link}]`)
        );*/
        const cr = await CodeReview.loadByLink(x.gen_link, depthTracker.stampOnly(this.id));
        if (cr) {
          this.contextLinksToCodeReviewRelations.push(new Relation(cr, x));
        } else {
          console.log(
            chalk.yellow(
              `Could not load Actionable [${this.dto.gen_hash}]'s link to a Code Review [${x.gen_link}]`
            )
          );
        }
      }
    }
  }

  /**
   * Get the network node representation of this ActionItem.
   */
  getNode(): NetworkNode {
    return {
      id: this.id,
      type: "ActionItem",
      label: this.text.substring(0, 50) + "...",
    };
  }

  /**
   * Get all network edges originating from this ActionItem.
   * Returns both downward edges (to Tasks and Code Reviews) and upward edges (to parent IR).
   */
  getEdges(): NetworkEdge[] {
    const edges: NetworkEdge[] = [];

    // Downward: ActionItem -> Tasks
    for (const taskRelation of this.contextLinksToTaskRelations) {
      edges.push({
        source: this.id,
        target: taskRelation.actual.id,
        type: "references_task",
        direction: "downward",
      });
    }

    // Downward: ActionItem -> Code Reviews
    for (const crRelation of this.contextLinksToCodeReviewRelations) {
      edges.push({
        source: this.id,
        target: `CR-${crRelation.actual.virtual_id_number}`,
        type: "references_code_review",
        direction: "downward",
      });
    }

    // No Upwards AIs. Its in the IR doc already.

    return edges;
  }

  static stitchAll() {
    Actionable.all.forEach((actionable) => {
      // Connect actionables to Tasks [downstream connection]
      actionable.dto.gen_context_links
        .filter((x) => x.gen_link.includes("phabricator.wikimedia.org"))
        .forEach((x) => {
          const existingTask = Task.getByLink(x.gen_link);
          if (existingTask) {
            actionable.tasks.push(existingTask);
          } else {
            console.log(chalk.yellow(`Could not stitch Actionable [${actionable.dto.gen_hash}] to a Task`));
          }
        });

      // Connect actionables to Code Reviews [downstream connection]
      actionable.dto.gen_context_links
        .filter((x) => x.gen_link.includes("gerrit.wikimedia.org"))
        .forEach((x) => {
          const existingCodeReview = CodeReview.getByLink(x.gen_link); //all.find((cr) => cr.virtual_id_number == resourceId);
          if (existingCodeReview) {
            actionable.codeReviews.push(existingCodeReview);
          } else {
            console.log(
              chalk.yellow(`Could not stitch Actionable [${actionable.dto.gen_hash}] to a Code Review`)
            );
          }
        });

      // Connect actionables to IRs [upstream connection]
      IR.all.forEach((ir) => {
        if (ir.actionables.includes(actionable)) {
          actionable.irs.push(ir);
        }
      });
    });
  }
}
