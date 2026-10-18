# fdse-explore

Research repository for studying post-incident software evolution in Wikimedia infrastructure. We compare *Post-Incident Changes* (PIC) — tasks, code reviews, and commits linked to incident reports — against a random sample of *Other Changes* (OC) to understand how engineering work changes in the wake of an incident.

This README is a guided tour. It walks you through the pipeline in the order you would normally run it: **scrape → extract → build metric CSVs → analyze in the notebook**. 

You do not need to read every file in `src/` to use the repo. For thoroughness sake, we included all of the scripts used in our ivnestigations as they may prove useful to further analysis, such as discovering and analysing relationship chains between artifacts.

## Setup

To run the Typescript code for scraping raw Incident Reports, Tasks, and Code Reviews, as well as generating the CSV files used in the Python Notebook, first run `npm install`.


---

## 1. Crawling Wikimedia from scratch

To ensure that the dataset is reproduceable, this repository includs a copy of all raw artifacts and no scraping is necessary to explore. Thus, crawling Wikimedia is an optional step.

## Option A: Scrape Without Identifiers

If you want to rebuild the dataset yourself, run the scrapers in the order below. Each script is idempotent — it skips anything that already exists on disk and throttles itself with a delay between requests, so it is safe to re-run.

All scrapers live in `src/wikimedia-scraping/`.

**Step 1 — scrape incident reports.** Entry point: `run-scrape-irs.ts`. This script reads the hard-coded list of IR URLs in `incident-reports.ts` and saves the HTML for each one to `data/wikimedia-incident-reports/`. If you want to add or remove incidents from the study, edit `incidentReportLinks` in `incident-reports.ts`.

**Step 2 — extract structured data from IRs.** Entry point: `run-extract-irs.ts`. This parses the IR HTML you just scraped and produces one YAML file per incident under `data/wikimedia-incident-reports-extract/`. Each YAML records the IR's actionables and the Phabricator / Gerrit links they reference.

**Step 3 — follow links out of the IRs.** Entry point: `run-scrape-data-in-extracted-irs.ts`. This walks every extracted IR, finds every Phabricator and Gerrit link, and fetches them, populating `data/wikimedia-phabricator/` (HTML) and `data/wikimedia-gerrit/` (JSON).

**Step 4 — extract structured data from Phabricator.** Entry point: `run-extract-from-phab.ts`. Like step 2 but for tasks; produces YAML files in `data/wikimedia-phabricator-extract/`.

**Step 5 — follow links out of the tasks.** Entry point: `run-scrape-data-in-extracted-phab.ts`. Tasks often reference other tasks (parent / child / related) and additional code reviews. This script recursively scrapes those, expanding the corpus until everything reachable from the IRs has been pulled in.

**Step 6 — sample Other Changes.** Entry point: `run-scrape-non-incident-tasks-and-code-reviews.ts`. This picks random Phabricator and Gerrit IDs to build the OC baseline. Let it run in the background until you have enough samples.

**Step 7 — git history.** The shell scripts `git-log-to-json.sh` (and `*-large.sh` / `*-empty.sh` for edge cases) clone each repo in `projectToGitLogMap` (in `git-log-to-json.ts`) and dump its `git log` to JSON under `data/wikimedia-gitlog/`.

After step 7, the dataset under `data/` is complete and self-contained.

## Option B: Scrape With Identifiers

Once the data has been at least partially scraped and identifiers for incident reports are available, it becomes possible to scrape by identifier. In this case there are two options:

- **Bulk load** — `Lookup.loadAll()` reads every extracted artifact off disk in the right order and stitches relations between them. Use this when you want to traverse the whole corpus.
- **Targeted, scrape-if-missing** — `Task.loadById(id, ...)` and `CodeReview.loadById(id, ...)` fetch a single artifact. If the extract isn't already on disk, they scrape it. This is how the scripts opportunistically grow the corpus while running.

If you're writing a new analysis, `loadById` is almost always what you want.

---

## 2. The data on disk

After scraping, `data/` is split between **raw artifacts** (what came back from the network) and **extracted artifacts** (structured YAML / JSON ready for analysis):

| Path | What's in it |
| --- | --- |
| `data/wikimedia-incident-reports/` | Raw IR HTML |
| `data/wikimedia-incident-reports-extract/` | IR YAML (actionables + links) |
| `data/wikimedia-phabricator/` | Raw Phabricator task HTML |
| `data/wikimedia-phabricator-extract/` | Task YAML (status, priority, related tasks, MRs, timeline) |
| `data/wikimedia-gerrit/` | Gerrit change JSON (already structured, no extract step needed) |
| `data/wikimedia-gitlog/` | Per-repo `git log` as JSON |
| `data/repos/` | Cloned source repositories |


We precompute some summary information to facilitate later analysis without loading the full dataset. These should be regenerated by calling the appropriate script if the dataset changes:

- `ir_summary.json` — full tree of artifacts linked to each IR.
- `repo_summary.json` — post-incident commit counts and hashes per repo.
- `lifecycle_summary.json` — PIC artifacts bucketed by lifecycle outcome (survived vs. died, with vs. without children, etc.).

---

## 3. Building the metric CSVs

The `src/guided/3-2-metrics-*.ts` scripts generate the CSV files that summarize PIC and OC data. A further script `create-combined-{artifact}-dataset.ts` in `src/guided/findings` unifies these CSV files into an artifact CSV file which is used by the python notebook.

| Run this script | …to produce |
| --- | --- |
| `src/guided/3-2-metrics-tasks.ts` | `3-2-compare_tasks_pic.csv` and `_oc.csv` |
| `src/guided/3-2-metrics-code-review.ts` | `3-2-compare_code_reviews_pic.csv` and `_oc.csv` |
| `src/guided/3-2-metrics-commits.ts` | `3-2-compare_commits_pic.csv` and `_oc.csv` (plus `_from_cr_` variants) |
| `src/guided/findings/rq1-do-tasks-finish-faster-because-of-incident/create-combined-task-dataset.ts` | `combined-oc-pic-tasks.csv` |
|`src/guided/findings/rq1-do-tasks-finish-faster-because-of-incident/create-combined-cr-dataset.ts` | `combined-oc-pic-code-reviews.csv` |


---

## 4. Analyzing in the Python notebook

The notebook includes the core of the quantiatiave analysis, such as the Mann-Whitney U tests. It contains additional charts and outputs not included in our final output which may be of interest to future researchers. 

