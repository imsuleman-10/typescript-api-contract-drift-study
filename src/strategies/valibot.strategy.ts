import * as v from "valibot";
import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StrategyValidationResult, ValidationDiagnostic } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

/**
 * Valibot Validation Strategy
 * Modular, lightweight schema validator.
 */
export class ValibotValidationStrategy implements IContractVerificationStrategy {
  public readonly name = "Valibot Modular Validation";
  public readonly description =
    "Lightweight, tree-shakeable schema validator with functional composition.";

  public validate(
    domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult {
    const schema = domainBundle.valibotSchema as v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

    const start = performance.now();
    const result = v.safeParse(schema, payload);
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

    const diagnostics: ValidationDiagnostic[] = (result.issues || []).map((issue) => {
      const pathSegments = (issue.path || [])
        .map((p) => (typeof p === "object" && p && "key" in p ? String(p.key) : ""))
        .filter(Boolean);
      const path = pathSegments.length > 0 ? pathSegments.join(".") : "root";

      return {
        path,
        message: issue.message,
        expected: issue.expected ? String(issue.expected) : undefined,
        received: issue.received ? String(issue.received) : undefined,
        isActionable: true
      };
    });

    return {
      strategyName: this.name,
      isValid: false,
      detectedDrift: true,
      diagnostics,
      executionTimeUs,
      errorSummary: diagnostics.map((d) => `[${d.path}] ${d.message}`).join("; ")
    };
  }
}
