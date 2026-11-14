import { IContractVerificationStrategy } from "./strategy.interface.js";
import { StaticTypeScriptStrategy } from "./static-type.strategy.js";
import { ZodValidationStrategy } from "./zod.strategy.js";
import { TypeBoxValidationStrategy } from "./typebox.strategy.js";
import { ValibotValidationStrategy } from "./valibot.strategy.js";
import { OpenApiValidationStrategy } from "./openapi.strategy.js";
import { ConsumerContractStrategy } from "./consumer-contract.strategy.js";

export * from "./strategy.interface.js";
export * from "./static-type.strategy.js";
export * from "./zod.strategy.js";
export * from "./typebox.strategy.js";
export * from "./valibot.strategy.js";
export * from "./openapi.strategy.js";
export * from "./consumer-contract.strategy.js";

export function getAllStrategies(): IContractVerificationStrategy[] {
  return [
    new StaticTypeScriptStrategy(),
    new ZodValidationStrategy(),
    new TypeBoxValidationStrategy(),
    new ValibotValidationStrategy(),
    new OpenApiValidationStrategy(),
    new ConsumerContractStrategy()
  ];
}
