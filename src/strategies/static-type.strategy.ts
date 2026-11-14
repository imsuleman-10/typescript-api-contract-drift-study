import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StrategyValidationResult } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

/**
 * Static TypeScript Strategy (Baseline)
 * Simulates standard TypeScript compile-time interface casting: `(payload as T)`.
 * Because all types are erased at compile-time (Bierman et al. S007),
 * no runtime inspection occurs and zero drift is detected.
 */
export class StaticTypeScriptStrategy implements IContractVerificationStrategy {
  public readonly name = "Static TypeScript (Compile-Time Only)";
  public readonly description =
    "Standard TypeScript interface casting erased at runtime; zero runtime verification.";

  public validate(
    _domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult {
    const start = performance.now();

    // Compile-time interface casting in TypeScript:
    // const parsed = payload as unknown as UserProfilePayload;
    // At runtime in JavaScript, this is a pure no-op:
    const _parsed = payload;

    const end = performance.now();
    const executionTimeUs = Math.max(0.01, (end - start) * 1000);

    return {
      strategyName: this.name,
      isValid: true, // Always passes at runtime because no check exists
      detectedDrift: false,
      diagnostics: [],
      executionTimeUs,
      errorSummary: undefined
    };
  }
}
