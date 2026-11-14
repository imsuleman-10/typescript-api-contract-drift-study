import { DriftMutationDefinition } from "../types/index.js";

/**
 * 24-Class Taxonomy of API Contract Drift based on empirical literature
 * (Linares-Vasquez et al. S010, Wittern et al. S005, Zhang et al. S020).
 */
export const DRIFT_TAXONOMY: Record<string, DriftMutationDefinition> = {
  // Dimension 1: Structural / Key Hierarchy
  "STR-01": {
    code: "STR-01",
    name: "Remove Required Key",
    dimension: "structural",
    severity: "breaking",
    description: "An agreed required top-level property is omitted from the payload.",
    expectedDetection: true
  },
  "STR-02": {
    code: "STR-02",
    name: "Rename Required Key",
    dimension: "structural",
    severity: "breaking",
    description: "A required property is renamed (e.g. 'userId' to 'user_id'), leaving the expected key absent.",
    expectedDetection: true
  },
  "STR-03": {
    code: "STR-03",
    name: "Add Unknown Key",
    dimension: "structural",
    severity: "non-breaking",
    description: "An unexpected supplementary property is added to the payload (additive evolution).",
    expectedDetection: false
  },
  "STR-04": {
    code: "STR-04",
    name: "Remove Nested Required Key",
    dimension: "structural",
    severity: "breaking",
    description: "A required property inside a nested child object is omitted.",
    expectedDetection: true
  },
  "STR-05": {
    code: "STR-05",
    name: "Flatten Nested Hierarchy",
    dimension: "structural",
    severity: "breaking",
    description: "A nested object hierarchy is flattened into root keys without provider version increment.",
    expectedDetection: true
  },

  // Dimension 2: Scalar Type & Format
  "TYP-01": {
    code: "TYP-01",
    name: "Integer to String",
    dimension: "scalar_type",
    severity: "breaking",
    description: "A numeric field is sent as a string (e.g., 42 -> '42').",
    expectedDetection: true
  },
  "TYP-02": {
    code: "TYP-02",
    name: "String to Number",
    dimension: "scalar_type",
    severity: "breaking",
    description: "A string field is sent as a numeric primitive.",
    expectedDetection: true
  },
  "TYP-03": {
    code: "TYP-03",
    name: "Boolean to String Literal",
    dimension: "scalar_type",
    severity: "breaking",
    description: "A boolean field is sent as string 'true' or 'false'.",
    expectedDetection: true
  },
  "TYP-04": {
    code: "TYP-04",
    name: "ISO Timestamp to Epoch Milliseconds",
    dimension: "scalar_type",
    severity: "breaking",
    description: "An ISO-8601 date string is sent as raw integer Unix epoch milliseconds.",
    expectedDetection: true
  },
  "TYP-05": {
    code: "TYP-05",
    name: "Scalar to Array",
    dimension: "scalar_type",
    severity: "breaking",
    description: "A single scalar value is wrapped into an array list.",
    expectedDetection: true
  },
  "TYP-06": {
    code: "TYP-06",
    name: "Array to Scalar",
    dimension: "scalar_type",
    severity: "breaking",
    description: "An array of items is sent as a single standalone item.",
    expectedDetection: true
  },

  // Dimension 3: Constraints & Range
  "CST-01": {
    code: "CST-01",
    name: "Numeric Out of Bounds",
    dimension: "constraints",
    severity: "breaking",
    description: "A numeric value violates declared min/max range constraints.",
    expectedDetection: true
  },
  "CST-02": {
    code: "CST-02",
    name: "String Regex Violation",
    dimension: "constraints",
    severity: "breaking",
    description: "A string value (e.g., email or UUID) fails its declared format pattern.",
    expectedDetection: true
  },
  "CST-03": {
    code: "CST-03",
    name: "String Length Excess",
    dimension: "constraints",
    severity: "breaking",
    description: "A string exceeds its agreed maxLength constraint.",
    expectedDetection: true
  },
  "CST-04": {
    code: "CST-04",
    name: "Array Cardinality Underflow",
    dimension: "constraints",
    severity: "breaking",
    description: "An array contains fewer items than the required minItems constraint.",
    expectedDetection: true
  },
  "CST-05": {
    code: "CST-05",
    name: "Empty String Violation",
    dimension: "constraints",
    severity: "breaking",
    description: "A mandatory non-empty string is sent as an empty string (\"\").",
    expectedDetection: true
  },

  // Dimension 4: Nullability & Optionality
  "NUL-01": {
    code: "NUL-01",
    name: "Mandatory Key Set to Null",
    dimension: "nullability",
    severity: "breaking",
    description: "A non-nullable required property is sent with null value.",
    expectedDetection: true
  },
  "NUL-02": {
    code: "NUL-02",
    name: "Mandatory Key Set to Undefined",
    dimension: "nullability",
    severity: "breaking",
    description: "A required property key is present but carries an undefined value.",
    expectedDetection: true
  },
  "NUL-03": {
    code: "NUL-03",
    name: "Nullable Key Provided Null",
    dimension: "nullability",
    severity: "non-breaking",
    description: "A declared nullable field is set to null (valid permissible usage).",
    expectedDetection: false
  },
  "NUL-04": {
    code: "NUL-04",
    name: "Optional Property Made Mandatory",
    dimension: "nullability",
    severity: "breaking",
    description: "A consumer payload omits a field that the provider silently tightened to mandatory.",
    expectedDetection: true
  },

  // Dimension 5: Semantic & Enum Shift
  "ENM-01": {
    code: "ENM-01",
    name: "Undocumented Enum Variant",
    dimension: "semantic_enum",
    severity: "breaking",
    description: "A categorical property contains a new, undocumented enum member.",
    expectedDetection: true
  },
  "ENM-02": {
    code: "ENM-02",
    name: "Enum Casing Shift",
    dimension: "semantic_enum",
    severity: "breaking",
    description: "An enum value changes casing (e.g. 'PENDING' to 'pending').",
    expectedDetection: true
  },
  "ENM-03": {
    code: "ENM-03",
    name: "Deprecated Enum Value Sent",
    dimension: "semantic_enum",
    severity: "breaking",
    description: "An obsolete/deprecated enum member is dispatched.",
    expectedDetection: true
  },

  // Dimension 6: Protocol & Transport
  "PRO-01": {
    code: "PRO-01",
    name: "Status Code Contract Divergence",
    dimension: "protocol",
    severity: "breaking",
    description: "HTTP 200 OK returned with an internal business error payload instead of expected 4xx/5xx.",
    expectedDetection: true
  }
};
