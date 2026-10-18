import chalk from "chalk";
import { CodeReview } from "./code-review.js";
import { IR } from "./ir.js";
import { Task } from "./task.js";
import { Actionable } from "./actionable.js";
import { Commit } from "./commit.js";

type Class = { new (...args: any[]): any };

export class Lookup {
  private static lookup: Lookup | null = null;

  private constructor(
    public readonly irs: IR[],
    public readonly actionables: Actionable[],
    public readonly tasks: Task[],
    public readonly codeReviews: CodeReview[],
    public readonly commits: Commit[]
  ) {}

  static loadAll(): Lookup {
    if (this.lookup) return this.lookup;

    console.log(chalk.red("Loading IRs and Actionables"));
    IR.loadAll(); // also loads Actionables
    console.log(chalk.red("Loading Tasks"));
    Task.loadAll();
    console.log(chalk.red("Loading Code Reviews"));
    CodeReview.loadAll();
    console.log(chalk.red("Loading Commits"));
    Commit.loadAll();

    console.log(chalk.red("Stitching Actionables"));
    Actionable.stitchAll();
    console.log(chalk.red("Stitching Tasks"));
    Task.stitchAll();
    console.log(chalk.red("Stitching Code Reviews"));
    CodeReview.stitchAll();
    console.log(chalk.red("Stitching Commits"));
    Commit.stitchAll();

    console.log(chalk.green("Loaded"));
    this.lookup = new Lookup(IR.all, Actionable.all, Task.all, CodeReview.all, Commit.all);
    return this.lookup;
  }

  static loadSome(classes: Class[]) {
    if (this.lookup) return this.lookup;

    // Loading
    if (classes.includes(IR) || classes.includes(Actionable)) {
      console.log(chalk.red("Loading IRs and Actionables"));
      IR.loadAll(); // also loads Actionables
    }
    if (classes.includes(Task)) {
      console.log(chalk.red("Loading Tasks"));
      Task.loadAll();
    }
    if (classes.includes(CodeReview)) {
      console.log(chalk.red("Loading Code Reviews"));
      CodeReview.loadAll();
    }
    if (classes.includes(Commit)) {
      console.log(chalk.red("Loading Commits"));
      Commit.loadAll();
    }

    // Stitching
    if (classes.includes(IR) || classes.includes(Actionable)) {
      console.log(chalk.red("Stitching Actionables"));
      Actionable.stitchAll();
    }
    if (classes.includes(Task)) {
      console.log(chalk.red("Stitching Tasks"));
      Task.stitchAll();
    }
    if (classes.includes(CodeReview)) {
      console.log(chalk.red("Stitching Code Reviews"));
      CodeReview.stitchAll();
    }
    if (classes.includes(Commit)) {
      console.log(chalk.red("Stitching Commits"));
      Commit.stitchAll();
    }

    console.log(chalk.green("Loaded"));
    this.lookup = new Lookup(IR.all, Actionable.all, Task.all, CodeReview.all, Commit.all);
    return this.lookup;
  }
}
