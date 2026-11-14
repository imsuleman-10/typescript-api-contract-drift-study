# Reproducibility and Artifact Evaluation Guide

**Project:** Investigating API Contract Drift in TypeScript-Based Web Applications  
**Author:** Suleman Zaheer (UET Lahore)  
**License:** MIT  
**Date:** November 2026  

---

## 1. Overview and Hardware Requirements

This artifact contains the complete replication package for the empirical study on API contract drift in TypeScript-based web applications. It includes the dataset logs, literature evaluation matrix, benchmark taxonomy, mutation generators, six strategy implementations, Vitest test suite, and the empirical experiment runner.

### Minimum System Requirements:
- **Operating System:** Cross-platform (Windows 10/11, macOS 12+, or Ubuntu Linux 20.04+)
- **Node.js:** `>= v18.0.0` (Tested on Node.js v24.22.0)
- **NPM:** `>= 9.0.0`
- **Memory:** Minimum 2 GB RAM
- **Disk Space:** ~150 MB for repository and `node_modules`

---

## 2. Quickstart Step-by-Step Reproduction

### Step 1: Clone and Enter the Repository
```bash
git clone https://github.com/imsuleman-10/typescript-api-contract-drift-study.git
cd typescript-api-contract-drift-study
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Verification Test Suite
Execute the full Vitest suite to verify taxonomy invariants, mutation determinism, strategy behaviors, and benchmark metrics:
```bash
npm test
```
*Expected Output:* 4 test files passed, 14 unit tests passed (100% green).

### Step 4: Compile TypeScript Code
Compile all TypeScript source files into standard JavaScript distribution files in `dist/`:
```bash
npm run build
```

### Step 5: Execute the Full Empirical Experiment
Run the benchmark across all 4 domains, 24 mutation classes, and 6 strategies with 1,000 warm micro-benchmark iterations:
```bash
npm run experiment
```
*Output Artifacts Generated:*
- `data/results/drift-detection-matrix.csv` (109 KB): Detailed detection breakdown for every domain-scenario-strategy combination.
- `data/results/performance-benchmarks.csv` (2.2 KB): Latency distributions (mean, median, P90, P99, min, max, throughput).
- `data/results/experiment-summary.json` (1.7 KB): Aggregate recall, false positive rates, and diagnostic scores.

---

## 3. Artifact Structure and File Mapping

```
typescript-api-contract-drift-study/
│
├── data/                                 <- Research Data & Systematic Logs
│   ├── protocol-amendments.csv           <- Formal changes to review & benchmark protocol
│   ├── search-log.csv                    <- Database search queries (IEEE, ACM, Scopus, GS)
│   ├── screening-log.csv                 <- Inclusion/exclusion screening decisions
│   ├── paper-evaluation-matrix.csv       <- Quality appraisal of 20 included primary papers
│   ├── terminology-log.csv               <- Standardized terminology mapping
│   └── results/                          <- Generated empirical benchmark results
│       ├── drift-detection-matrix.csv    <- 576 scenario evaluation records
│       ├── performance-benchmarks.csv    <- Latency & throughput telemetry
│       └── experiment-summary.json       <- High-level summary metrics
│
├── docs/                                 <- Scholarly Documentation (Phases 1 - 7)
│   ├── literature-review-protocol.md     <- Phase 1: Search & screening protocol
│   ├── literature-synthesis-and-gap-analysis.md <- Phase 3: Evidence synthesis & research gap
│   ├── experimental-methodology-design.md <- Phase 4: Formal model & benchmark design
│   ├── empirical-results-and-analysis.md  <- Phase 6: Findings, discussion & decision tree
│   ├── academic-paper.md                 <- Phase 7: Full academic conference manuscript
│   ├── reproducibility-guide.md          <- Phase 8: Artifact reproduction instructions
│   └── phase-completion-report.md        <- Formal Phase 1-10 milestone tracking
│
├── src/                                  <- Executable TypeScript Benchmark Harness
│   ├── types/index.ts                    <- Core TypeScript interfaces and metrics
│   ├── taxonomy/drift-taxonomy.ts        <- 24-class API contract drift taxonomy
│   ├── contracts/                        <- Domain contracts (UserProfile, Order, etc.)
│   ├── mutator/drift-mutator.ts          <- Deterministic mutation engine
│   ├── strategies/                       <- 6 evaluated verification strategies
│   ├── engine/benchmark-engine.ts        <- Benchmark evaluation & telemetry harness
│   ├── scripts/run-experiment.ts         <- Experiment runner script & CSV exporter
│   ├── cli.ts                            <- CLI entry point
│   └── index.ts                          <- Main package exports
│
├── tests/                                <- Unit Test Suite
│   ├── taxonomy.test.ts                  <- Validates 24-mutation taxonomy integrity
│   ├── mutator.test.ts                   <- Validates payload mutation engine
│   ├── strategies.test.ts                <- Validates each verification strategy
│   └── benchmark.test.ts                 <- End-to-end benchmark engine assertions
│
├── package.json                          <- Dependencies, scripts, and package metadata
├── tsconfig.json                         <- Strict TypeScript compilation configuration
├── vitest.config.ts                      <- Vitest test runner configuration
└── README.md                             <- Main repository documentation & overview
```

---

## 4. Replication Checklist for Reviewers

- [x] Protocol versioned and amendments recorded (`data/protocol-amendments.csv`).
- [x] Primary studies independently verifiable via official DOIs (`data/paper-evaluation-matrix.csv`).
- [x] Baseline domain schemas represent realistic production schemas, not synthetic toys (`src/contracts/`).
- [x] Mutation generation is completely deterministic and reproducible (`src/mutator/drift-mutator.ts`).
- [x] Micro-benchmarking includes warm-up cycles to eliminate V8 JIT compilation bias (`src/engine/benchmark-engine.ts`).
- [x] All raw execution outputs are preserved in standard CSV and JSON formats (`data/results/`).
- [x] Test suite executes without failures (`npm test`).
