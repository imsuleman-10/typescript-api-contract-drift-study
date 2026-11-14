import { TypeCompiler, TypeCheck } from "@sinclair/typebox/compiler";
import { TSchema, FormatRegistry } from "@sinclair/typebox";
import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StrategyValidationResult, ValidationDiagnostic } from "../types/index.js";
import { DomainContractBundle } from "../contracts/index.js";

// Register JSON Schema formats used in contracts
if (!FormatRegistry.Has("email")) {
  FormatRegistry.Set("email", (val) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val));
}
if (!FormatRegistry.Has("date-time")) {
  FormatRegistry.Set("date-time", (val) => typeof val === "string" && !isNaN(Date.parse(val)));
}

/**
 * TypeBox Validation Strategy
 * High-performance JSON Schema compilation via TypeCompiler.
 */
export class TypeBoxValidationStrategy implements IContractVerificationStrategy {
  public readonly name = "TypeBox (Compiled JSON Schema)";
  public readonly description =
    "High-speed JIT-compiled JSON Schema validator based on @sinclair/typebox.";

  private compilerCache = new Map<string, TypeCheck<TSchema>>();

  private getCompiledValidator(domainBundle: DomainContractBundle): TypeCheck<TSchema> {
    if (!this.compilerCache.has(domainBundle.domain)) {
      const compiled = TypeCompiler.Compile(domainBundle.typeBoxSchema as TSchema);
      this.compilerCache.set(domainBundle.domain, compiled);
    }
    return this.compilerCache.get(domainBundle.domain)!;
  }

  public validate(
    domainBundle: DomainContractBundle,
    payload: Record<string, unknown>
  ): StrategyValidationResult {
    const validator = this.getCompiledValidator(domainBundle);

    const start = performance.now();
    const isValid = validator.Check(payload);
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

    const diagnostics: ValidationDiagnostic[] = [];
    for (const error of validator.Errors(payload)) {
      const cleanPath = error.path.startsWith("/") ? error.path.slice(1).replace(/\//g, ".") : error.path;
      diagnostics.push({
        path: cleanPath || "root",
        message: error.message,
        received: typeof error.value === "object" ? JSON.stringify(error.value) : String(error.value),
        isActionable: true
      });
      if (diagnostics.length >= 10) break; // Avoid unbounded error cascades
    }

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
