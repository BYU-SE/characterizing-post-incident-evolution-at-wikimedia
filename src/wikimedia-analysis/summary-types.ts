export type SummaryOfLifecycle = {
  irs: Container;
  actionables: Container;
  directCodeReviews: Container;
  directCommits: Container;
  tasks: Container;
  codeReviews: Container;
  commits: Container;
  childTasks: Container;
  childCodeReviews: Container;
  childCommits: Container;
};
type Container = { count: number; survived?: Flow; died?: Flow };
type Flow = Record<string, ResultsGroup>;
type ResultsGroup = {
  count: number;
  ids?: string[];
};

export type RepoSummary = {
  reposCommitCounts: Record<string, number>;
  reposCommits: Record<string, string[]>;
  commits: string[];
};
