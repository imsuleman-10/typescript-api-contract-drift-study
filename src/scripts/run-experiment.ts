import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BenchmarkEngine } from "../engine/benchmark-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../");

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function runExperiment() {
  console.log("================================================================================");
  console.log("    EMPIRICAL STUDY: API CONTRACT DRIFT IN TYPESCRIPT-BASED WEB APPLICATIONS    ");
  console.log("    Lead Researcher: Suleman Zaheer | University of Engineering and Technology   ");
  console.log("================================================================================\n");

  console.log("[1/4] Initializing Benchmark Engine...");
  const engine = new BenchmarkEngine();

  console.log("[2/4] Executing Drift Taxonomy Benchmark across 4 Real-World API Domains...");
  const results = engine.runFullEvaluation();
  console.log(`      -> Evaluated ${results.scenarioResults.length} total test scenario combinations.`);
  console.log(`      -> Executed micro-benchmark latency profiles (1,000 iterations per strategy).`);

  const resultsDir = path.join(projectRoot, "data", "results");
  ensureDirectoryExists(resultsDir);

  console.log("[3/4] Exporting empirical results to CSV and JSON formats...");

  // 1. Export scenario results CSV
  const scenarioHeaders = [
    "scenario_code",
    "scenario_name",
    "domain",
    "dimension",
    "severity",
    "strategy_name",
    "expected_detection",
    "actual_detection",
    "is_true_positive",
    "is_true_negative",
    "is_false_positive",
    "is_false_negative",
    "execution_time_us",
    "diagnostic_score",
    "diagnostic_summary"
  ];

  const scenarioRows = results.scenarioResults.map((r) =>
    [
      escapeCsv(r.scenarioCode),
      escapeCsv(r.scenarioName),
      escapeCsv(r.domain),
      escapeCsv(r.dimension),
      escapeCsv(r.severity),
      escapeCsv(r.strategyName),
      escapeCsv(r.expectedDetection),
      escapeCsv(r.actualDetection),
      escapeCsv(r.isTruePositive),
      escapeCsv(r.isTrueNegative),
      escapeCsv(r.isFalsePositive),
      escapeCsv(r.isFalseNegative),
      escapeCsv(r.executionTimeUs),
      escapeCsv(r.diagnosticScore),
      escapeCsv(r.diagnosticSummary)
    ].join(",")
  );

  const scenarioCsv = [scenarioHeaders.join(","), ...scenarioRows].join("\n");
  const scenarioCsvPath = path.join(resultsDir, "drift-detection-matrix.csv");
  fs.writeFileSync(scenarioCsvPath, scenarioCsv, "utf8");
  console.log(`      -> Saved: ${path.relative(projectRoot, scenarioCsvPath)}`);

  // 2. Export latency benchmark CSV
  const latencyHeaders = [
    "strategy_name",
    "domain",
    "sample_size",
    "mean_us",
    "median_us",
    "p90_us",
    "p99_us",
    "min_us",
    "max_us",
    "throughput_ops_per_sec"
  ];

  const latencyRows = results.latencyMetrics.map((l) =>
    [
      escapeCsv(l.strategyName),
      escapeCsv(l.domain),
      escapeCsv(l.sampleSize),
      escapeCsv(l.meanUs),
      escapeCsv(l.medianUs),
      escapeCsv(l.p90Us),
      escapeCsv(l.p99Us),
      escapeCsv(l.minUs),
      escapeCsv(l.maxUs),
      escapeCsv(l.throughputOpsPerSec)
    ].join(",")
  );

  const latencyCsv = [latencyHeaders.join(","), ...latencyRows].join("\n");
  const latencyCsvPath = path.join(resultsDir, "performance-benchmarks.csv");
  fs.writeFileSync(latencyCsvPath, latencyCsv, "utf8");
  console.log(`      -> Saved: ${path.relative(projectRoot, latencyCsvPath)}`);

  // 3. Export summary JSON
  const summaryJsonPath = path.join(resultsDir, "experiment-summary.json");
  fs.writeFileSync(summaryJsonPath, JSON.stringify(results.summary, null, 2), "utf8");
  console.log(`      -> Saved: ${path.relative(projectRoot, summaryJsonPath)}`);

  console.log("\n[4/4] EMPIRICAL EVALUATION SUMMARY RESULTS:\n");
  console.log("+------------------------------------------+------------+------------+---------------+------------------+------------------+");
  console.log("| Strategy Name                            | Recall (%) | FPR (%)    | Mean Lat (us) | Throughput (op/s)| Diagnostic Score |");
  console.log("+------------------------------------------+------------+------------+---------------+------------------+------------------+");

  for (const strategy of results.summary.strategiesEvaluated) {
    const recall = results.summary.overallRecallByStrategy[strategy] ?? 0;
    const fpr = results.summary.falsePositiveRateByStrategy[strategy] ?? 0;
    const lat = results.summary.meanLatencyByStrategyUs[strategy] ?? 0;
    const diag = results.summary.meanDiagnosticScoreByStrategy[strategy] ?? 0;

    const stratLat = results.latencyMetrics.filter((l) => l.strategyName === strategy);
    const avgThroughput = Math.round(
      stratLat.reduce((acc, l) => acc + l.throughputOpsPerSec, 0) / (stratLat.length || 1)
    );

    const nameCol = strategy.padEnd(40);
    const recallCol = `${recall.toFixed(1)}%`.padStart(10);
    const fprCol = `${fpr.toFixed(1)}%`.padStart(10);
    const latCol = `${lat.toFixed(1)} us`.padStart(13);
    const thrCol = `${avgThroughput.toLocaleString()} op/s`.padStart(16);
    const diagCol = `${(diag * 100).toFixed(0)}% (${diag.toFixed(2)})`.padStart(16);

    console.log(`| ${nameCol} | ${recallCol} | ${fprCol} | ${latCol} | ${thrCol} | ${diagCol} |`);
  }
  console.log("+------------------------------------------+------------+------------+---------------+------------------+------------------+\n");

  console.log("SUCCESS: Empirical experiment completed successfully.");
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].includes("run-experiment")) {
  runExperiment();
}
