# Phase 1 — Literature Review Protocol

**Project:** Investigating API Contract Drift in TypeScript-Based Web Applications
**Researcher:** Suleman Zaheer, undergraduate Computer Science student, University of Engineering and Technology, Lahore
**Protocol version:** 1.1
**Protocol status:** Approved by researcher on 2026-11-10; supervisor feedback not yet recorded
**Prepared:** 2026-11-10
**Search execution status:** Phase 2 exploratory discovery has started; the planned database searches and screening are incomplete.

## 1. Purpose and phase boundary

This protocol specifies how literature for the research topic will be located,
screened, assessed, and recorded. Its purpose is to make the review traceable
and repeatable, not to assert that the review is complete or that a research
gap exists.

**This document is a search and screening plan, not a literature review.** No
database searches, source screening, or evidence extraction are recorded here.
Search dates, result counts, and screening decisions must be entered only after
the corresponding work has actually been completed.

This phase establishes the review procedure and blank data-collection
templates. Literature collection and source screening are a subsequent phase;
do not treat any suggested query or search term as evidence about the state of
research.

## 2. Review objective and questions

The objective is to identify and organize published research and clearly
labelled supplementary material relevant to API contract change, divergence,
conformance, and testing, with attention to the TypeScript web-application
context.

The review will map:

1. how relevant sources define API contracts, contract change, drift,
   compatibility, conformance, and specification–implementation
   inconsistency;
2. what research has studied API evolution and breaking changes;
3. how REST APIs have been tested, including schema-based and
   consumer-oriented approaches;
4. what work concerns runtime validation in TypeScript/JavaScript
   applications; and
5. what study designs, systems, datasets, measures, and limitations are
   reported.

These are literature-mapping questions, not the empirical research questions
for a later study. This protocol does not answer them.

## 3. Scope and working terminology

The following are **search and screening concepts**, not final operational
definitions. Record the terminology used by each source in its own words and
with a page, section, or other locator.

| Working concept | Initial scope for searching | Important distinction to preserve |
|---|---|---|
| API contract | A machine-readable or otherwise stated interface, schema, behavior, or compatibility expectation between API providers and consumers | A contract may describe structure, behavior, semantics, or several of these; do not assume one definition |
| Contract drift | A candidate label for a divergence over time or between a documented/expected API contract and observed API behavior or data | Do not assume every API change is drift, or that drift has a single accepted definition |
| API evolution / breaking change | Changes to an API and their possible effects on clients, compatibility, or versioning | Distinguish provider change from a demonstrated consumer break |
| Specification–implementation inconsistency | A mismatch between an API specification and the implementation or observed interface | Distinguish static specification comparison from runtime observation |
| REST API testing | Automated or manual evaluation of REST API behavior, structure, or quality | Record the test objective, oracle, inputs, and whether a specification is used |
| Contract testing | Testing compatibility against an agreed contract, including provider/consumer expectations where applicable | Do not equate every schema test with consumer-driven contract testing |
| Runtime validation | Execution-time checks of values or messages against schemas or constraints | Distinguish validation from compile-time TypeScript checking |
| TypeScript-based application | A web application with TypeScript in an API provider, consumer, or both | Record the actual language/tool context; do not infer TypeScript use from JavaScript alone |

### 3.1 Topical coverage

Search five overlapping areas:

- **A — API evolution and breaking changes**
- **B — API specification–implementation inconsistency, conformance, and drift**
- **C — REST API testing**
- **D — API contract and consumer-driven testing**
- **E — TypeScript/JavaScript runtime validation and schema validation**

Include cross-area work when it informs the review, even if it is not framed
using the exact phrase “contract drift.” Keep the area tags on each record so
the evidence map can show overlap without double-counting unique studies.

## 4. Search sources and their roles

Search each source where access is available and record the interface actually
used. These are planned sources, not sources already searched.

| Source | Planned role | Interpretation / limitation to record |
|---|---|---|
| IEEE Xplore | Discovery of software engineering, testing, and systems publications | Record search fields, filters, and export limits |
| ACM Digital Library | Discovery of computing research publications | Record search fields, filters, and export limits |
| Scopus | Cross-disciplinary indexed discovery and citation metadata | Record coverage/access limits and exact query syntax |
| Web of Science | Cross-disciplinary indexed discovery and citation metadata | Record collection/index selection and exact query syntax |
| SpringerLink | Publisher-platform discovery and full-text access where available | A publisher platform is not, by itself, a comprehensive bibliographic index |
| ScienceDirect | Publisher-platform discovery and full-text access where available | A publisher platform is not, by itself, a comprehensive bibliographic index |
| DBLP | Bibliographic discovery and metadata cross-checking for computing publications | Treat records as discovery/metadata leads; inspect the official publication source for content and publication details |
| Google Scholar | Supplementary discovery and forward-citation searching | Record query, date, sort mode, and the last result inspected; ranking and coverage can change |
| Relevant preprint repositories, including arXiv and engrXiv where relevant | Supplementary discovery of non-peer-reviewed manuscripts | Label preprints as preprints unless a peer-reviewed version is independently verified; link versions |
| OpenAlex | Supplementary bibliographic discovery and metadata cross-checking | Added by protocol amendment A001; not a replacement for the specified databases |
| Crossref API | DOI and bibliographic metadata verification; supplementary discovery leads | Metadata is not evidence of peer review, relevance, or full-text inspection |
| Publisher pages, DOI records, and official proceedings pages | Verification of identity, venue, DOI, and publication status | Verification sources; not a substitute for recording where the item was discovered |

Do not treat all platforms as equivalent databases. Record discovery source
separately from the authoritative verification source. If an interface is
unavailable, requires inaccessible subscription access, or does not support a
planned query, log the limitation rather than implying it was searched.

## 5. Publication date range and language

- **Publication years:** No lower publication-year cutoff is imposed in the
  initial protocol. Search from each platform's available coverage start
  through the actual final search date. This is intended to avoid discarding
  potentially foundational work by an arbitrary year boundary.
- **Search cutoff:** The protocol was prepared on **2026-11-10**. This is not a
  search date. For each executed search, record its actual date and time. The
  review's cutoff is the date of the final documented search, not the protocol
  preparation date.
- **Future-dated work:** Do not include material that was not publicly
  available on the date it was searched. For online-first and issue
  publication dates that differ, retain both if reported and use the
  publisher's stated bibliographic record.
- **Language:** English-language full texts are eligible for detailed
  extraction. A non-English source may be retained as a lead; include it in
  detailed synthesis only if a reliable translation is available and the
  translation method is documented. Record this as a language constraint and
  potential bias.
- **No post hoc date filters:** Any later date or language restriction requires
  a dated protocol amendment with rationale before it is applied.

## 6. Proposed search strategy

### 6.1 Search construction

Combine concept blocks as appropriate to the source:

1. API/interface terms: `API`, `"web API"`, `REST`, `RESTful`,
   `microservice`;
2. change/consistency terms: `evolution`, `"breaking change"`, compatibility,
   drift, conformance, mismatch, inconsistency, specification;
3. testing terms: `"API testing"`, `"contract testing"`,
   `"consumer-driven"`, validation, schema, OpenAPI, `"JSON Schema"`; and
4. ecosystem terms: TypeScript, JavaScript, runtime, client, consumer.

Use the query set below as the **initial candidate set**. Adapt only as
required by the platform's documented query syntax or field limits. Record
both the planned query ID and the exact query actually submitted, including
every adaptation. Do not silently add filters, change phrases, or limit result
sets.

### 6.2 Candidate queries — not yet run

Search each area separately first, then use relevant combinations to improve
recall. The Boolean notation is conceptual and must be adapted and logged for
each platform.

**A-Q1. API evolution and breaking changes**

```text
("web API" OR "REST API" OR "RESTful API") AND
(evolution OR "breaking change" OR compatibility OR versioning OR migration)
```

**A-Q2. API evolution and consumer compatibility**

```text
("REST API" OR "web API") AND
("breaking change" OR incompatibility OR "compatibility regression") AND
(client OR consumer)
```

**B-Q1. API contract drift terminology**

```text
("API contract drift" OR "API drift" OR "contract drift") AND
(API OR "web API" OR REST)
```

**B-Q2. API specification and implementation agreement**

```text
(API OR "web API" OR REST) AND
(specification OR OpenAPI OR Swagger OR schema) AND
(implementation OR conformance OR inconsistency OR mismatch OR divergence)
```

**C-Q1. REST API testing**

```text
("REST API" OR RESTful) AND
(testing OR "test generation" OR "automated testing" OR fuzzing)
```

**C-Q2. REST API specification-based testing**

```text
("REST API testing" OR "RESTful API testing") AND
(schema OR specification OR oracle OR coverage OR automated)
```

**D-Q1. Contract and consumer-driven testing**

```text
("contract testing" OR "consumer-driven contract testing") AND
(API OR REST OR microservice)
```

**D-Q2. Provider/consumer contracts**

```text
("consumer contract" OR "provider contract") AND
(testing OR verification OR compatibility)
```

**E-Q1. TypeScript/JavaScript runtime and schema validation**

```text
(TypeScript OR JavaScript) AND
("runtime validation" OR "runtime type checking" OR "schema validation") AND
(API OR JSON OR client OR response)
```

**E-Q2. TypeScript/JavaScript API specification validation**

```text
(TypeScript OR JavaScript) AND
(OpenAPI OR "JSON Schema" OR schema) AND
(validation OR conformance OR API)
```

**X-Q1. Cross-area combination**

```text
("API contract" OR "API schema" OR OpenAPI OR "JSON Schema") AND
(drift OR evolution OR compatibility OR conformance OR mismatch) AND
(testing OR validation OR TypeScript OR JavaScript)
```

### 6.3 Platform-specific execution notes

- **Scopus:** Map the concept blocks to supported title/abstract/keyword
  fields; preserve the exact submitted fielded query and any document-type,
  language, or year filters.
- **Web of Science:** Map the concept blocks to the selected collection's
  supported topic fields; record collection, field tags, and filters.
- **IEEE Xplore and ACM Digital Library:** Use the nearest available
  metadata/full-text fields supported by each interface; record the exact
  submitted text and field selection.
- **SpringerLink and ScienceDirect:** Search within the available metadata or
  full-text options; state which option was used, because retrieval scope may
  differ.
- **DBLP:** Use supported title/author/venue discovery and citation links.
  Since metadata may not expose all query concepts, record it as a
  supplementary discovery route and verify candidate relevance from the
  official paper record or full text.
- **Google Scholar:** Run the planned concepts as separate searches where
  necessary. Record exact query, date, sort mode, number of result pages/items
  inspected, and stopping point. Do not describe a partial inspection as an
  exhaustive search.
- **Preprint repositories:** Search supported metadata fields and subject
  categories. Record repository, query, filters, version/date, and any
  peer-reviewed counterpart found.

If a platform rejects a query, document the rejection and revised query as
separate entries. Save exports in a dated, access-controlled location when
permitted; do not redistribute publisher content in violation of licence or
terms.

## 7. Eligibility criteria

Apply the criteria at title/abstract and full-text screening. The criterion
being assessed and evidence for the decision must be recorded. A source may be
relevant to multiple topical areas.

### 7.1 Include for detailed review when

1. The source addresses at least one of the five topical areas in Section 3.1
   or presents foundational methods directly applicable to API evolution,
   API testing, contracts, conformance, or runtime validation.
2. The system or artifact concerns software APIs, web services, REST/HTTP
   APIs, API specifications, API clients/providers, or relevant
   TypeScript/JavaScript validation practices.
3. The source is an identifiable scholarly contribution (e.g., peer-reviewed
   empirical/conceptual research, review, or tool paper), or is explicitly
   labelled as a preprint/grey-literature/contextual source and its role is
   kept separate from peer-reviewed evidence.
4. Bibliographic identity can be checked against a publisher, proceedings,
   DOI, repository, or other authoritative record.
5. Sufficient content is accessible to assess the intended contribution.
   If only an abstract is available, retain the record and screening status,
   but do not claim full-text review or extract unobserved methods/results.

### 7.2 Exclude from detailed evidence synthesis when

- the work is unrelated to software API contracts, change, conformance,
  testing, or runtime validation after full-text inspection;
- the item is a duplicate record without unique content (link it to the
  retained version);
- it is non-scholarly promotional material or its bibliographic identity
  cannot be verified;
- it is an announcement, tutorial, product page, or opinion piece without
  research evidence (it may be retained as contextual material if relevant);
- it contains insufficient accessible content for the claim being considered;
  mark `full text unavailable` or `abstract only` rather than silently
  deleting the record; or
- it fails a predeclared criterion, with a specific reason recorded.

Do not exclude a source because its results are null, negative, inconvenient,
or inconsistent with an expected outcome. Do not exclude a study merely
because it does not use TypeScript; broader work may inform API evolution or
testing and should be tagged by implementation context.

### 7.3 Publication-status categories

Record publication status independently from relevance:

- peer-reviewed journal article;
- peer-reviewed conference/workshop paper;
- book/chapter or other scholarly publication (describe the type);
- preprint, with repository and version;
- thesis/dissertation;
- technical report or other grey literature;
- status unclear / verification pending.

Where a preprint and peer-reviewed paper are versions of the same work, link
both records, identify the version used for extraction, and avoid counting
them as independent studies. Grey literature and preprints may inform
terminology or lead discovery but must not be presented as peer-reviewed
evidence.

## 8. Source verification and quality appraisal

Assess relevance, publication status, and methodological credibility as
separate dimensions. Do not create a single numerical quality score or infer
quality solely from venue prestige or indexing.

For each retained source, record:

1. **Identity and provenance:** exact title, author list, year, venue, DOI
   where assigned, official/publisher URL, source type, version, and the
   authoritative page used for verification.
2. **Publication status:** evidence for peer-review/publication status where
   available; otherwise use `unclear` and describe the limitation.
3. **Research transparency:** stated problem/objectives, research design,
   context, selection/sampling, artifact/data provenance, analysis procedures,
   and evaluation measures.
4. **Evidence traceability:** whether claims can be tied to reported data,
   tables, figures, or clearly described reasoning; capture a locator for
   extracted findings.
5. **Reproducibility detail:** availability/description of artifacts, data,
   tools, versions, and procedures; record unavailable items rather than
   assuming they do not exist.
6. **Limitations and risks:** limitations acknowledged by authors, plausible
   scope limitations, threats to validity, and reported funding/conflicts
   where available.
7. **Review-method quality:** for review papers, record the search sources,
   query/date information, eligibility, screening, extraction, and synthesis
   method reported by the authors.
8. **Contribution type:** empirical study, systematic/structured review,
   tool/technique, benchmark, conceptual/foundational work, or other—based on
   the paper's content, not title alone.

Use `adequate`, `partially reported`, `not reported`, `not applicable`, or
`unclear`, with a short evidence note. These labels support transparent
appraisal; they are not validated scores and must not be summed into a ranking.
Preserve methodologically weak or conflicting work when relevant and explain
its limitations.

## 9. Search, screening, and extraction procedure

1. **Freeze the reviewed protocol version.** The researcher approved protocol
   version 1.0 on 2026-11-10. Record the supervisor-feedback status and any
   protocol amendments before applying them. Version 1.1 records the
   supplementary OpenAlex discovery route; the requested database searches
   remain outstanding.
2. **Run each planned query** on each accessible source. Assign a unique
   `search_id`; log platform, date/time/time zone, exact query, fields,
   filters, coverage, result count, export count, access limitations, and
   filename for any permitted export.
3. **Retain raw exports** unmodified where licensing and access rules permit.
   Record normalization or deduplication actions separately. Do not store
   credentials or restricted full texts in the public repository.
4. **Create one source record per bibliographic item.** Assign a stable
   `source_id`. Preserve the original metadata and store normalized fields
   separately where needed.
5. **Deduplicate conservatively.** Match DOI first when available, then
   normalized title and author/year. Manually check near-matches. Link
   preprint, conference, journal, correction, and expanded versions; do not
   merge records until identity is confirmed.
6. **Screen titles and abstracts** against the eligibility criteria. Use
   `include`, `exclude`, or `unclear`; record a reason code and a short
   justification for every exclusion and uncertainty.
7. **Retrieve and screen full texts** for `include` and `unclear` records.
   Log unavailable texts and the attempts made. Full-text exclusion requires
   a specific reason.
8. **Resolve screening uncertainty.** If only one reviewer is available,
   record that the researcher made the decision and, when feasible, ask a
   supervisor/second reader to check a sample or disputed records. Report
   single-reviewer screening as a limitation; do not imply independent
   duplicate screening if it did not occur.
9. **Verify bibliographic details** against publisher/proceedings pages,
   DOI records, or official repositories. Record verification status and
   discrepancies; never infer a DOI.
10. **Extract evidence** only from inspected text. Record access level
    (`full text`, `abstract only`, `metadata only`), exact source locator,
    verbatim notes only where brief and necessary, and separate paraphrase
    from interpretation.
11. **Quality-appraise** using Section 8 and the paper evaluation matrix.
    Keep relevance, quality, and publication status distinct.
12. **Reconcile counts** for records found, duplicates, title/abstract
    decisions, full-text decisions, included sources, and unresolved items.
    Explain differences between platform result counts and exported records.
13. **Report search completeness honestly.** State sources searched, exact
    cutoff date, query adaptations, access constraints, and any partial
    result inspection. Do not call the review complete or systematic unless
    the executed methods and reporting justify that description.

### 9.1 Screening reason codes

Use one primary reason per exclusion and add details in the notes field:

| Code | Meaning |
|---|---|
| `E1` | Out of topic / no relevant API or research-area connection |
| `E2` | Wrong artifact/context after full-text assessment |
| `E3` | Non-scholarly or unsupported material (retain separately only if contextually useful) |
| `E4` | Duplicate/version record; point to retained source ID |
| `E5` | Essential identity cannot be verified |
| `E6` | Insufficient accessible content for detailed assessment |
| `E7` | Other predeclared eligibility criterion not met; explain |
| `U1` | Unclear; requires full text, verification, or second opinion |

Do not use `E6` to erase the discovery record: keep its source and search-log
entries, mark the access limitation, and avoid treating the source as
fully-reviewed evidence.

## 10. Data-management templates

Use the CSV files in `data/` as blank templates:

- [`search-log.csv`](../data/search-log.csv) — one row per executed database
  query; the candidate queries in this protocol are not execution records.
- [`screening-log.csv`](../data/screening-log.csv) — source decisions by
  screening stage, including exclusions and unresolved records.
- [`paper-evaluation-matrix.csv`](../data/paper-evaluation-matrix.csv) — one
  row per distinct scholarly work/version selected for evaluation.
- [`terminology-log.csv`](../data/terminology-log.csv) — source-grounded
  definitions, variants, and unresolved terminology.
- [`protocol-amendments.csv`](../data/protocol-amendments.csv) — dated
  changes to the protocol, including the rationale and affected records.

Use UTF-8, ISO 8601 dates (`YYYY-MM-DD`; include time-zone offset for
timestamps), stable IDs, and quoted CSV fields where commas or newlines occur.
Leave unknown fields blank or enter `Not reported` only after checking the
source. Never fill a template with guessed metadata or findings. Keep licensed
exports and full-text PDFs outside the public repository unless redistribution
is explicitly permitted.

## 11. Terminology and evidence synthesis plan

For every key term, record the source's exact label, definition or stated
meaning, locator, context, and whether the term is used synonymously or
differently from other sources. Keep the project's working definition in a
separate column from source-reported definitions. Resolve inconsistencies by
documenting competing uses; do not silently force a single definition.

After screening and extraction, organize the evidence by the five topical
areas and by contribution/method type. Compare contexts, definitions, data,
measures, evaluation approaches, findings, and limitations. Track each
synthesis statement to one or more verified source IDs and precise locators.
Label statements as:

- **reported evidence** — what a cited source explicitly states or measures;
- **reviewer synthesis** — a comparison or interpretation grounded in cited
  records; or
- **open question** — an unresolved issue requiring further evidence.

This protocol does not authorize a research-gap claim. Gap assessment belongs
after source collection, screening, and evidence synthesis, with the search
scope and limitations stated.

## 12. Anticipated biases and mitigation

| Potential bias / limitation | Risk | Planned mitigation and reporting |
|---|---|---|
| Database coverage and indexing | Relevant venues or older work may not be indexed uniformly | Search the planned academic indexes and publisher platforms; use DBLP/citation chasing as supplementary routes; report each source and inaccessible coverage |
| Search-term bias | Papers may discuss the concepts without using “contract drift” or “TypeScript” | Search related concepts (evolution, breaking changes, conformance, inconsistency, testing, schemas); pilot and revise queries only through logged amendments |
| Platform query/ranking behavior | Different fields, ranking, and search syntax affect what is retrieved | Preserve exact platform queries, field choices, filters, date, and inspected stopping point |
| Publication and positive-result bias | Published work may overrepresent positive results | Retain null, negative, and conflicting findings; record preprints separately and do not treat them as equivalent to peer-reviewed work |
| Language bias | English-only detailed extraction may omit relevant work | Permit translated texts when reliable and feasible; record language and translation; disclose remaining constraint |
| Full-text availability bias | Accessible studies may be overrepresented | Keep inaccessible records in the log, record access attempts, do not claim full-text screening, and avoid treating abstract-only claims as fully verified |
| Reviewer selection/extraction bias | A single undergraduate reviewer may misclassify or selectively interpret sources | Use explicit criteria and reason codes; maintain locator-level evidence; seek supervisor/second-reader checks where feasible and report actual reviewer count |
| Citation and snowballing bias | Backward/forward citation searches favor already connected or highly cited work | Log citation chasing separately, combine with database queries, and do not use citation counts as quality measures |
| Venue and publication-status bias | Venue prestige or indexing may be mistaken for methodological quality | Appraise method transparency separately from venue; verify status and label preprints/grey literature |
| Version and duplicate bias | Preprints and later publications can be counted as separate studies | Link versions, compare content, choose an extraction version, and count distinct studies rather than duplicate records |
| Technology-label bias | TypeScript-specific terminology may hide relevant JavaScript or language-independent API work | Search broader API methods; tag implementation language based on evidence; avoid extrapolating non-TypeScript results as TypeScript findings |
| Recency and database-update bias | Search results change and recent work may be incompletely indexed | Date-stamp each search and run a documented update before closing the review; report the final cutoff |

## 13. Protocol amendments and audit trail

Do not silently alter criteria, date ranges, query scope, or screening rules.
For each change, record amendment ID, date, protocol version, previous rule,
new rule, rationale, whether it was decided before or after seeing results,
and affected search/source IDs. Preserve earlier records and identify the
version used for each decision.

## 14. Phase 1 completion criteria and approval gate

The strategy phase is ready for review when:

- the scope and working terminology are documented;
- the planned search sources and five topical areas are specified;
- proposed queries and platform adaptation rules are recorded;
- date/language boundaries, eligibility, source-quality appraisal, and
  screening steps are specified;
- blank search, screening, paper-evaluation, and terminology templates are
  present; and
- anticipated biases and protocol amendments are documented.

Completion of this protocol **does not mean the literature has been searched,
screened, or synthesized**. The researcher approved the protocol on
2026-11-10 and authorized Phase 2. Supervisor feedback has not been recorded.
Phase 2 is in progress; do not begin Phase 3 until the screened literature is
reviewed and the researcher explicitly approves the next phase.
