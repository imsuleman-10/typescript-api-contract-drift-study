# Measuring API Contract Drift in TypeScript-Based Web Applications

**An empirical study of runtime validation and automated testing**

This repository is the research workspace for a proposed undergraduate study in
software engineering. Its intended focus is how API contract drift can be
identified and evaluated in TypeScript-based web applications, with runtime
validation and automated testing as the motivating techniques.

> **Research status:** Phase 1 — literature review and research-gap assessment.
> No literature synthesis, research gap, hypotheses, experimental results, or
> conclusions are asserted in this repository yet. These will be considered
> only after sources have been collected, screened, and verified.

## Researcher and context

- **Researcher:** Suleman
- **Program:** Undergraduate Computer Science
- **Institution:** University of Engineering and Technology, Lahore
- **Research area:** Software Engineering
- **Proposed technical context:** TypeScript web applications and REST APIs

## Purpose of this repository

The repository will support a transparent and reproducible research workflow:

- record literature searches and screening decisions;
- document source metadata and evidence extracted from each included study;
- preserve the provenance of any later dataset, code, and analysis;
- distinguish prior published findings from this study's hypotheses and
  observations; and
- prepare research outputs only as each phase is completed.

This README defines the initial literature-review protocol. It is not a
completed literature review or a claim that the topic is novel.

## Scope and terminology to investigate

The review should establish how relevant prior work defines and studies:

- **API contract:** the agreed interface, schema, behavior, or compatibility
  expectations between an API provider and its consumers.
- **Contract drift:** a change or divergence between an API's documented or
  otherwise expected contract and the behavior or data actually observed by a
  consumer. This is a working search concept, not a final operational
  definition.
- **Runtime validation:** checking received or produced data at execution time
  against a schema or set of constraints.
- **Automated API testing:** machine-executed tests that check API behavior,
  compatibility, schemas, or consumer expectations.
- **TypeScript web application:** an application using TypeScript in one or
  more API-consuming or API-providing components.

The literature review should record each source's own definitions instead of
assuming these terms are used consistently across studies.

## Phase 1: literature-review strategy

### 1. Review objective

Locate, verify, and organize research relevant to API contract evolution or
drift, API compatibility and conformance, runtime schema validation, and
automated API testing. The initial review will map the terminology, systems,
methods, evidence, and limitations found in the literature. A research gap will
not be proposed until the collected sources have been assessed.

### 2. Search venues

Search the following sources where access is available, recording the platform
actually used and the date of each search:

1. **ACM Digital Library**
2. **IEEE Xplore**
3. **Scopus** and/or **Web of Science** for indexed cross-disciplinary
   discovery
4. **Google Scholar** for supplementary discovery and citation chasing
5. **Crossref** for DOI and bibliographic metadata verification
6. **Publisher pages** for final publication details and full-text access

Google Scholar and citation chasing are supplementary discovery methods; they
should not be reported as if they were equivalent to a curated bibliographic
database. Record access restrictions and any search-interface limitations.

### 3. Search concepts and example queries

Adapt syntax to each database, preserve the exact query that was run, and record
any filters. Begin broadly; use narrower combinations to find work on the
individual concepts.

**A. API contracts, drift, and evolution**

```text
"API contract" AND (drift OR evolution OR change OR compatibility)
"web API" AND (contract OR schema) AND (breaking change OR compatibility)
"REST API" AND (evolution OR versioning OR compatibility OR conformance)
"API evolution" AND (consumer OR client OR breaking change)
```

**B. Contract testing and consumer expectations**

```text
"consumer-driven contract testing" AND API
"contract testing" AND (REST OR web API OR microservice)
"API conformance testing" OR "schema conformance"
"consumer contract" AND (testing OR compatibility)
```

**C. Runtime validation and schema validation**

```text
"runtime validation" AND (API OR JSON OR schema)
"JSON schema validation" AND (API OR client OR runtime)
(runtime type checking OR runtime type validation) AND TypeScript
(schema validation OR data validation) AND (TypeScript OR JavaScript) AND API
```

**D. Automated testing of APIs**

```text
"automated API testing" AND (REST OR web API)
"REST API testing" AND (schema OR contract OR compatibility)
"API testing" AND (generated OR automated OR oracle)
"end-to-end testing" AND API AND (contract OR schema)
```

**E. Language and ecosystem context**

```text
TypeScript AND ("API contract" OR "contract testing" OR "schema validation")
JavaScript AND "runtime validation" AND API
(OpenAPI OR Swagger) AND (validation OR testing) AND (client OR TypeScript)
```

These are starting queries, not a claim that the review is exhaustive. For each
query, note database-specific syntax changes, date limits (if any), result
counts when provided, and the number of records exported or screened.

### 4. Eligibility and screening

Apply and document criteria consistently. The following are provisional
screening rules to guide collection and may be refined with a dated rationale.

**Potentially include**

- peer-reviewed empirical studies, research papers, and systematic or
  structured reviews relevant to API contracts, API evolution, compatibility,
  conformance, runtime validation, or automated API testing;
- studies that provide methods, tools, benchmarks, or empirical observations
  applicable to web APIs or TypeScript/JavaScript ecosystems; and
- foundational work needed to understand terminology or evaluation methods,
  even where the implementation language differs.

**Potentially exclude**

- sources with no substantive connection to the review concepts;
- duplicate reports of the same study, except where a fuller version contains
  additional relevant evidence (link the versions and state which is used);
- unsupported claims, promotional material, or sources for which essential
  bibliographic identity cannot be verified; and
- sources excluded after full-text review, with a specific reason recorded.

Do not exclude a source solely because it reports an unexpected or null result.
Distinguish peer-reviewed research from preprints, theses, technical reports,
and other grey literature in the source log.

### 5. Screening workflow

1. Export search results and retain the original export where permitted.
2. Normalize bibliographic metadata without discarding the original record.
3. Identify duplicates by DOI, title, and author/year; manually resolve
   uncertain matches.
4. Screen title and abstract against the eligibility criteria.
5. Retrieve and screen full text for potentially relevant sources.
6. Record inclusion/exclusion decisions and reasons.
7. Follow references backward and use citation tracking forward for relevant
   included works; log these as separate discovery routes.
8. Verify final citation metadata against a publisher page or DOI record.
9. Extract evidence with page or section locations so claims can be checked.

If a single researcher performs screening, record that fact and treat the
possibility of selection error as a limitation. Do not describe the review as
systematic unless its process and reporting meet the selected review standard.

### 6. Source evaluation table template

Create one row per distinct study or source. Use `Unknown` or `Not reported`
instead of inferring missing details. Add rows as needed; keep the source ID
stable so notes, citations, and later evidence can be traced back to the same
record.

| Source ID | Full citation | DOI / publisher URL | Source type / venue | Peer-reviewed? | Study aim | API / system context | Contract or drift definition | Runtime validation approach | Automated testing approach | Study design / data | Evaluation measures | Main findings (with page/section) | Limitations noted by authors | Relevance to this review | Screening decision and reason | Metadata verified? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S001 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

### 7. Search and screening log template

| Search ID | Date (YYYY-MM-DD) | Database / platform | Exact query | Filters / date range | Results reported | Exported / screened | Discovery route or notes |
|---|---|---|---|---|---:|---:|---|
| Q001 |  |  |  |  |  |  |  |

| Source ID | Screening stage | Decision | Reason / evidence | Reviewer | Date |
|---|---|---|---|---|---|
| S001 | Title/abstract or full text | Include / Exclude / Unclear |  |  |  |

### 8. Evidence synthesis and gap assessment

After sources are collected and verified, synthesize them by topic and method.
For each claim, retain a traceable citation and supporting page, section, or
table. Compare study contexts, operational definitions, methods, evaluation
measures, and stated limitations. Separate:

- findings directly reported by a source;
- interpretations made during synthesis; and
- questions or hypotheses proposed for later phases.

Only after this evidence map is reviewed should a potential research gap be
formulated. A gap must be supported by the reviewed evidence and qualified by
the search scope; absence of a result in an initial search is not proof that no
prior work exists.

## High-level research workflow

The project is intended to proceed in the following order. Only Phase 1 is
active at this point.

| Phase | Intended work | Status |
|---|---|---|
| 1. Literature review and research gap | Search, verify, screen, extract, and synthesize relevant sources; assess a potential gap from evidence | **Active** |
| 2. Research questions and hypotheses | Define measurable questions, objectives, and hypotheses based on Phase 1 | Not started |
| 3. Methodology and benchmark design | Specify systems, comparisons, data, procedures, measures, and reproducibility controls | Not started |
| 4. Implementation and experiments | Implement the approved design and collect actual observations | Not started |
| 5. Statistical analysis and visualization | Analyze recorded data using a justified, documented analysis plan | Not started |
| 6. Manuscript writing | Draft sections appropriate to completed work; do not write results before data exist | Not started |
| 7. Verification and submission preparation | Check references, methods, artifacts, venue requirements, and AI disclosure | Not started |

## Research integrity and reproducibility

- Never invent papers, authors, DOIs, datasets, measurements, or findings.
- Preserve search dates, exact queries, screening decisions, and source
  provenance.
- Verify citation metadata and use publisher or DOI links when available.
- Keep original source material separate from extracted notes and synthesized
  claims.
- Do not write a Results section until experiments have produced actual,
  retained data.
- Document code, dependencies, configuration, data provenance, exclusions, and
  analysis steps before claiming reproducibility.
- Record limitations and plausible alternative interpretations alongside
  findings.
- Follow the eventual target venue's author, formatting, reference, ethics, and
  AI-assistance disclosure policies. The target venue has not yet been selected.

## How to contribute collected sources

Before a research gap is stated, provide the sources you collect with as many
of these details as available:

1. title and author list;
2. publication year and venue or source type;
3. DOI or publisher URL (or a stable repository URL);
4. abstract or relevant notes; and
5. full text when you are permitted to share it.

The next review step is to verify and organize those sources, fill the
evaluation table, and then discuss what conclusions the evidence does—and does
not—support.
