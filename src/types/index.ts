/**
 * Core type definitions for the API Contract Drift Study.
 * @author Suleman Zaheer <sulemanzaheer09@gmail.com>
 */

export type SeverityClass = "breaking" | "non-breaking" | "subtle";

export type TaxonomicDimension =
  | "structural"
  | "scalar_type"
  | "constraints"
  | "nullability"
  | "semantic_enum"
  | "protocol";

export interface DriftMutationDefinition {
  code: string;
  name: string;
  dimension: TaxonomicDimension;
  severity: SeverityClass;
  description: string;
  expectedDetection: boolean;
}

export interface ValidationDiagnostic {
  path: string;
  message: string;
  expected?: string;
  received?: string;
  isActionable: boolean;
}

export interface StrategyValidationResult {
  strategyName: string;
  isValid: boolean;
  detectedDrift: boolean;
  diagnostics: ValidationDiagnostic[];
  executionTimeUs: number; // Execution time in microseconds
  errorSummary?: string;
}

export interface BenchmarkScenarioResult {
  scenarioCode: string;
  scenarioName: string;
  domain: string;
  dimension: TaxonomicDimension;
  severity: SeverityClass;
  strategyName: string;
  expectedDetection: boolean;
  actualDetection: boolean;
  isTruePositive: boolean;
  isTrueNegative: boolean;
  isFalsePositive: boolean;
  isFalseNegative: boolean;
  executionTimeUs: number;
  diagnosticScore: number; // [0, 1]
  diagnosticSummary: string;
}

export interface LatencyMetric {
  strategyName: string;
  domain: string;
  sampleSize: number;
  meanUs: number;
  medianUs: number;
  p90Us: number;
  p99Us: number;
  minUs: number;
  maxUs: number;
  throughputOpsPerSec: number;
}

export interface ExperimentSummary {
  timestamp: string;
  totalScenariosEvaluated: number;
  domainsEvaluated: string[];
  strategiesEvaluated: string[];
  overallRecallByStrategy: Record<string, number>;
  falsePositiveRateByStrategy: Record<string, number>;
  meanLatencyByStrategyUs: Record<string, number>;
  meanDiagnosticScoreByStrategy: Record<string, number>;
}
