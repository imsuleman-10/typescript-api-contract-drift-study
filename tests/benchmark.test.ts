import { describe, it, expect } from "vitest";
import { BenchmarkEngine } from "../src/engine/benchmark-engine.js";

describe("Benchmark Engine", () => {
  it("should execute full evaluation and return populated scenarios, latency metrics, and summary", () => {
    const engine = new BenchmarkEngine();
    const results = engine.runFullEvaluation();

    // 4 domains * 24 mutations * 6 strategies = 576 scenario evaluations
    expect(results.scenarioResults.length).toBe(576);

    // 4 domains * 6 strategies = 24 latency metrics
    expect(results.latencyMetrics.length).toBe(24);

    expect(results.summary.domainsEvaluated).toHaveLength(4);
    expect(results.summary.strategiesEvaluated).toHaveLength(6);

    // Static TypeScript recall must be 0%
    expect(results.summary.overallRecallByStrategy["Static TypeScript (Compile-Time Only)"]).toBe(0);

    // Runtime validators should achieve high recall (> 75%)
    expect(results.summary.overallRecallByStrategy["Zod Runtime Schema Validation"]).toBeGreaterThan(75);
    expect(results.summary.overallRecallByStrategy["TypeBox (Compiled JSON Schema)"]).toBeGreaterThan(75);
    expect(results.summary.overallRecallByStrategy["Valibot Modular Validation"]).toBeGreaterThan(75);
    expect(results.summary.overallRecallByStrategy["OpenAPI 3.1 Specification Validation"]).toBeGreaterThan(75);
  });
});
