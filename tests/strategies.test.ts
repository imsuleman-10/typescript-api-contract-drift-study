import { describe, it, expect } from "vitest";
import { BENCHMARK_DOMAINS } from "../src/contracts/index.js";
import { applyDriftMutation } from "../src/mutator/drift-mutator.js";
import {
  StaticTypeScriptStrategy,
  ZodValidationStrategy,
  TypeBoxValidationStrategy,
  ValibotValidationStrategy,
  OpenApiValidationStrategy,
  ConsumerContractStrategy
} from "../src/strategies/index.js";

describe("Verification Strategies", () => {
  const userProfileBundle = BENCHMARK_DOMAINS.UserProfile;

  it("Static TypeScript strategy should always return isValid = true regardless of mutation", () => {
    const strat = new StaticTypeScriptStrategy();
    const mutated = applyDriftMutation("UserProfile", userProfileBundle.baseline, "STR-01");
    const res = strat.validate(userProfileBundle, mutated.mutatedPayload);

    expect(res.isValid).toBe(true);
    expect(res.detectedDrift).toBe(false);
  });

  it("Zod strategy should accept valid baseline and detect breaking drift", () => {
    const strat = new ZodValidationStrategy();
    const validRes = strat.validate(userProfileBundle, userProfileBundle.baseline);
    expect(validRes.isValid).toBe(true);

    const breakingMut = applyDriftMutation("UserProfile", userProfileBundle.baseline, "TYP-01");
    const breakRes = strat.validate(userProfileBundle, breakingMut.mutatedPayload);
    expect(breakRes.isValid).toBe(false);
    expect(breakRes.detectedDrift).toBe(true);
    expect(breakRes.diagnostics.length).toBeGreaterThan(0);
  });

  it("TypeBox strategy should accept baseline and detect regex violations", () => {
    const strat = new TypeBoxValidationStrategy();
    const validRes = strat.validate(userProfileBundle, userProfileBundle.baseline);
    expect(validRes.isValid).toBe(true);

    const breakingMut = applyDriftMutation("UserProfile", userProfileBundle.baseline, "CST-02");
    const breakRes = strat.validate(userProfileBundle, breakingMut.mutatedPayload);
    expect(breakRes.isValid).toBe(false);
    expect(breakRes.detectedDrift).toBe(true);
  });

  it("Valibot strategy should accept baseline and detect enum violations", () => {
    const strat = new ValibotValidationStrategy();
    const validRes = strat.validate(userProfileBundle, userProfileBundle.baseline);
    expect(validRes.isValid).toBe(true);

    const breakingMut = applyDriftMutation("UserProfile", userProfileBundle.baseline, "ENM-01");
    const breakRes = strat.validate(userProfileBundle, breakingMut.mutatedPayload);
    expect(breakRes.isValid).toBe(false);
    expect(breakRes.detectedDrift).toBe(true);
  });

  it("OpenAPI strategy should validate schema via Ajv", () => {
    const strat = new OpenApiValidationStrategy();
    const validRes = strat.validate(userProfileBundle, userProfileBundle.baseline);
    expect(validRes.isValid).toBe(true);

    const breakingMut = applyDriftMutation("UserProfile", userProfileBundle.baseline, "STR-01");
    const breakRes = strat.validate(userProfileBundle, breakingMut.mutatedPayload);
    expect(breakRes.isValid).toBe(false);
    expect(breakRes.detectedDrift).toBe(true);
  });

  it("Consumer Contract strategy should ignore unknown keys (STR-03) and detect missing consumed keys (STR-01)", () => {
    const strat = new ConsumerContractStrategy();

    // Additive non-breaking field
    const nonBreakingMut = applyDriftMutation("UserProfile", userProfileBundle.baseline, "STR-03");
    const nbRes = strat.validate(userProfileBundle, nonBreakingMut.mutatedPayload);
    expect(nbRes.isValid).toBe(true);
    expect(nbRes.detectedDrift).toBe(false);

    // Missing consumed field
    const breakingMut = applyDriftMutation("UserProfile", userProfileBundle.baseline, "STR-01");
    const bRes = strat.validate(userProfileBundle, breakingMut.mutatedPayload);
    expect(bRes.isValid).toBe(false);
    expect(bRes.detectedDrift).toBe(true);
  });
});
