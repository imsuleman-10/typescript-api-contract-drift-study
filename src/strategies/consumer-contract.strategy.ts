import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StrategyValidationResult, ValidationDiagnostic } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[p];
  }
  return current;
}

/**
 * Consumer-Driven Contract Strategy (CDC)
 * Evaluates provider payloads against consumer expectation contracts (Pact semantics).
 * Focuses exclusively on utilized consumer fields, ignoring unconsumed additive fields.
 */
export class ConsumerContractStrategy implements IContractVerificationStrategy {
  public readonly name = "Consumer-Driven Contract Testing (Pact)";
  public readonly description =
    "Consumer expectation assertions verifying consumed field subsets and ignoring non-breaking additions.";

  public validate(
    domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult {
    const start = performance.now();
    const diagnostics: ValidationDiagnostic[] = [];

    // Verify all consumer-declared expectation paths
    for (const expectedPath of domainBundle.consumerSubset) {
      const val = getNestedValue(payload, expectedPath);
      const baselineVal = getNestedValue(domainBundle.baseline, expectedPath);

      if (val === undefined) {
        diagnostics.push({
          path: expectedPath,
          message: `Consumer expectation unmet: expected property '${expectedPath}' is missing`,
          expected: typeof baselineVal,
          received: "undefined",
          isActionable: true
        });
      } else if (val === null && baselineVal !== null) {
        diagnostics.push({
          path: expectedPath,
          message: `Consumer expectation unmet: expected non-null property '${expectedPath}' received null`,
          expected: typeof baselineVal,
          received: "null",
          isActionable: true
        });
      } else if (typeof val !== typeof baselineVal && baselineVal !== null && val !== null) {
        diagnostics.push({
          path: expectedPath,
          message: `Consumer expectation unmet: type mismatch on '${expectedPath}', expected ${typeof baselineVal} but received ${typeof val}`,
          expected: typeof baselineVal,
          received: typeof val,
          isActionable: true
        });
      }
    }

    // Check for explicit error responses or status code drift
    if (payload.error && typeof payload.error === "object") {
      diagnostics.push({
        path: "error",
        message: "Consumer expectation failed: unexpected error payload received with HTTP 200",
        received: "error payload object",
        isActionable: true
      });
    }

    const end = performance.now();
    const executionTimeUs = (end - start) * 1000;

    const isValid = diagnostics.length === 0;
    return {
      strategyName: this.name,
      isValid,
      detectedDrift: !isValid,
      diagnostics,
      executionTimeUs,
      errorSummary: isValid ? undefined : diagnostics.map((d) => `[${d.path}] ${d.message}`).join("; ")
    };
  }
}
