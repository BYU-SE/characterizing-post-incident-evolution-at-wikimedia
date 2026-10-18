import { readdirSync, readFileSync } from "fs";
import { parse } from "yaml";
import { join } from "path";
import { CodeReview } from "./code-review.js";
import chalk from "chalk";
import { Actionable } from "./actionable.js";
import {
  extractPhabricatorByLink,
  fetchPhabricator,
  GeneratedTask,
  phabricatorExtractedDir,
} from "../wikimedia-scraping/phabricator.js";
import { Relation } from "./relation.js";
import { uniq } from "underscore";
import { DepthTracker } from "./depth-tracker.js";
import { NetworkNode, NetworkEdge } from "./network-types.js";

export type FlatTaskEntry = {
  id: string;
  numActivity: number;
  numHumanComments: number;
  numCommenters: number;
  numSubscribers: number;
  numPriorityChanges: number;
  numTimesReopened: number;
  priority: string;
  priorityNumericalValue: number;
  initialPriority: string;
  initialPriorityNumericalValue: number;
  isOpen: boolean;
  isClosed: boolean;
  isResolved: boolean;
  isDeclined: boolean;
  isDuplicate: boolean;
  isInvalid: boolean;
  statuses: string;
  timeOpen: string | number;
  numMergeRequests: number;
  numChildTasks: number;
  numParentTasks: number;
  dateCreated: number;
};

export class Task {
  public static all: Task[] = [];
  public static map: Record<string, Task> = {};

  id: string;
  title: string;
  taskURL: string;
  codeReviews: CodeReview[];
  actionables: Actionable[];
  tasks: Task[];

  detailsMRRelations: Relation<CodeReview>[];
  relatedTaskRelations: Relation<Task>[];
  mentionedTaskRelations: Relation<Task>[];

  relationChain: DepthTracker[];

  constructor(public readonly dto: GeneratedTask) {
    this.id = dto.gen_id;
    this.title = dto.gen_title;
    this.taskURL = dto.gen_taskURL;

    // to be filled in stitch
    this.codeReviews = [];
    this.actionables = [];
    this.tasks = [];

    this.detailsMRRelations = [];
    this.relatedTaskRelations = [];
    this.mentionedTaskRelations = [];

    this.relationChain = [];

    Task.all.push(this);
    Task.map[this.id] = this;
  }

  public static LOAD_MENTIONED_AND_CHILD: boolean = false;
  async loadRelations(depthTracker: DepthTracker) {
    //(${depthTracker.depth}) for Task [${this.dto.gen_id}]`));

    for (const x of this.dto.gen_details_mrs) {
      if (x.gen_link.includes("gerrit.wikimedia.org")) {
        //console.log(chalk.green(`Trying to link Task [${this.dto.gen_id}] to Code Review [${x.gen_link}]`));
        const cr = await CodeReview.loadByLink(
          x.gen_link,
          depthTracker.stampAndDecrementDepth(this.id + " > [details_mrs]"),
        );
        if (cr) {
          this.detailsMRRelations.push(new Relation(cr, x));
        } else {
          /*console.log(
            chalk.yellow(`Could not load Task [${this.dto.gen_id}]'s link [${x.gen_link}] to a Code Review.`)
          );*/
        }
      }
      // TODO: handle gitlab
    }

    if (!Task.LOAD_MENTIONED_AND_CHILD) {
      return;
    }

    // Connect tasks to other tasks [downstream connection]
    for (const x of this.dto.gen_related_tasks) {
      if (x.gen_relation.includes("subtask")) {
        // only auto get subtrasks
        //console.log(chalk.green(`Trying to link Task [${this.dto.gen_id}] to Task [${x.gen_link}]`));
        let task = await Task.loadByLink(
          x.gen_link,
          depthTracker.stampAndDecrementDepth(this.id + " > [subtask]"),
        );
        if (task) {
          this.relatedTaskRelations.push(new Relation(task, x));
        } else {
          /*console.log(
            chalk.yellow(
              `Could not load Task [${this.dto.gen_id}]'s link [${x.gen_link}] to a Task. Depth Left: ${depthTracker.depth}`
            )
          );*/
        }
      }
    }

    for (const x of this.dto.gen_mentioned_tasks) {
      //console.log(chalk.green(`Trying to link Task [${this.dto.gen_id}] to Task [${x.gen_link}]`));
      let task = await Task.loadByLink(
        x.gen_link,
        depthTracker.stampAndDecrementDepth(this.id + " > [mentioned task]"),
      );
      if (task) {
        this.mentionedTaskRelations.push(new Relation(task, x));
      } else {
        /*console.log(
          chalk.yellow(
            `Could not load Task [${this.dto.gen_id}]'s link [${x.gen_link}] to a Task.  Depth Left: ${depthTracker.depth}`
          )
        );*/
      }
    }
  }

  getFlat(): FlatTaskEntry {
    return {
      id: this.id,
      numActivity: this.dto.gen_timeline_items.length,
      numHumanComments: this.getNumHumanCommments(),
      numCommenters: this.getNumCommenters(),
      numSubscribers: this.getNumSubscribers(),
      numPriorityChanges: this.getNumPriorityChanges(),
      priority: this.dto.gen_priority,
      priorityNumericalValue: this.getPriorityNumericalValue(),
      initialPriority: this.getInitialPriority(),
      initialPriorityNumericalValue: this.getInitialPriorityNumericalValue(),
      isOpen: this.dto.gen_status.includes("Open"),
      isClosed: this.dto.gen_status.includes("Closed"),
      isResolved: this.dto.gen_status.includes("Resolved"),
      isDeclined: this.dto.gen_status.includes("Declined"),
      isDuplicate: this.dto.gen_status.includes("Duplicate"),
      isInvalid: this.dto.gen_status.includes("Invalid"),
      statuses: this.dto.gen_status
        .split(",")
        .map((x) => x.trim())
        .join(","),
      timeOpen: this.getTimeOpen(),
      numTimesReopened: this.getNumTimesReopened(),
      numMergeRequests: this.dto.gen_details_mrs.length,
      numChildTasks: this.dto.gen_related_tasks.filter((x) => x.gen_relation.includes("subtask")).length,
      numParentTasks: this.dto.gen_related_tasks.filter((x) => x.gen_relation.includes("parent")).length,
      dateCreated: +new Date(this.dto.gen_createdDate),
    };
  }

  private cachedPriorities: string[] | undefined = undefined;
  getAllPrioritiesMemoized() {
    if (this.cachedPriorities) return this.cachedPriorities;
    const results = this.getAllPriorities();
    this.cachedPriorities = results;
    return results;
  }

  getAllPriorities(): string[] {
    const headlines = this.dto.gen_timeline_items.flatMap((x) => x.gen_headlines);
    const knownPriorityHeadlines = headlines.filter(
      (x) => x.includes("the priority of this task") || x.includes("triaged this task as"),
    );

    // if no headline, we default to gen_priority
    if (knownPriorityHeadlines.length == 0) return [this.dto.gen_priority];

    const priorities = [];

    // First is special case: it could include a message like "raised the priority of this task from  to Medium", where the initial priority is unset.
    const [first, ...remaining] = knownPriorityHeadlines;
    if (first.includes("the priority of this task")) {
      const ending = first.split("the priority of this task from ")[1].slice(0, -".".length); // trim the ending period
      const parts = ending.split(" to ").map((x) => x.trim());
      // in the format of <person> raised/lowered the priority of this task from <p1> to <p2>
      // p1 is known to be an empty string sometimes, but we will conditionally add both in case p2 can also be empty
      if (parts[0].length > 0) priorities.push(parts[0]);
      if (parts[1].length > 0) priorities.push(parts[1]);
    } else {
      // in the format of <person> triaged this task as <p1> priority.
      const ending = first.split("triaged this task as ")[1].slice(0, -"priority.".length);
      const prio = ending.trim();
      if (prio.length > 0) priorities.push(prio);
    }

    remaining.forEach((r) => {
      if (r.includes("the priority of this task")) {
        const ending = r.split("the priority of this task from ")[1].slice(0, -".".length); // trim the ending period
        const parts = ending.split(" to ").map((x) => x.trim());
        // in the format of <person> raised/lowered the priority of this task from <p1> to <p2>
        // only take <p2> because we typically know p1 as this isn't the first headline
        if (parts[1].length > 0) priorities.push(parts[1]);
      } else {
        // in the format of <person> triaged this task as <p1> priority.
        const ending = r.split("triaged this task as ")[1].slice(0, -"priority.".length);
        const prio = ending.trim();
        if (prio.length > 0) priorities.push(prio);
      }
    });

    if (priorities.length > 0) {
      return priorities;
    } else {
      // also fallback to gen_priority
      return [this.dto.gen_priority];
    }
  }

  getInitialPriority(): string {
    return this.getAllPrioritiesMemoized()[0];
  }

  getInitialPriorityNumericalValue(): number {
    const initial = this.getInitialPriority();
    return this.priorityToNumericalValue(initial);
  }

  getPriorityNumericalValue(): number {
    return this.priorityToNumericalValue(this.dto.gen_priority);
  }

  private priorityToNumericalValue(priority: string) {
    switch (priority) {
      case "Unbreak Now!":
        return 5;
      case "High":
        return 4;
      case "Medium":
        return 3;
      case "Low":
        return 2;
      case "Lowest":
        return 1;
      case "Needs Triage":
      default:
        return 0;
    }
  }

  getNumPriorityChanges(): number {
    return this.getAllPrioritiesMemoized().length - 1;
  }

  getNumHumanCommments() {
    return this.dto.gen_timeline_items.filter((x) => {
      const hasBody = (x.gen_body || "")?.length > 0;
      const isAllowedUsername = x.gen_headlines.some(
        (h) => !h.includes("Stashbot ") && !h.includes("gerritbot") && !h.includes("bzimport"),
      );
      return isAllowedUsername && hasBody;
    }).length;
  }

  getNumCommenters(): number {
    const headlines = this.dto.gen_timeline_items
      .flatMap((x) => x.gen_headlines)
      .filter((x) => x.includes("added a comment"));
    const ignoreCommentors = ["Stashbot", "gerritbot", "bzimport"]; // decision to ignore bzimport
    const commentors = headlines
      .map((x) => {
        if (x.startsWith("• ")) {
          return x.slice(2, x.indexOf(" ", 2));
        }
        return x.slice(0, x.indexOf(" ", 2));
      })
      .filter((x) => !ignoreCommentors.includes(x));
    return uniq(commentors).length;
  }

  getNumSubscribers(): number {
    const headlines = this.dto.gen_timeline_items.flatMap((x) => x.gen_headlines);
    return headlines.filter((x) => x.endsWith("subscribed.") || x.includes("added a subscriber:")).length;
  }

  getNumTimesReopened(): number {
    const headlines = this.dto.gen_timeline_items.flatMap((x) => x.gen_headlines);
    return headlines.filter((x) => x.includes("reopened this task as.")).length;
  }

  /*getPriorityAtClose(): string {
    if (this.dto.gen_timeline_items.length == 0) return this.dto.gen_status;

    const priorityChangeHeadlineIndicator = "the priority of this task from";
    const priorityChangeRegex = /the priority of this task from .*to (.*)\./;
    const triageHeadlineIndicator = "triaged this task as ";
    const triageRegex = /triaged this task as (.*) priority/;

    const priorities = this.dto.gen_timeline_items
      .flatMap((x) => x.gen_headlines)
      .filter((h) => {
        return h.includes(priorityChangeHeadlineIndicator) || h.includes(triageHeadlineIndicator);
      })
      .map((h) => {
        const match = h.match(priorityChangeRegex) || h.match(triageRegex);
        if (!match) {
          console.error("NOT SURE WHAT THIS HIT");
          return "other";
        }
        return match[1];
      });
    if (priorities.length == 0) {
      // we should default to gen_priority. It likely is the same thing.
      if (this.dto.gen_status.endsWith("Needs Triage")) {
        console.log(
          `Defaulting to Needs Triage for Task ${this.id}: gen_priority was ${this.dto.gen_priority}`
        );
        return "Needs Triage";
      }
      console.log(`Defaulting to Other for Task ${this.id}: gen_priority was ${this.dto.gen_priority}`);
      return "other";
    } else {
      const p = priorities.pop()!;
      if (p != this.dto.gen_priority)
        console.log(
          `Found differing statuses for Task ${this.id}: ${p} from timeline and ${this.dto.gen_priority} from gen_priority`
        );

      return p;
    }

    return priorities.pop()!;
  }*/

  getTimeOpen(): number | string {
    let time = 0;
    let timeIndex = +new Date(this.dto.gen_createdDate);
    this.dto.gen_timeline_items.forEach((x) => {
      if (x.gen_headlines.some((h) => h.includes("closed this task as")))
        time += +new Date(x.gen_date) - timeIndex;
      else if (x.gen_headlines.some((h) => h.includes("reopened this task as")))
        timeIndex = +new Date(x.gen_date);
    });

    return time || "";
  }

  getDateClosed(): number | string {
    if (this.dto.gen_status.includes("Closed")) {
      const relevantTimelineItem = this.dto.gen_timeline_items.find((x) =>
        x.gen_headlines.some((h) => h.includes(" closed this task as ")),
      );
      if (relevantTimelineItem) {
        return +new Date(relevantTimelineItem.gen_date);
      }
    }
    return "";
  }

  /**
   * Extract all outward links from the task description and timeline items.
   * Returns links to IRs, Tasks, and Code Reviews found anywhere in the task content.
   */
  getOutwardLinks(): { type: "IR" | "Task" | "CodeReview"; url: string }[] {
    const links: { type: "IR" | "Task" | "CodeReview"; url: string }[] = [];
    const seen = new Set<string>();

    // Helper to extract and categorize links from text
    const extractLinksFromText = (text: string) => {
      // Match all http:// and https:// URLs
      const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
      const urls = text.match(urlPattern) || [];

      for (const url of urls) {
        if (seen.has(url)) continue;
        seen.add(url);

        // Check if it's an IR link
        if (url.includes("wikitech.wikimedia.org/wiki/Incidents/")) {
          links.push({ type: "IR", url });
        }
        // Check if it's a Phabricator task link
        else if (url.includes("phabricator.wikimedia.org/T")) {
          links.push({ type: "Task", url });
        }
        // Check if it's a Gerrit code review link
        else if (url.includes("gerrit.wikimedia.org/r/")) {
          links.push({ type: "CodeReview", url });
        }
      }
    };

    // Extract from title
    extractLinksFromText(this.title);

    // Extract from timeline items (headlines and bodies)
    for (const item of this.dto.gen_timeline_items) {
      for (const headline of item.gen_headlines) {
        extractLinksFromText(headline);
      }
      if (item.gen_body) {
        extractLinksFromText(item.gen_body);
      }
    }

    return links;
  }

  /**
   * Get the network node representation of this Task.
   */
  getNode(): NetworkNode {
    return {
      id: this.id,
      type: "Task",
      label: this.id,
    };
  }

  /**
   * Get all network edges originating from this Task.
   * Returns downward edges (to Code Reviews and Child Tasks) and upward edges (mentions to other artifacts).
   */
  getEdges(): NetworkEdge[] {
    const edges: NetworkEdge[] = [];

    // Downward: Task -> Code Reviews
    for (const crRelation of this.detailsMRRelations) {
      edges.push({
        source: this.id,
        target: `CR-${crRelation.actual.virtual_id_number}`,
        type: "has_code_review",
        direction: "downward",
      });
    }

    // Downward: Task -> Child Tasks
    for (const childTaskRelation of this.relatedTaskRelations) {
      edges.push({
        source: this.id,
        target: childTaskRelation.actual.id,
        type: "has_subtask",
        direction: "downward",
      });
    }

    // Upward: Task mentions other artifacts (from text content)
    const outwardLinks = this.getOutwardLinks();
    for (const link of outwardLinks) {
      if (link.type === "IR") {
        const irIdMatch = link.url.match(/\/wiki\/Incidents\/(.+?)(?:[#?]|$)/);
        if (irIdMatch) {
          edges.push({
            source: this.id,
            target: irIdMatch[1],
            type: "mentions_ir",
            direction: "upward",
          });
        }
      } else if (link.type === "Task") {
        const taskIdMatch = link.url.match(/phabricator\.wikimedia\.org\/(T\d+)/);
        if (taskIdMatch) {
          edges.push({
            source: this.id,
            target: taskIdMatch[1],
            type: "mentions_task",
            direction: "other",
          });
        }
      } else if (link.type === "CodeReview") {
        const crIdMatch = link.url.match(/gerrit\.wikimedia\.org\/r\/(?:c\/)?(\d+)/);
        if (crIdMatch) {
          edges.push({
            source: this.id,
            target: `CR-${crIdMatch[1]}`,
            type: "mentions_code_review",
            direction: "other",
          });
        }
      }
    }

    return edges;
  }

  static loadAll() {
    const irs = readdirSync(phabricatorExtractedDir).filter((f) => f.endsWith(".yaml"));
    irs.forEach((irFile) => {
      const data = readFileSync(join(phabricatorExtractedDir, irFile), "utf-8");
      const parsedData = parse(data) as GeneratedTask;
      new Task(parsedData);
    });
  }

  static async loadById(id: string, depthTracker: DepthTracker): Promise<Task | undefined> {
    // Do not load non-tasks
    if (!id.startsWith("T")) return undefined;

    const existing = Task.getById(id);
    if (existing) {
      existing.relationChain.push(depthTracker);
      return existing;
    }

    try {
      const data = readFileSync(join(phabricatorExtractedDir, `${id}.yaml`), "utf-8");
      const parsedData = parse(data) as GeneratedTask;
      let t = new Task(parsedData);
      t.relationChain.push(depthTracker);

      if (depthTracker.depthLeft > 1) {
        // only load its relationships if there is still depth to travel
        await t.loadRelations(depthTracker);
      }
      return t;
    } catch (e: any) {
      /*if (decrementedDepth <= 0) {
        // only scrape if there is still depth to travel
        return undefined;
      }*/

      // This file does not exist
      console.log(chalk.red(`${depthTracker.stamps.join(" -> ")} Need to scrape Task [${id}]`));

      // we will try one more time
      await fetchPhabricator("https://phabricator.wikimedia.org/" + id);
      await extractPhabricatorByLink("https://phabricator.wikimedia.org/" + id);
      try {
        const data = readFileSync(join(phabricatorExtractedDir, `${id}.yaml`), "utf-8");
        const parsedData = parse(data) as GeneratedTask;
        let t = new Task(parsedData);
        t.relationChain.push(depthTracker);
        console.log(chalk.green(`Successfully scraped Task [${id}]`));
        if (depthTracker.depthLeft > 1) {
          await t.loadRelations(depthTracker);
        }
        return t;
      } catch (e: any) {
        console.log(chalk.red(`Failed to scrape Task [${id}] ${e}`));
        return undefined;
      }
    }
  }

  static async loadByLink(link: string, depthTracker: DepthTracker): Promise<Task | undefined> {
    let id = link.slice("https://phabricator.wikimedia.org/".length);
    if (id.includes("#")) id = id.split("#")[0]; // account for a random hash in the URL
    return Task.loadById(id, depthTracker);
  }

  static getById(id: string): Task | undefined {
    // Do not load non-tasks
    if (!id.startsWith("T")) return undefined;
    //return Task.all.find((t) => t.id == id);
    return Task.map[id];
  }

  static getByLink(link: string): Task | undefined {
    let id = link.slice("https://phabricator.wikimedia.org/".length);
    if (id.includes("#")) id = id.split("#")[0]; // account for a random hash in the URL
    return Task.getById(id);
  }

  static stitchAll() {
    Task.all.forEach((task) => {
      // Connect tasks to Code Reviews [downstream connection]
      task.dto.gen_details_mrs
        .filter((x) => x.gen_link.includes("gerrit.wikimedia.org"))
        .forEach((x) => {
          const existingCodeReview = CodeReview.getByLink(x.gen_link);
          if (existingCodeReview) {
            task.codeReviews.push(existingCodeReview);
            //task.detailsMRRelations.push(new Relation(existingCodeReview, x));
          } else {
            console.log(
              chalk.yellow(
                `Could not stitch Task [${task.dto.gen_id}]'s link [${x.gen_link}] to a Code Review. No Code Review found`,
              ),
            );
          }
        });

      // Connect tasks to other tasks [downstream connection]
      task.dto.gen_related_tasks
        .filter((otherTask) => otherTask.gen_relation != "self")
        .forEach((otherTaskRelation) => {
          let otherActualTask = Task.getByLink(otherTaskRelation.gen_link);
          if (otherActualTask) {
            task.tasks.push(otherActualTask);
            //task.relatedTaskRelations.push(new Relation(otherActualTask, otherTaskRelation));
          } else {
            console.log(
              chalk.yellow(
                `Could not stitch Task [${task.dto.gen_id}]'s link [${otherTaskRelation.gen_link}] to a Task. No other task found`,
              ),
            );
          }
        });
      task.dto.gen_mentioned_tasks.forEach((otherTaskRelationDTO) => {
        let otherActualTask = Task.getByLink(otherTaskRelationDTO.gen_link);
        if (otherActualTask) {
          task.tasks.push(otherActualTask);
          //task.mentionedTaskRelations.push(new Relation(otherActualTask, otherTaskRelationDTO));
        } else {
          console.log(
            chalk.yellow(
              `Could not stitch Task [${task.dto.gen_id}]'s link [${otherTaskRelationDTO.gen_link}] to a Task. No other task found`,
            ),
          );
        }
      });

      // Connect tasks to Actionables [upstream connection]
      Actionable.all.forEach((actionable) => {
        if (actionable.tasks.includes(task)) {
          task.actionables.push(actionable);
        }
      });
    });
  }
}
