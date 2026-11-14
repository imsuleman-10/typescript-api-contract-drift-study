import { describe, it, expect } from "vitest";
import { DRIFT_TAXONOMY } from "../src/taxonomy/drift-taxonomy.js";

describe("Drift Taxonomy", () => {
  it("should define exactly 24 mutation scenarios", () => {
    const codes = Object.keys(DRIFT_TAXONOMY);
    expect(codes.length).toBe(24);
  });

  it("should have valid dimension and severity classifications for each code", () => {
    for (const [code, def] of Object.entries(DRIFT_TAXONOMY)) {
      expect(def.code).toBe(code);
      expect(["structural", "scalar_type", "constraints", "nullability", "semantic_enum", "protocol"]).toContain(
        def.dimension
      );
      expect(["breaking", "non-breaking", "subtle"]).toContain(def.severity);
      expect(typeof def.name).toBe("string");
      expect(def.name.length).toBeGreaterThan(0);
      expect(typeof def.description).toBe("string");
      expect(def.description.length).toBeGreaterThan(10);
      expect(typeof def.expectedDetection).toBe("boolean");
    }
  });

  it("should mark non-breaking additions as expectedDetection = false", () => {
    expect(DRIFT_TAXONOMY["STR-03"].expectedDetection).toBe(false);
    expect(DRIFT_TAXONOMY["NUL-03"].expectedDetection).toBe(false);
  });
});
