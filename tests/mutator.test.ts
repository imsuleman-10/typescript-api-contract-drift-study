import { describe, it, expect } from "vitest";
import { applyDriftMutation } from "../src/mutator/drift-mutator.js";
import { BENCHMARK_DOMAINS } from "../src/contracts/index.js";
import { DRIFT_TAXONOMY } from "../src/taxonomy/drift-taxonomy.js";

describe("Drift Mutator", () => {
  const domains = Object.keys(BENCHMARK_DOMAINS);

  it("should successfully apply every taxonomy mutation across all domains without crashing", () => {
    for (const domain of domains) {
      const baseline = BENCHMARK_DOMAINS[domain].baseline;
      for (const mutationCode of Object.keys(DRIFT_TAXONOMY)) {
        const result = applyDriftMutation(domain, baseline, mutationCode);
        expect(result.code).toBe(mutationCode);
        expect(result.domain).toBe(domain);
        expect(result.mutatedPayload).toBeDefined();
        expect(typeof result.mutatedPayload).toBe("object");
      }
    }
  });

  it("should not mutate the original baseline object in place", () => {
    const baseline = BENCHMARK_DOMAINS.UserProfile.baseline;
    const baselineCopy = JSON.stringify(baseline);

    applyDriftMutation("UserProfile", baseline, "STR-01");
    applyDriftMutation("UserProfile", baseline, "TYP-01");
    applyDriftMutation("UserProfile", baseline, "CST-01");

    expect(JSON.stringify(baseline)).toBe(baselineCopy);
  });

  it("should remove key for STR-01", () => {
    const baseline = BENCHMARK_DOMAINS.UserProfile.baseline;
    const res = applyDriftMutation("UserProfile", baseline, "STR-01");
    expect(res.mutatedPayload.userId).toBeUndefined();
  });

  it("should convert number to string for TYP-01", () => {
    const baseline = BENCHMARK_DOMAINS.UserProfile.baseline;
    const res = applyDriftMutation("UserProfile", baseline, "TYP-01");
    expect(typeof res.mutatedPayload.age).toBe("string");
  });
});
