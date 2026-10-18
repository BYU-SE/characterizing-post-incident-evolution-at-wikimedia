import chalk from "chalk";
import { LookupIncremental } from "../../../lib/lookup-incremental.js";
import { cleanIRLink, incidentReportLinks } from "../../../wikimedia-scraping/incident-reports.js";
import { IR } from "../../../lib/ir.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Task } from "../../../lib/task.js";
import { CodeReview } from "../../../lib/code-review.js";
import { NetworkNode, NetworkEdge } from "../../../lib/network-types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodes: NetworkNode[] = [];
const edges: NetworkEdge[] = [];
const nodeIds = new Set<string>();

// Helper to add a node (avoiding duplicates)
function addNode(node: NetworkNode) {
  if (!nodeIds.has(node.id)) {
    nodes.push(node);
    nodeIds.add(node.id);
  }
}

// Helper to add an edge (filters to only include edges where both nodes exist)
function addEdge(edge: NetworkEdge) {
  if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
    edges.push(edge);
  }
}

// Load all IRs and build the graph
console.log(chalk.blue("Loading incident reports and building graph..."));

for (const link of incidentReportLinks) {
  const irID = cleanIRLink(link).slice("/wiki/Incidents/".length);
  console.log(chalk.green(`Processing IR: ${irID}`));
  const ir = await LookupIncremental.loadIncident(irID, 3);

  if (!ir) {
    console.log(chalk.red(`Could not load IR: ${irID}`));
    continue;
  }

  // Add IR node
  addNode(ir.getNode());

  // Process actionables (add nodes first, then edges)
  for (const actionable of ir.actionables) {
    addNode(actionable.getNode());

    // Process tasks
    for (const taskRelation of actionable.contextLinksToTaskRelations) {
      const task = taskRelation.actual;
      addNode(task.getNode());

      // Process code reviews from tasks
      for (const crRelation of task.detailsMRRelations) {
        const cr = crRelation.actual;
        addNode(cr.getNode());
      }

      // Process child tasks
      for (const childTaskRelation of task.relatedTaskRelations) {
        const childTask = childTaskRelation.actual;
        addNode(childTask.getNode());

        // Process code reviews from child tasks
        for (const childCrRelation of childTask.detailsMRRelations) {
          const childCr = childCrRelation.actual;
          addNode(childCr.getNode());
        }
      }
    }

    // Process direct code reviews from actionables
    for (const crRelation of actionable.contextLinksToCodeReviewRelations) {
      const cr = crRelation.actual;
      addNode(cr.getNode());
    }
  }
}

console.log(chalk.blue("Adding all edges from artifacts..."));

// Add edges from all IRs
for (const ir of IR.all) {
  if (nodeIds.has(ir.id)) {
    for (const edge of ir.getEdges()) {
      addEdge(edge);
    }
  }
}

// Add edges from all Actionables
for (const ir of IR.all) {
  for (const actionable of ir.actionables) {
    if (nodeIds.has(actionable.id)) {
      for (const edge of actionable.getEdges()) {
        addEdge(edge);
      }
    }
  }
}

// Add edges from all Tasks
for (const task of Task.all) {
  if (nodeIds.has(task.id)) {
    for (const edge of task.getEdges()) {
      addEdge(edge);
    }
  }
}

// Add edges from all Code Reviews
for (const cr of CodeReview.all) {
  const crId = `CR-${cr.virtual_id_number}`;
  if (nodeIds.has(crId)) {
    for (const edge of cr.getEdges()) {
      addEdge(edge);
    }
  }
}

console.log(chalk.blue("Graph construction complete!"));
console.log(chalk.yellow(`Total nodes: ${nodes.length}`));
console.log(chalk.yellow(`Total edges: ${edges.length}`));

// Write nodes CSV
const nodesCsv = [
  "id,type,label",
  ...nodes.map((n) => `"${n.id}","${n.type}","${n.label.replace(/"/g, '""')}"`),
].join("\n");

writeFileSync(join(__dirname, "graph_nodes.csv"), nodesCsv);
console.log(chalk.green("Written: graph_nodes.csv"));

// Write edges CSV
const edgesCsv = [
  "source,target,type,direction",
  ...edges.map((e) => `"${e.source}","${e.target}","${e.type}","${e.direction}"`),
].join("\n");

writeFileSync(join(__dirname, "graph_edges.csv"), edgesCsv);
console.log(chalk.green("Written: graph_edges.csv"));

// Write summary statistics
const stats = {
  total_nodes: nodes.length,
  total_edges: edges.length,
  nodes_by_type: {
    IR: nodes.filter((n) => n.type === "IR").length,
    ActionItem: nodes.filter((n) => n.type === "ActionItem").length,
    Task: nodes.filter((n) => n.type === "Task").length,
    CodeReview: nodes.filter((n) => n.type === "CodeReview").length,
  },
  edges_by_type: {
    // Downward edges
    has_actionable: edges.filter((e) => e.type === "has_actionable").length,
    references_task: edges.filter((e) => e.type === "references_task").length,
    references_code_review: edges.filter((e) => e.type === "references_code_review").length,
    has_code_review: edges.filter((e) => e.type === "has_code_review").length,
    has_subtask: edges.filter((e) => e.type === "has_subtask").length,
    // Upward edges
    belongs_to_ir: edges.filter((e) => e.type === "belongs_to_ir").length,
    mentions_ir: edges.filter((e) => e.type === "mentions_ir").length,
    mentions_task: edges.filter((e) => e.type === "mentions_task").length,
    mentions_code_review: edges.filter((e) => e.type === "mentions_code_review").length,
  },
};

writeFileSync(join(__dirname, "graph_stats.json"), JSON.stringify(stats, null, 2));
console.log(chalk.green("Written: graph_stats.json"));

console.log(chalk.blue("\nSummary:"));
console.log(JSON.stringify(stats, null, 2));
