# Phase 4 — Experimental Methodology and Design Specification

**Project:** Investigating API Contract Drift in TypeScript-Based Web Applications  
**Researcher:** Suleman Zaheer, Undergraduate Computer Science, University of Engineering and Technology, Lahore  
**Protocol Version:** 1.2 (Amended under A002)  
**Status:** Approved Methodology Specification (Phase 4 Complete)  
**Date:** 2026-11-12  

---

## 1. Introduction and Methodological Overview

This document specifies the empirical methodology, formal mathematical models, taxonomy of contract mutations, benchmark architecture, and evaluation metrics designed to resolve the research questions established in Phase 3 (RQ1–RQ4).

The goal of this study is to perform a controlled, reproducible, and quantitative evaluation of how effectively different TypeScript contract verification strategies prevent, detect, or mitigate API contract drift across web application network boundaries, and at what computational and developer ergonomics costs.

---

## 2. Formalization of API Contracts and Contract Drift

### 2.1 Formal Definition of an API Contract
We formalize an API Contract $C$ as a tuple:

$$C = \langle S, K, T, V, \Pi \rangle$$

Where:
- $S$: The structural schema defining the property key hierarchy $\mathcal{K} = \{k_1, k_2, \dots, k_n\}$ and nesting depth.
- $K$: The key requirement mapping $K: \mathcal{K} \to \{\text{Required}, \text{Optional}\}$.
- $T$: The scalar type mapping $T: \mathcal{K} \to \mathcal{T}$, where $\mathcal{T} = \{\text{string}, \text{number}, \text{boolean}, \text{object}, \text{array}, \text{null}\}$.
- $V$: The semantic constraints and boundary invariants, including numeric ranges $[x_{min}, x_{max}]$, string patterns (regex), string lengths, array cardinalities, and finite enum sets $\mathcal{E} \subset \mathcal{T}$.
- $\Pi$: Protocol-level metadata including HTTP status codes, headers (e.g., `Content-Type`), and encoding.

### 2.2 Formal Definition of API Contract Drift
Let $C_{expected}$ denote the agreed baseline contract between an API provider and consumer. Let $M$ denote a runtime network payload produced by the provider or submitted by a consumer, and let $C_{observed}$ denote the actual empirical contract embodied by $M$.

**API Contract Drift** occurs when:

$$\Delta(C_{expected}, C_{observed}) \neq \emptyset$$

A drift transformation $\delta \in \Delta$ is classified into two severity categories:
1. **Breaking Drift ($\delta_{break}$):** An alteration that violates consumer assumptions, causing unhandled exceptions, incorrect data processing, or silent state corruption in clients relying on $C_{expected}$.
2. **Non-Breaking Evolution ($\delta_{evolve}$):** An additive or relaxing alteration that maintains backward compatibility under Postel's Robustness Principle ("be conservative in what you do, be liberal in what you accept").

---

## 3. Comprehensive Taxonomy of API Contract Drift

Based on canonical software engineering taxonomies (Linares-Vásquez et al. S010, Wittern et al. S005, Zhang et al. S020) and real-world Web API failure modes, we define a 24-class mutation taxonomy across six orthogonal dimensions:

```
+---------------------------------------------------------------------------------------------------------+
|                                    TAXONOMY OF API CONTRACT DRIFT                                       |
+--------------------------+------------------------------+---------------------------+-------------------+
| Dimension                | Mutation Code                | Description               | Severity Class    |
+--------------------------+------------------------------+---------------------------+-------------------+
| 1. Structural / Key      | STR-01: Remove Required Key  | Required property omitted | Breaking          |
|    Hierarchy             | STR-02: Rename Key           | Property renamed          | Breaking          |
|                          | STR-03: Add Unknown Key      | New unexpected key added  | Non-Breaking (Add)|
|                          | STR-04: Remove Nested Key    | Nested required field cut | Breaking          |
|                          | STR-05: Flatten Hierarchy    | Nested object inlined     | Breaking          |
+--------------------------+------------------------------+---------------------------+-------------------+
| 2. Scalar Type & Format  | TYP-01: Int to String        | Number encoded as string  | Breaking (Strict) |
|                          | TYP-02: String to Number     | String sent as numeric    | Breaking          |
|                          | TYP-03: Boolean to String    | Boolean sent as "true"    | Breaking (Strict) |
|                          | TYP-04: ISO Date to Epoch    | Date string to epoch ms   | Breaking (Semantic|
|                          | TYP-05: Scalar to Array      | Single value to list      | Breaking          |
|                          | TYP-06: Array to Scalar      | List sent as first elem   | Breaking          |
+--------------------------+------------------------------+---------------------------+-------------------+
| 3. Constraints & Range   | CST-01: Numeric Out of Bounds| Value exceeds max / min   | Breaking          |
|                          | CST-02: String Regex Fail    | Format violates pattern   | Breaking          |
|                          | CST-03: String Length Excess | String exceeds maxLength  | Breaking          |
|                          | CST-04: Array Underflow      | Length < minItems         | Breaking          |
|                          | CST-05: Empty String Sent    | Non-empty string sent ""  | Breaking          |
+--------------------------+------------------------------+---------------------------+-------------------+
| 4. Nullability & Optional| NUL-01: Required to Null     | Non-nullable becomes null | Breaking          |
|                          | NUL-02: Required to Undef    | Non-optional missing      | Breaking          |
|                          | NUL-03: Nullable to Null     | Nullable receiving null   | Non-Breaking      |
|                          | NUL-04: Optional Made Req    | Provider expects optional | Breaking          |
+--------------------------+------------------------------+---------------------------+-------------------+
| 5. Semantic & Enum Shift | ENM-01: Undocumented Variant | New unknown enum member   | Breaking          |
|                          | ENM-02: Enum Case Divergence | "ACTIVE" sent as "active" | Breaking (Strict) |
|                          | ENM-03: Deprecated Value     | Obsolete enum member sent | Breaking          |
+--------------------------+------------------------------+---------------------------+-------------------+
| 6. Protocol & Transport  | PRO-01: Status Code Mismatch | 200 returned with err body| Breaking          |
+--------------------------+------------------------------+---------------------------+-------------------+
```

---

## 4. Evaluated Verification Strategies

The benchmark executes every drift scenario against six distinct verification strategies spanning compile-time, runtime, and pre-deployment testing:

1. **`StaticTypeScriptStrategy` (Baseline):**  
   Represents idiomatic TypeScript compile-time type casting:
   ```typescript
   const payload = (await response.json()) as OrderResponse;
   ```
   *Hypothesis:* Erased completely at runtime; detects 0% of runtime contract drifts.

2. **`ZodValidationStrategy` (Idiomatic Runtime Schema Validation):**  
   Uses Zod schemas as the single source of truth (`z.infer<typeof schema>`):
   ```typescript
   const result = OrderSchema.safeParse(payload);
   ```
   *Hypothesis:* High detection recall for all type, constraint, nullability, and enum drifts; moderate latency overhead.

3. **`TypeBoxValidationStrategy` (High-Performance JSON Schema Compilation):**  
   Uses `@sinclair/typebox` to generate JSON Schema definitions compiled with AJV:
   ```typescript
   const isValid = compiledValidator.Check(payload);
   ```
   *Hypothesis:* Near-native execution speed with complete JSON Schema draft-7 / draft-2020-12 compliance.

4. **`ValibotValidationStrategy` (Lightweight Modular Schema Validation):**  
   Uses Valibot's modular, tree-shakeable functional validation:
   ```typescript
   const result = safeParse(OrderSchema, payload);
   ```
   *Hypothesis:* Favorable balance between small bundle footprint, low execution latency, and rich diagnostic errors.

5. **`OpenApiValidationStrategy` (Specification-Driven Gateway Validation):**  
   Validates payloads against an official OpenAPI 3.1 YAML/JSON specification document.
   *Hypothesis:* Accurate for schema conformance; sensitive to specification quality and schema drift.

6. **`ConsumerContractStrategy` (Consumer-Driven Contract Testing):**  
   Implements a consumer-oriented expectation matcher (Pact semantics) validating that provider responses satisfy the exact subset of properties consumed by the client application.
   *Hypothesis:* Robust detection of client-breaking changes while ignoring non-breaking additive fields (permissive to unknown keys).

---

## 5. Benchmark API Domains

To ensure ecological validity and avoid synthetic bias, the benchmark suite models four realistic, production-grade Web API domains:

1. **User Profile & Identity API (`UserProfile`):**  
   Models user management with nested addresses, ISO-8601 timestamps, role enums, and email regex constraints.
2. **E-Commerce Checkout & Order API (`OrderCheckout`):**  
   Complex domain featuring nested line items, decimal currency formatting, shipping address objects, and payment status states.
3. **Financial Payment Transaction API (`PaymentTransaction`):**  
   High-security financial domain with strict IBAN/card constraints, non-negative amounts, idempotent UUIDs, and zero tolerance for numeric coercion.
4. **IoT Sensor & Telemetry API (`DeviceTelemetry`):**  
   High-throughput streaming payload featuring coordinate arrays, floating-point sensor readings, hardware firmware strings, and battery percentages.

---

## 6. Experimental Pipeline and Evaluation Metrics

```
+---------------------------------------------------------------------------------------------------+
|                                  EMPIRICAL EXPERIMENT WORKFLOW                                    |
+---------------------------------------------------------------------------------------------------+
| [Baseline Contracts] ---> [Mutation Engine (24 Drift Classes)] ---> [Mutated Payloads]           |
|                                                                             |                     |
|                                                                             v                     |
|                                  [Verification Harness: 6 Strategies]                             |
|                                  - Static TypeScript Baseline                                     |
|                                  - Zod Schema Validation                                          |
|                                  - TypeBox Validation (AJV)                                       |
|                                  - Valibot Validation                                             |
|                                  - OpenAPI 3.1 Validator                                          |
|                                  - Consumer Contract (CDC)                                        |
|                                                                             |                     |
|                                                                             v                     |
|                                  [Evaluation & Telemetry Engine]                                  |
|                                  - Recall / Detection Rate (TPR)                                  |
|                                  - False Positive Rate (FPR)                                      |
|                                  - Latency Overhead (μs / op)                                     |
|                                  - Diagnostic Actionability ($D_Q$)                               |
|                                                                             |                     |
|                                                                             v                     |
|                                  [Structured Data Output]                                         |
|                                  - data/results/detection-results.csv                             |
|                                  - data/results/latency-benchmarks.csv                            |
|                                  - data/results/drift-taxonomy-summary.json                       |
+---------------------------------------------------------------------------------------------------+
```

### 6.1 Quantitative Metrics

1. **True Positive Rate (Recall / TPR):**
   $$\text{TPR} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Negatives}} = \frac{\text{Correctly Flagged Breaking Drifts}}{\text{Total Injected Breaking Drifts}}$$

2. **False Positive Rate (FPR / False Alarm Rate):**
   $$\text{FPR} = \frac{\text{False Positives}}{\text{False Positives} + \text{True Negatives}} = \frac{\text{Non-Breaking Additions Incorrectly Flagged as Errors}}{\text{Total Non-Breaking Evolutions}}$$

3. **Validation Latency ($L_{\mu s}$):**  
   The mean, median ($P_{50}$), and 99th percentile ($P_{99}$) execution time in microseconds required to validate a single payload, benchmarked over $N = 10,000$ warm iterations using high-resolution performance timers (`performance.now()`).

4. **Diagnostic Actionability Score ($D_Q \in [0, 1]$):**  
   A normalized score evaluating whether the strategy's error report satisfies three criteria:
   $$D_Q = \frac{1}{3} \cdot (\mathbb{I}_{\text{path}} + \mathbb{I}_{\text{type}} + \mathbb{I}_{\text{actionable}})$$
   - $\mathbb{I}_{\text{path}} = 1$ if the exact JSON path (e.g. `user.address.postalCode`) is pinpointed; $0$ otherwise.
   - $\mathbb{I}_{\text{type}} = 1$ if both expected and received types/values are disambiguated; $0$ otherwise.
   - $\mathbb{I}_{\text{actionable}} = 1$ if an explicit remediation message is provided; $0$ otherwise.

---

## 7. Threats to Validity and Control Measures

| Threat Type | Risk | Controlled Mitigation |
|:---|:---|:---|
| **Construct Validity** | Synthetic mutations may not reflect real drift | Grounded directly in ICSE/TOSEM empirical taxonomies (S010, S020). |
| **Internal Validity** | JIT warm-up and V8 engine optimization noise | Benchmark incorporates 1,000 warm-up cycles; micro-benchmarking repeats 10,000 runs with outlier trimming. |
| **External Validity** | Findings restricted to trivial toy schemas | Benchmark incorporates 4 diverse production-scale schemas with deep nesting, arrays, and constraints. |
| **Reliability** | Non-deterministic test runs | Fully deterministic seeded mutation generator and open-source automated replication script. |

---

*This specification completes Phase 4. Implementation will now proceed in Phase 5 under `src/`.*
