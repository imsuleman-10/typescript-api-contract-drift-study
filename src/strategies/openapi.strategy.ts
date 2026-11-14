import AjvModule from "ajv";
import addFormatsModule from "ajv-formats";
import type { ValidateFunction } from "ajv";
import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StrategyValidationResult, ValidationDiagnostic } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

const AjvClass = (AjvModule as unknown as { default?: typeof AjvModule }).default || AjvModule;
const addFormatsFunc = (addFormatsModule as unknown as { default?: typeof addFormatsModule }).default || addFormatsModule;

/**
 * OpenAPI Specification Strategy
 * Validates payloads against standard OpenAPI 3.1 / JSON Schema draft-07 schemas via Ajv.
 */
export class OpenApiValidationStrategy implements IContractVerificationStrategy {
  public readonly name = "OpenAPI 3.1 Specification Validation";
  public readonly description =
    "Specification-driven schema validation using Ajv with strict standard JSON Schema rules.";

  private ajv: any;
  private validatorCache = new Map<string, ValidateFunction>();

  constructor() {
    this.ajv = new (AjvClass as any)({
      allErrors: true,
      strict: false,
      coerceTypes: false
    });
    if (typeof addFormatsFunc === "function") {
      (addFormatsFunc as any)(this.ajv);
    }
  }

  private getValidator(domainBundle: DomainContractBundle): ValidateFunction {
    if (!this.validatorCache.has(domainBundle.domain)) {
      const validator = this.ajv.compile(domainBundle.openApiSchema);
      this.validatorCache.set(domainBundle.domain, validator);
    }
    return this.validatorCache.get(domainBundle.domain)!;
  }

  public validate(
    domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult {
    const validator = this.getValidator(domainBundle);

    const start = performance.now();
    const isValid = validator(payload);
    const end = performance.now();
    const executionTimeUs = (end - start) * 1000;

    if (isValid) {
      return {
        strategyName: this.name,
        isValid: true,
        detectedDrift: false,
        diagnostics: [],
        executionTimeUs
      };
    }

    const diagnostics: ValidationDiagnostic[] = (validator.errors || []).map((err) => {
      const path = err.instancePath.startsWith("/")
        ? err.instancePath.slice(1).replace(/\//g, ".")
        : err.instancePath || (err.params && "missingProperty" in err.params ? String(err.params.missingProperty) : "root");

      return {
        path,
        message: err.message || "Schema constraint violation",
        expected: JSON.stringify(err.params),
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
