import { z } from "zod";
import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StrategyValidationResult, ValidationDiagnostic } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

/**
 * Zod Validation Strategy
 * Evaluates runtime payloads using Zod schema safeParse().
 */
export class ZodValidationStrategy implements IContractVerificationStrategy {
  public readonly name = "Zod Runtime Schema Validation";
  public readonly description =
    "Idiomatic TypeScript runtime schema parsing and constraint validation.";

  public validate(
    domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult {
    const schema = domainBundle.zodSchema as z.ZodTypeAny;

    const start = performance.now();
    const result = schema.safeParse(payload);
    const end = performance.now();
    const executionTimeUs = (end - start) * 1000;

    if (result.success) {
      return {
        strategyName: this.name,
        isValid: true,
        detectedDrift: false,
        diagnostics: [],
        executionTimeUs
      };
    }

    const diagnostics: ValidationDiagnostic[] = result.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      const issueObj = issue as unknown as Record<string, unknown>;
      const expected = "expected" in issueObj ? String(issueObj.expected) : undefined;
      const received = "received" in issueObj ? String(issueObj.received) : undefined;

      return {
        path,
        message: issue.message,
        expected,
        received,
        isActionable: true
      };
    });

    return {
      strategyName: this.name,
      isValid: false,
      detectedDrift: true,
      diagnostics,
      executionTimeUs,
      errorSummary: result.error.issues.map((i) => `[${i.path.join(".")}] ${i.message}`).join("; ")
    };
  }
}
