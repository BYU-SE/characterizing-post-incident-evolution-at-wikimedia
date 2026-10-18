import { DepthTracker } from "./depth-tracker.js";
import { IR } from "./ir.js";

export class LookupIncremental {
  static async loadIncident(id: string, loadRelations: number = 0): Promise<IR | undefined> {
    let ir = IR.loadById(id);

    if (ir && loadRelations) {
      await ir.loadRelations(DepthTracker.create(loadRelations, "LookupIncremental"));
    }

    return ir;
  }
}
