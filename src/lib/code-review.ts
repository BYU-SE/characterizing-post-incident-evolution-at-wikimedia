import { readdirSync, readFileSync } from "fs";
import { parse } from "yaml";
import { join } from "path";
import { fetchGerrit, gerritScrapedDir } from "../wikimedia-scraping/gerrit.js";
import { GerritCodeReview } from "../wikimedia-scraping/gerrit-types.js";
import { Task } from "./task.js";
import { Commit } from "./commit.js";
import { Relation } from "./relation.js";
import chalk from "chalk";
import { countBy } from "underscore";
import { DepthTracker } from "./depth-tracker.js";
import { NetworkNode, NetworkEdge } from "./network-types.js";

export type FlatCREntry = {
  id: string;
  numPatchsets: number;
  numActivity: number; // number of all activity in the code review (upload patchset, jenkins-build reports, comments outside of line of code, but excludes "Added to reviewer")
  numMessagesFromJenkinsBot: number; // messages > jenkins build reports
  numHumanComments: number; // comments and comments outside of lines of code, reviews
  numInlineComments: number; // number of comments in the code review (someone selected a line(s) and left a comment on it)
  numReviewers: number;
  status: string;
  created: string;
  timeOpen: string | number;
  repo: string;
};

export class CodeReview {
  public static all: CodeReview[] = [];
  public static map: Record<string, CodeReview> = {};

  virtual_id_number: number;
  commit: string;
  numRevisions: number;

  tasks: Task[];
  commits: Commit[];

  bugIdRelations: Relation<Task>[];

  relationChain: DepthTracker[];

  constructor(public readonly dto: GerritCodeReview) {
    this.virtual_id_number = dto.virtual_id_number;
    this.commit = dto.current_revision;
    this.numRevisions = dto.current_revision_number;

    // to be filled in stitch
    this.tasks = [];
    this.commits = [];

    this.bugIdRelations = [];

    this.relationChain = [];

    CodeReview.all.push(this);
    CodeReview.map["" + this.virtual_id_number] = this;
  }

  async loadRelations(depthTracker: DepthTracker) {
    /*console.log(
      chalk.blue(`loadRelations(${depthTracker.depth}) for CodeReview [${this.dto.virtual_id_number}]`)
    );*/
    // TODO: Load only a few commits
  }

  getFlat(): FlatCREntry {
    return {
      id: "" + this.virtual_id_number,
      numPatchsets: this.dto.current_revision_number,
      numActivity: this.dto.messages.length,
      numMessagesFromJenkinsBot: this.getNumMessagesFromJenkinsBot(),
      numHumanComments: this.getNumMessagesFromDetachedComments(),
      numInlineComments: this.dto.total_comment_count,
      numReviewers: this.dto.reviewers.REVIEWER?.length || 0,
      status: this.dto.status,
      created: this.dto.created,

      // computed
      timeOpen: this.getTimeOpen(),
      repo: this.dto.project,
    };
  }

  getNumMessagesFromDetachedComments(): number {
    return this.dto.messages.filter(
      (m) =>
        m.author &&
        m.author._account_id != 75 && // jenkins
        !m.message.startsWith("Uploaded patch set") && // patch set created
        !m.message.endsWith(" was rebased"), // rebase messages
    ).length;
  }

  getNumMessagesFromJenkinsBot(): number {
    return this.dto.messages.filter((m) => m.author && m.author._account_id == 75).length;
  }

  getDateClosed(): number | string {
    try {
      if (this.dto.status == "MERGED") {
        const mergedDate = new Date(
          // it may say "...successfully merged or rebased or ..."
          this.dto.messages.find((x) => x.message.startsWith("Change has been successfully "))!.date,
        );
        return +new Date(mergedDate);
      } else if (this.dto.status == "ABANDONED") {
        const abandonedDate = new Date(
          this.dto.messages.find((x) => x.message.startsWith("Abandoned"))!.date,
        );
        return +new Date(abandonedDate);
      }
    } catch (e) {
      console.log("Error: " + e + ". For ", this.virtual_id_number);
    }
    return "";
  }

  /**
   * Returns the time duration from creation to merge or abandonment. Returns empty string if no time (to be compatible with CSV exports)
   */
  getTimeOpen(): number | string {
    try {
      if (this.dto.status == "MERGED") {
        const mergedDate = new Date(
          // it may say "...successfully merged or rebased or ..."
          this.dto.messages.find((x) => x.message.startsWith("Change has been successfully "))!.date,
        );
        return +new Date(mergedDate) - +new Date(this.dto.created);
      } else if (this.dto.status == "ABANDONED") {
        const abandonedDate = new Date(
          this.dto.messages.find((x) => x.message.startsWith("Abandoned"))!.date,
        );
        return +new Date(abandonedDate) - +new Date(this.dto.created);
      }
    } catch (e) {
      console.log("Error: " + e + ". For ", this.virtual_id_number);
    }
    return "";
  }

  /**
   * Gets all the votes for verification (-1 to 2)
   * @returns
   */
  getVerifiedLabelVotes(): Record<number, number> {
    return countBy(this.dto.labels["Verified"].all, "value");
  }
  /**
   * Gets all the votes for code reviews (-2 to 2)
   * @returns
   */
  getCodeReviewLabelVotes(): Record<number, number> {
    return countBy(this.dto.labels["Code-Review"].all, "value");
  }

  /**
   * Fetch all task IDs which are tagged as Bug: <task id> in the current revision.
   * @returns
   */
  getBugIdsInMessage(): string[] {
    const taskIdPattern = /Bug: (T\d{1,7})/g;
    const currentRevisionMessage = this.dto.revisions[this.dto.current_revision].commit.message;
    return [...currentRevisionMessage.matchAll(taskIdPattern)].map((x) => x[1]);
  }

  /**
   * Fetch all task IDs in the message, which may include more tasks than just the Bug Id (if there is one) in the current revision.
   * @returns
   */
  getTaskIdsInMessage(): string[] {
    const taskIdPattern = /T\d{1,7}/g;
    const currentRevisionMessage = this.dto.revisions[this.dto.current_revision].commit.message;
    return currentRevisionMessage.match(taskIdPattern) || [];
  }

  getDoesRevertPreviousCommit(): boolean {
    const currentRevisionMessage = this.dto.revisions[this.dto.current_revision].commit.message;
    return currentRevisionMessage.includes("This reverts commit");
  }

  /**
   * Extract all outward links from the code review.
   * Checks: subject, commit message of current revision, and all comment messages.
   * Also extracts Bug: T#### references from commit messages.
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

      // Also extract Bug: T#### references
      const bugPattern = /Bug:\s*(T\d{1,7})/gi;
      const bugMatches = text.matchAll(bugPattern);
      for (const match of bugMatches) {
        const taskId = match[1];
        const taskUrl = `https://phabricator.wikimedia.org/${taskId}`;
        if (!seen.has(taskUrl)) {
          seen.add(taskUrl);
          links.push({ type: "Task", url: taskUrl });
        }
      }
    };

    // Extract from subject
    extractLinksFromText(this.dto.subject);

    // Extract from current revision commit message
    const currentRevisionMessage = this.dto.revisions[this.dto.current_revision].commit.message;
    extractLinksFromText(currentRevisionMessage);

    // Extract from all messages (comments)
    for (const message of this.dto.messages) {
      if (message.message) {
        extractLinksFromText(message.message);
      }
    }

    return links;
  }

  /**
   * Get the network node representation of this CodeReview.
   */
  getNode(): NetworkNode {
    return {
      id: `CR-${this.virtual_id_number}`,
      type: "CodeReview",
      label: `CR-${this.virtual_id_number}`,
    };
  }

  /**
   * Get all network edges originating from this CodeReview.
   * Returns upward edges (mentions to other artifacts from text content).
   */
  getEdges(): NetworkEdge[] {
    const edges: NetworkEdge[] = [];

    // Upward: CodeReview mentions other artifacts (from text content)
    const outwardLinks = this.getOutwardLinks();
    for (const link of outwardLinks) {
      if (link.type === "IR") {
        const irIdMatch = link.url.match(/\/wiki\/Incidents\/(.+?)(?:[#?]|$)/);
        if (irIdMatch) {
          edges.push({
            source: `CR-${this.virtual_id_number}`,
            target: irIdMatch[1],
            type: "mentions_ir",
            direction: "upward",
          });
        }
      } else if (link.type === "Task") {
        const taskIdMatch = link.url.match(/phabricator\.wikimedia\.org\/(T\d+)/);
        if (taskIdMatch) {
          edges.push({
            source: `CR-${this.virtual_id_number}`,
            target: taskIdMatch[1],
            type: "mentions_task",
            direction: "upward",
          });
        }
      } else if (link.type === "CodeReview") {
        const crIdMatch = link.url.match(/gerrit\.wikimedia\.org\/r\/(?:c\/)?(\d+)/);
        if (crIdMatch) {
          edges.push({
            source: `CR-${this.virtual_id_number}`,
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
    const gerritCodeReviews = readdirSync(gerritScrapedDir).filter((f) => f.endsWith(".json"));
    gerritCodeReviews.forEach((codeReviewFile) => {
      const data = readFileSync(join(gerritScrapedDir, codeReviewFile), "utf-8");
      const parsedData = parse(data) as GerritCodeReview;
      new CodeReview(parsedData);
    });
  }

  static async loadById(id: string, depthTracker: DepthTracker): Promise<CodeReview | undefined> {
    const existing = CodeReview.getById(id);
    if (existing) {
      existing.relationChain.push(depthTracker);
      return existing;
    }

    try {
      const data = readFileSync(join(gerritScrapedDir, `${id}.json`), "utf-8");
      const parsedData = parse(data) as GerritCodeReview;
      const cr = new CodeReview(parsedData);
      cr.relationChain.push(depthTracker);
      await cr.loadRelations(depthTracker);
      return cr;
    } catch (e: any) {
      // This file does not exist
      console.log(chalk.red(`${depthTracker.stamps.join(" -> ")} Need to scrape CodeReview [${id}]`));

      // we will try one more time
      await fetchGerrit("https://gerrit.wikimedia.org/r/c/" + id);
      try {
        const data = readFileSync(join(gerritScrapedDir, `${id}.json`), "utf-8");
        const parsedData = parse(data) as GerritCodeReview;
        const cr = new CodeReview(parsedData);
        cr.relationChain.push(depthTracker);
        console.log(chalk.green(`Successfully scraped CodeReview [${id}]`));
        await cr.loadRelations(depthTracker);
        return cr;
      } catch (e: any) {
        console.log(chalk.red(`Failed to scrape CodeReview [${id}] ${e}`));
        return undefined;
      }
    }
  }

  static async loadByLink(link: string, depthTracker: DepthTracker): Promise<CodeReview | undefined> {
    const regexp = /\/(\d{2,8})/;
    const match = link.match(regexp);
    if (match && match[1]) {
      const id = match[1];
      return CodeReview.loadById(id, depthTracker);
    }
    return undefined;
  }

  static getById(id: string): CodeReview | undefined {
    // const numId = parseInt(id);
    // return CodeReview.all.find((cr) => cr.virtual_id_number == numId);
    return CodeReview.map[id];
  }

  static getByLink(link: string): CodeReview | undefined {
    const regexp = /\/(\d{2,8})/;
    const match = link.match(regexp);
    if (match && match[1]) {
      const id = match[1];
      return CodeReview.getById(id);
    }
    return undefined;
  }

  static stitchAll() {
    CodeReview.all.forEach((codeReview) => {
      // Connect Code Reviews to Commits [downstream connection]
      Commit.all.forEach((commit) => {
        if (commit.dto.commit == codeReview.commit) {
          codeReview.commits.push(commit);
        }
      });

      // Connect Code Reviews to Tasks [upstream connection]
      Task.all.forEach((task) => {
        if (task.codeReviews.includes(codeReview)) {
          codeReview.tasks.push(task);
        }
      });

      // TODO: Connect Code Reviews to Actionables [upstream connection]
    });
  }
}
