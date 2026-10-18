import { readdirSync, readFileSync } from "fs";
import { GeneratedIR, irOutputDir } from "../wikimedia-scraping/run-extract-irs.js";
import { parse } from "yaml";
import { join } from "path";
import { Actionable } from "./actionable.js";
import chalk from "chalk";
import { DepthTracker } from "./depth-tracker.js";
import { NetworkNode, NetworkEdge } from "./network-types.js";

export class IR {
  public static all: IR[] = [];
  public static map: Record<string, IR> = {};

  id: string;
  reportURL: string;
  dates: string[];
  actionables: Actionable[];

  constructor(public readonly dto: GeneratedIR) {
    this.id = dto.gen_id;
    this.reportURL = dto.gen_reportURL;
    this.dates = dto.gen_dates.map((x) => x.date);

    this.actionables = dto.items.map((x) => new Actionable(x, this));

    IR.all.push(this);
    IR.map[this.id] = this;
  }

  async loadRelations(depthTracker: DepthTracker) {
    for (const a of this.actionables) {
      await a.loadRelations(depthTracker.stampOnly(this.id));
    }
  }

  /**
   * Get the network node representation of this IR.
   */
  getNode(): NetworkNode {
    return {
      id: this.id,
      type: "IR",
      label: this.id,
    };
  }

  /**
   * Get all network edges originating from this IR.
   * Returns downward edges to actionables.
   */
  getEdges(): NetworkEdge[] {
    const edges: NetworkEdge[] = [];

    // Downward: IR -> ActionItems
    for (const actionable of this.actionables) {
      edges.push({
        source: this.id,
        target: actionable.id,
        type: "has_actionable",
        direction: "downward",
      });
    }

    return edges;
  }

  static loadAll() {
    const irs = readdirSync(irOutputDir).filter((f) => f.endsWith(".yaml"));
    irs.forEach((irFile) => {
      const data = readFileSync(join(irOutputDir, irFile), "utf-8");
      const parsedData = parse(data) as GeneratedIR;
      new IR(parsedData);
    });
  }

  static loadById(id: string): IR | undefined {
    const existing = IR.getById(id);
    if (existing) return existing;

    try {
      const data = readFileSync(join(irOutputDir, `${id}.yaml`), "utf-8");
      const parsedData = parse(data) as GeneratedIR;
      return new IR(parsedData);
    } catch (e: any) {
      console.log(chalk.red(`Need to scrape IR [${id}] ${e}`));
      // This file does not exist
      return undefined;
    }
  }

  static getById(id: string): IR | undefined {
    return IR.map[id];
  }
}
