import { BENCHMARK_DOMAINS, DomainContractBundle } from "../contracts/index.js";
import { DRIFT_TAXONOMY } from "../taxonomy/drift-taxonomy.js";
import { applyDriftMutation } from "../mutator/drift-mutator.js";
import { getAllStrategies } from "../strategies/index.js";
import {
  BenchmarkScenarioResult,
  LatencyMetric,
  ExperimentSummary,
  StrategyValidationResult
} from "../types/index.js";

export function computeDiagnosticScore(result: StrategyValidationResult): number {
  if (result.isValid || result.diagnostics.length === 0) {
    return 0;
  }

  let totalScore = 0;
  for (const diag of result.diagnostics) {
    let score = 0;
    // 1. Path pinpointing
    if (diag.path && diag.path !== "root") score += 0.35;
    else if (diag.path === "root") score += 0.15;

    // 2. Disambiguation of expected vs received
    if (diag.expected || diag.received) score += 0.35;

    // 3. Clear actionable message
    if (diag.isActionable && diag.message.length > 5) score += 0.30;

    totalScore += score;
  }

  return Math.min(1.0, totalScore / result.diagnostics.length);
}

export interface ExperimentResults {
  scenarioResults: BenchmarkScenarioResult[];
  latencyMetrics: LatencyMetric[];
  summary: ExperimentSummary;
}

export class BenchmarkEngine {
  public runFullEvaluation(): ExperimentResults {
    const strategies = getAllStrategies();
    const scenarioResults: BenchmarkScenarioResult[] = [];

    // 1. Scenario Accuracy Evaluation
    for (const [domainName, domainBundle] of Object.entries(BENCHMARK_DOMAINS)) {
      for (const [mutationCode, def] of Object.entries(DRIFT_TAXONOMY)) {
        const mutation = applyDriftMutation(domainName, domainBundle.baseline, mutationCode);

        for (const strategy of strategies) {
          const valResult = strategy.validate(domainBundle, mutation.mutatedPayload);

          const expectedDetection = def.expectedDetection;
          const actualDetection = valResult.detectedDrift;

          const isTruePositive = expectedDetection && actualDetection;
          const isTrueNegative = !expectedDetection && !actualDetection;
          const isFalsePositive = !expectedDetection && actualDetection;
          const isFalseNegative = expectedDetection && !actualDetection;

          const diagnosticScore = computeDiagnosticScore(valResult);

          scenarioResults.push({
            scenarioCode: mutationCode,
            scenarioName: def.name,
            domain: domainName,
            dimension: def.dimension,
            severity: def.severity,
            strategyName: strategy.name,
            expectedDetection,
            actualDetection,
            isTruePositive,
            isTrueNegative,
            isFalsePositive,
            isFalseNegative,
            executionTimeUs: Number(valResult.executionTimeUs.toFixed(3)),
            diagnosticScore: Number(diagnosticScore.toFixed(3)),
            diagnosticSummary: valResult.errorSummary || "Passed (No drift flagged)"
          });
        }
      }
    }

    // 2. Micro-benchmarking Latency Evaluation
    const latencyMetrics: LatencyMetric[] = [];
    const BENCHMARK_ITERATIONS = 1000;

    for (const [domainName, domainBundle] of Object.entries(BENCHMARK_DOMAINS)) {
      for (const strategy of strategies) {
        // Warmup
        for (let i = 0; i < 50; i++) {
          strategy.validate(domainBundle, domainBundle.baseline);
        }

        const timesUs: number[] = [];
        const startBatch = performance.now();
        for (let i = 0; i < BENCHMARK_ITERATIONS; i++) {
          const s = performance.now();
          strategy.validate(domainBundle, domainBundle.baseline);
          const e = performance.now();
          timesUs.push((e - s) * 1000);
        }
        const totalBatchMs = performance.now() - startBatch;

        timesUs.sort((a, b) => a - b);
        const meanUs = timesUs.reduce((acc, t) => acc + t, 0) / timesUs.length;
        const medianUs = timesUs[Math.floor(timesUs.length * 0.5)];
        const p90Us = timesUs[Math.floor(timesUs.length * 0.9)];
        const p99Us = timesUs[Math.floor(timesUs.length * 0.99)];
        const minUs = timesUs[0];
        const maxUs = timesUs[timesUs.length - 1];
        const throughputOpsPerSec = Math.round((BENCHMARK_ITERATIONS / totalBatchMs) * 1000);

        latencyMetrics.push({
          strategyName: strategy.name,
          domain: domainName,
          sampleSize: BENCHMARK_ITERATIONS,
          meanUs: Number(meanUs.toFixed(3)),
          medianUs: Number(medianUs.toFixed(3)),
          p90Us: Number(p90Us.toFixed(3)),
          p99Us: Number(p99Us.toFixed(3)),
          minUs: Number(minUs.toFixed(3)),
          maxUs: Number(maxUs.toFixed(3)),
          throughputOpsPerSec
        });
      }
    }

    // 3. Compute Aggregated Summary
    const overallRecallByStrategy: Record<string, number> = {};
    const falsePositiveRateByStrategy: Record<string, number> = {};
    const meanLatencyByStrategyUs: Record<string, number> = {};
    const meanDiagnosticScoreByStrategy: Record<string, number> = {};

    for (const strategy of strategies) {
      const records = scenarioResults.filter((r) => r.strategyName === strategy.name);
      const breakingRecords = records.filter((r) => r.expectedDetection === true);
      const nonBreakingRecords = records.filter((r) => r.expectedDetection === false);

      const truePositives = breakingRecords.filter((r) => r.isTruePositive).length;
      const recall = breakingRecords.length > 0 ? (truePositives / breakingRecords.length) * 100 : 0;
      overallRecallByStrategy[strategy.name] = Number(recall.toFixed(1));

      const falsePositives = nonBreakingRecords.filter((r) => r.isFalsePositive).length;
      const fpr = nonBreakingRecords.length > 0 ? (falsePositives / nonBreakingRecords.length) * 100 : 0;
      falsePositiveRateByStrategy[strategy.name] = Number(fpr.toFixed(1));

      const strategyLatencies = latencyMetrics.filter((l) => l.strategyName === strategy.name);
      const avgLatency =
        strategyLatencies.reduce((acc, l) => acc + l.meanUs, 0) / strategyLatencies.length;
      meanLatencyByStrategyUs[strategy.name] = Number(avgLatency.toFixed(2));

      const detectedBreaking = breakingRecords.filter((r) => r.isTruePositive);
      const avgDiag =
        detectedBreaking.length > 0
          ? detectedBreaking.reduce((acc, r) => acc + r.diagnosticScore, 0) / detectedBreaking.length
          : 0;
      meanDiagnosticScoreByStrategy[strategy.name] = Number(avgDiag.toFixed(2));
    }

    const summary: ExperimentSummary = {
      timestamp: new Date().toISOString(),
      totalScenariosEvaluated: scenarioResults.length,
      domainsEvaluated: Object.keys(BENCHMARK_DOMAINS),
      strategiesEvaluated: strategies.map((s) => s.name),
      overallRecallByStrategy,
      falsePositiveRateByStrategy,
      meanLatencyByStrategyUs,
      meanDiagnosticScoreByStrategy
    };

    return {
      scenarioResults,
      latencyMetrics,
      summary
    };
  }
}
