# Investigating API Contract Drift in TypeScript-Based Web Applications

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Vitest-100%25%20Passing-brightgreen.svg)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Empirical Study](https://img.shields.io/badge/Research-Empirical%20SE-purple.svg)](docs/academic-paper.md)

**An Empirical Software Engineering Study on Boundary Type Safety, Runtime Schema Validation, and Performance Trade-Offs**

---

## 📌 Research Overview & Status

This repository is the complete research workspace and open-source replication package for the study:  
**"Investigating API Contract Drift in TypeScript-Based Web Applications"**  
by **Suleman Zaheer**, undergraduate Computer Science researcher at the **University of Engineering and Technology (UET), Lahore**.

> **Research Status:** **Phases 1 through 8 Completed.**  
> - Systematic Literature Review Protocol executed and synthesized across 20 appraised peer-reviewed papers.
> - Formal 24-class API Contract Drift Taxonomy constructed across 6 dimensions.
> - Executable TypeScript Benchmark Suite implemented and evaluated across 4 production-grade domains and 6 verification strategies.
> - Full academic research manuscript authored and ready for peer-reviewed conference submission.

---

## 🔬 The Core Problem: The Network Boundary Paradox

TypeScript has become the industry standard for full-stack web applications and Node.js microservices. However, TypeScript implements a **gradual, unsound type system** whose type annotations are **completely erased at compile-time**:

$$\forall e, \tau : \quad \text{erase}(e : \tau) \equiv \text{erase}(e)$$

When external JSON data traverses the network boundary (HTTP REST APIs), applications deserialize untyped payloads. Casting via `(data as OrderResponse)` performs **zero runtime inspection**. If the API contract has drifted, applications accept corrupted payloads silently, deferring failures to deep application crashes or data corruption.

```
+----------------------------------------------------------------------------------------------------+
|                                THE NETWORK BOUNDARY PARADOX                                        |
+----------------------------------------------------------------------------------------------------+
| [TypeScript Client Code]       ==== HTTP Network Wire (Untyped JSON) ====       [API Provider]     |
| const res = (await ...) as T;                                                   Contract Drifts!   |
|         |                                                                              |           |
|         v                                                                              v           |
| (Static types erased at compile-time!)                            (Missing fields, renamed keys,    |
| 100% BLIND to runtime drift!                                       mutated types, broken bounds)   |
|         |                                                                              |           |
|         +------------------------> CRITICAL RUNTIME CRASH <----------------------------+           |
|                               (Cannot read properties of undef)                                    |
+----------------------------------------------------------------------------------------------------+
```

---

## 📊 Key Empirical Findings

We benchmarked 576 domain-scenario-strategy combinations across 4 realistic domains (*UserProfile*, *OrderCheckout*, *PaymentTransaction*, *DeviceTelemetry*) with 1,000 warm micro-benchmark iterations per strategy:

| Verification Strategy | Execution Layer | Recall (TPR) | False Positive Rate | Mean Latency ($L_{\mu s}$) | Throughput (ops/sec) | Diagnostic Score ($D_Q$) |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Static TypeScript (`interface`)** | Compile-Time | **0.0%** | **0.0%** | **1.3 μs** | 627,035 op/s | 0.00 (None) |
| **Zod Schema Validation** | Runtime (Parse) | **79.5%** | **0.0%** | 25.9 μs | 40,832 op/s | 0.92 (High) |
| **TypeBox (Compiled Schema)** | Runtime (JIT) | **79.5%** | **0.0%** | **5.8 μs** | **173,992 op/s** | 0.98 (Very High) |
| **Valibot Modular Validation** | Runtime (Functional) | **79.5%** | **0.0%** | 11.1 μs | 92,598 op/s | 1.00 (Optimal) |
| **OpenAPI 3.1 Validation (Ajv)** | Runtime (Spec) | **79.5%** | **0.0%** | 11.4 μs | 84,686 op/s | 1.00 (Optimal) |
| **Consumer Contracts (Pact)** | Pre-Deploy / CI | **37.5%** | **0.0%** | **4.1 μs** | 241,303 op/s | 1.00 (Optimal) |

### Highlights:
1. **Static Types Catch 0%:** Static TypeScript interfaces offer zero protection against network payload divergence.
2. **Schema Validators Catch 79.5%:** Modern runtime validators catch 100% of structural, scalar, constraint, and enum mutations without triggering false positives on non-breaking additive fields.
3. **The Performance Frontier:** **TypeBox** compiles schemas to native V8 functions, achieving a **5.8 μs** latency (1.9x faster than Valibot, 4.5x faster than Zod).
4. **Actionable Diagnostics:** Valibot, OpenAPI, and TypeBox provide near-perfect error attribution, pinpointing exact JSON paths and invalid tokens.

---

## 🗂️ Ten-Phase Research Workflow

| Phase | Description | Deliverables | Status |
|:---:|:---|:---|:---:|
| **1** | Literature Review Protocol | [`docs/literature-review-protocol.md`](docs/literature-review-protocol.md) | **Completed** |
| **2** | Discovery & Screening | [`data/search-log.csv`](data/search-log.csv), [`data/screening-log.csv`](data/screening-log.csv) | **Completed** |
| **3** | Synthesis & Gap Assessment | [`docs/literature-synthesis-and-gap-analysis.md`](docs/literature-synthesis-and-gap-analysis.md) | **Completed** |
| **4** | Experimental Methodology | [`docs/experimental-methodology-design.md`](docs/experimental-methodology-design.md) | **Completed** |
| **5** | Benchmark Implementation | [`src/`](src/), [`package.json`](package.json), [`tests/`](tests/) | **Completed** |
| **6** | Empirical Execution & Analysis | [`data/results/`](data/results/), [`docs/empirical-results-and-analysis.md`](docs/empirical-results-and-analysis.md) | **Completed** |
| **7** | Academic Manuscript | [`docs/academic-paper.md`](docs/academic-paper.md) | **Completed** |
| **8** | Reproducibility & QA | [`docs/reproducibility-guide.md`](docs/reproducibility-guide.md), 14/14 tests passing | **Completed** |
| **9** | Venue Selection & Submission | [`docs/phase-completion-report.md`](docs/phase-completion-report.md) | **In Progress** |
| **10**| Peer Review & Archiving | Final camera-ready repository archive | **Planned** |

---

## 🚀 Quickstart & Replication

### Prerequisites:
- Node.js `>= 18.0.0`
- NPM `>= 9.0.0`

### 1. Install Dependencies
```bash
git clone https://github.com/imsuleman-10/typescript-api-contract-drift-study.git
cd typescript-api-contract-drift-study
npm install
```

### 2. Run Test Suite
```bash
npm test
```
*Executes all 14 unit tests across the taxonomy, mutator, strategies, and benchmark engine.*

### 3. Run the Empirical Benchmark
```bash
npm run experiment
```
*Executes 576 evaluation scenarios and 1,000 warm latency iterations, generating:*
- `data/results/drift-detection-matrix.csv`
- `data/results/performance-benchmarks.csv`
- `data/results/experiment-summary.json`

### 4. Build TypeScript Code
```bash
npm run build
```

---

## 📐 24-Class Drift Taxonomy Summary

The benchmark tests 24 distinct contract mutation classes across 6 dimensions:
- **Structural Drift:** STR-01 (Remove Required Key), STR-02 (Rename Key), STR-03 (Add Unknown Key - Non-Breaking), STR-04 (Remove Nested Key), STR-05 (Flatten Hierarchy).
- **Scalar Type Drift:** TYP-01 (Int to String), TYP-02 (String to Int), TYP-03 (Boolean to String), TYP-04 (ISO Date to Epoch Ms), TYP-05 (Scalar to Array), TYP-06 (Array to Scalar).
- **Constraint Drift:** CST-01 (Numeric Out of Bounds), CST-02 (Regex Violation), CST-03 (String Length Excess), CST-04 (Array Cardinality Underflow), CST-05 (Empty String Violation).
- **Nullability Drift:** NUL-01 (Mandatory to Null), NUL-02 (Mandatory to Undefined), NUL-03 (Nullable to Null - Non-Breaking), NUL-04 (Optional Made Mandatory).
- **Semantic & Enum Drift:** ENM-01 (Undocumented Variant), ENM-02 (Enum Casing Shift), ENM-03 (Deprecated Enum Sent).
- **Protocol Drift:** PRO-01 (Status Code Divergence: 200 OK with Error Body).

---

## 📖 Citation

If you use this benchmark harness, taxonomy, or dataset in your research, please cite:

```bibtex
@inproceedings{zaheer2026contractdrift,
  author    = {Suleman Zaheer},
  title     = {Investigating API Contract Drift in TypeScript-Based Web Applications: An Empirical Study of Boundary Type Safety, Runtime Schema Validation, and Performance Trade-Offs},
  booktitle = {Proceedings of the IEEE/ACM International Conference on Software Engineering (ICSE)},
  year      = {2026},
  url       = {https://github.com/imsuleman-10/typescript-api-contract-drift-study}
}
```

---

## 📄 License

This research workspace and code are distributed under the [MIT License](LICENSE).
