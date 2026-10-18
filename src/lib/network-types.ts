/**
 * Types for representing artifacts and their relationships as a network graph.
 */

export type NetworkNodeType = "IR" | "ActionItem" | "Task" | "CodeReview";

export type NetworkEdgeDirection = "downward" | "upward" | "other";

export interface NetworkNode {
  id: string;
  type: NetworkNodeType;
  label: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: string;
  direction: NetworkEdgeDirection;
}
