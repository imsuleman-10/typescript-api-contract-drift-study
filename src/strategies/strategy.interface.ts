import { StrategyValidationResult } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

export interface IContractVerificationStrategy {
  readonly name: string;
  readonly description: string;

  /**
   * Validates an observed runtime payload against the domain contract.
   * Returns validation result, detected drift flag, diagnostics, and latency.
   */
  validate(
    domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult;
}
