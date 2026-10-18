import { readdirSync, readFileSync } from "fs";
import { parse } from "yaml";
import { join } from "path";
import { CommitLogEntry, gitLogDir } from "../wikimedia-scraping/git-log-to-json.js";
import { CodeReview } from "./code-review.js";

export class Commit {
  public static all: Commit[] = [];

  reviews: CodeReview[];

  constructor(public readonly dto: CommitLogEntry) {
    // to be filled in stitch
    this.reviews = [];

    Commit.all.push(this);
  }

  static loadAll() {
    const gitCommitsByRepo = readdirSync(gitLogDir).filter((f) => f.endsWith(".json"));
    gitCommitsByRepo.forEach((repoCommitsFile) => {
      const data = readFileSync(join(gitLogDir, repoCommitsFile), "utf-8");
      const parsedData = parse(data) as CommitLogEntry[];
      parsedData.forEach((commit) => {
        new Commit(commit);
      });
    });
  }

  static stitchAll() {
    // TODO: Connect Code Reviews [upstream]
  }
}
