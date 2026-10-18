// Automatically generated from: https://transform.tools/json-to-typescript
export interface GerritCodeReview {
  id: string;
  triplet_id: string;
  project: string;
  branch: string;
  hashtags: any[];
  change_id: string;
  subject: string;
  status: string;
  created: string;
  updated: string;
  submitted: string;
  submitter: Submitter;
  total_comment_count: number;
  unresolved_comment_count: number;
  has_review_started: boolean;
  meta_rev_id: string;
  _number: number;
  virtual_id_number: number;
  owner: Owner;
  actions: Actions;
  labels: Labels;
  removable_reviewers: any[];
  reviewers: Reviewers;
  pending_reviewers: PendingReviewers;
  reviewer_updates: ReviewerUpdate[];
  messages: Message[];
  current_revision_number: number;
  current_revision: string;
  revisions: Revisions;
  requirements: any[];
  submit_records: any[];
  submit_requirements: any[];
  comments?: GerritComments;
}

export interface Submitter {
  _account_id: number;
  name: string;
  username: string;
  tags: string[];
}

export interface Owner {
  _account_id: number;
  name: string;
  email: string;
  username: string;
}

export interface Actions {}

export interface Labels {
  Verified: Verified;
  "Code-Review": GerritCodeReview;
}

export interface Verified {
  approved: Approved;
  all: All[];
  values: Values;
  description: string;
  default_value: number;
  value?: number;
}

export interface Approved {
  _account_id: number;
  name: string;
  username: string;
  tags: string[];
}

export interface All {
  value: number;
  _account_id: number;
  name: string;
  email?: string;
  username: string;
  inactive?: boolean;
  status?: string;
  date?: string;
  permitted_voting_range?: PermittedVotingRange;
  tags?: string[];
}

export interface PermittedVotingRange {
  min: number;
  max: number;
}

export interface Values {
  "-1": string;
  " 0": string;
  "+1": string;
  "+2": string;
}

export interface GerritCodeReview {
  approved: Approved2;
  all: All2[];
  values: Values2;
  description: string;
  value?: number;
  default_value: number;
}

export interface Approved2 {
  _account_id: number;
  name: string;
  email: string;
  username: string;
  inactive: boolean;
}

export interface All2 {
  value: number;
  date?: string;
  permitted_voting_range?: PermittedVotingRange2;
  _account_id: number;
  name: string;
  email?: string;
  username: string;
  inactive?: boolean;
  status?: string;
  tags?: string[];
}

export interface PermittedVotingRange2 {
  min: number;
  max: number;
}

export interface Values2 {
  "-2": string;
  "-1": string;
  " 0": string;
  "+1": string;
  "+2": string;
}

export interface Reviewers {
  REVIEWER: Reviewer[];
}

export interface Reviewer {
  _account_id: number;
  name: string;
  username: string;
  tags?: string[];
  email?: string;
  inactive?: boolean;
  status?: string;
}

export interface PendingReviewers {}

export interface ReviewerUpdate {
  updated: string;
  updated_by: UpdatedBy;
  reviewer: Reviewer2;
  state: string;
}

export interface UpdatedBy {
  _account_id: number;
  name: string;
  email?: string;
  username: string;
  status?: string;
  inactive?: boolean;
  tags?: string[];
}

export interface Reviewer2 {
  _account_id: number;
  name: string;
  email?: string;
  username: string;
  status?: string;
  inactive?: boolean;
  tags?: string[];
}

export interface Message {
  id: string;
  author?: Author;
  date: string;
  message: string;
  accounts_in_message: any[];
  _revision_number: number;
}

export interface Author {
  _account_id: number;
  name: string;
  email?: string;
  username: string;
  display_name?: string;
  inactive?: boolean;
  tags?: string[];
}

export type Revisions = Record<string, Revision>;

export interface Revision {
  kind: string;
  _number: number;
  created: string;
  uploader: Uploader;
  ref: string;
  fetch: Fetch;
  commit: Commit;
  branch: string;
}

export interface Uploader {
  _account_id: number;
  name: string;
  email: string;
  username: string;
}

export interface Fetch {
  "anonymous http": AnonymousHttp;
}

export interface AnonymousHttp {
  url: string;
  ref: string;
  commands: Commands;
}

export interface Commands {
  Branch: string;
  Checkout: string;
  "Cherry Pick": string;
  "Format Patch": string;
  Pull: string;
  "Reset To": string;
}

export interface Commit {
  parents: Parent[];
  author: Author2;
  committer: Committer;
  subject: string;
  message: string;
  web_links: WebLink2[];
}

export interface Parent {
  commit: string;
  subject: string;
  web_links: WebLink[];
}

export interface WebLink {
  name: string;
  url: string;
}

export interface Author2 {
  name: string;
  email: string;
  date: string;
  tz: number;
}

export interface Committer {
  name: string;
  email: string;
  date: string;
  tz: number;
}

// Comments types (keyed by file path)
export type GerritComments = Record<string, GerritComment[]>;

export interface GerritComment {
  author: CommentAuthor;
  change_message_id: string;
  unresolved: boolean;
  context_lines: ContextLine[];
  source_content_type: string;
  patch_set: number;
  id: string;
  line: number;
  updated: string;
  message: string;
  commit_id: string;
  in_reply_to?: string;
}

export interface CommentAuthor {
  _account_id: number;
  name: string;
  email?: string;
  username: string;
}

export interface ContextLine {
  line_number: number;
  context_line: string;
}
