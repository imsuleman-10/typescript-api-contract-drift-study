/**
 * Deterministic API Contract Drift Mutator
 * Injects controlled, reproducible contract mutations into baseline payloads.
 */

export function clonePayload<T>(payload: T): T {
  return JSON.parse(JSON.stringify(payload));
}

export interface MutationResult {
  code: string;
  domain: string;
  mutatedPayload: Record<string, unknown>;
  targetField: string;
  originalValue: unknown;
  mutatedValue: unknown;
  mutationDescription: string;
}

export function applyDriftMutation(
  domain: string,
  baseline: Record<string, unknown>,
  mutationCode: string
): MutationResult {
  const p = clonePayload(baseline);

  switch (mutationCode) {
    // ---------------- Structural Drift ----------------
    case "STR-01": {
      // Remove required top-level property
      const target = domain === "UserProfile" ? "userId" :
                     domain === "OrderCheckout" ? "orderId" :
                     domain === "PaymentTransaction" ? "transactionId" : "deviceId";
      const orig = p[target];
      delete p[target];
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: undefined,
        mutationDescription: `Omitted required primary key '${target}'`
      };
    }

    case "STR-02": {
      // Rename required property
      const [oldKey, newKey] = domain === "UserProfile" ? ["email", "user_email"] :
                               domain === "OrderCheckout" ? ["totalAmount", "total_amount"] :
                               domain === "PaymentTransaction" ? ["amount", "transaction_amount"] :
                               ["batteryLevel", "battery_pct"];
      const orig = p[oldKey];
      delete p[oldKey];
      p[newKey] = orig;
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: oldKey,
        originalValue: orig,
        mutatedValue: undefined,
        mutationDescription: `Renamed property '${oldKey}' to '${newKey}'`
      };
    }

    case "STR-03": {
      // Add unknown property (additive non-breaking)
      p["_experimentalServiceTelemetryHeader"] = "v2.1-canary";
      p["_auditTraceTimestamp"] = Date.now();
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: "_experimentalServiceTelemetryHeader",
        originalValue: undefined,
        mutatedValue: "v2.1-canary",
        mutationDescription: "Added unexpected supplementary metadata fields"
      };
    }

    case "STR-04": {
      // Remove nested required property
      let target = "";
      let orig: unknown = undefined;
      if (domain === "UserProfile" && p.address && typeof p.address === "object") {
        target = "address.postalCode";
        orig = (p.address as Record<string, unknown>).postalCode;
        delete (p.address as Record<string, unknown>).postalCode;
      } else if (domain === "OrderCheckout" && p.shippingAddress && typeof p.shippingAddress === "object") {
        target = "shippingAddress.zip";
        orig = (p.shippingAddress as Record<string, unknown>).zip;
        delete (p.shippingAddress as Record<string, unknown>).zip;
      } else if (domain === "PaymentTransaction" && p.metadata && typeof p.metadata === "object") {
        target = "metadata.referenceCode";
        orig = (p.metadata as Record<string, unknown>).referenceCode;
        delete (p.metadata as Record<string, unknown>).referenceCode;
      } else if (domain === "DeviceTelemetry" && p.location && typeof p.location === "object") {
        target = "location.latitude";
        orig = (p.location as Record<string, unknown>).latitude;
        delete (p.location as Record<string, unknown>).latitude;
      }
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: undefined,
        mutationDescription: `Omitted nested required property '${target}'`
      };
    }

    case "STR-05": {
      // Flatten nested hierarchy
      if (domain === "UserProfile" && p.address && typeof p.address === "object") {
        const addr = p.address as Record<string, unknown>;
        p.street = addr.street;
        p.city = addr.city;
        p.postalCode = addr.postalCode;
        p.country = addr.country;
        delete p.address;
      } else if (domain === "OrderCheckout" && p.shippingAddress && typeof p.shippingAddress === "object") {
        const addr = p.shippingAddress as Record<string, unknown>;
        p.shippingCity = addr.city;
        p.shippingZip = addr.zip;
        delete p.shippingAddress;
      } else {
        p["_flattenedPayload"] = true;
      }
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: "root",
        originalValue: "nested object",
        mutatedValue: "flattened root keys",
        mutationDescription: "Flattened nested object structure into root properties"
      };
    }

    // ---------------- Scalar Type Drift ----------------
    case "TYP-01": {
      // Int/Float to String
      const target = domain === "UserProfile" ? "age" :
                     domain === "OrderCheckout" ? "totalAmount" :
                     domain === "PaymentTransaction" ? "amount" : "uptimeSeconds";
      const orig = p[target];
      p[target] = String(orig);
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Mutated numeric property '${target}' to string '${p[target]}'`
      };
    }

    case "TYP-02": {
      // String to Number
      const target = domain === "UserProfile" ? "userId" :
                     domain === "OrderCheckout" ? "orderId" :
                     domain === "PaymentTransaction" ? "transactionId" : "deviceId";
      const orig = p[target];
      p[target] = 9948201;
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Mutated string identifier '${target}' to integer number`
      };
    }

    case "TYP-03": {
      // Boolean to String Literal
      const target = domain === "UserProfile" ? "preferences" :
                     domain === "PaymentTransaction" ? "settled" : "healthStatus";
      let orig: unknown = undefined;
      if (domain === "UserProfile" && p.preferences && typeof p.preferences === "object") {
        orig = (p.preferences as Record<string, unknown>).newsletter;
        (p.preferences as Record<string, unknown>).newsletter = "true";
      } else if (domain === "PaymentTransaction") {
        orig = p.settled;
        p.settled = "true";
      } else {
        orig = false;
        p["flagActive"] = "false";
      }
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: String(target),
        originalValue: orig,
        mutatedValue: "true",
        mutationDescription: "Mutated boolean primitive into string literal 'true'"
      };
    }

    case "TYP-04": {
      // ISO Date to Epoch Milliseconds
      const target = domain === "UserProfile" ? "createdAt" :
                     domain === "OrderCheckout" ? "placedAt" :
                     domain === "PaymentTransaction" ? "timestamp" : "lastSync";
      const orig = p[target];
      p[target] = Date.now();
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Converted ISO-8601 string '${target}' into numeric Unix epoch ms`
      };
    }

    case "TYP-05": {
      // Scalar to Array
      const target = domain === "UserProfile" ? "role" :
                     domain === "OrderCheckout" ? "status" :
                     domain === "PaymentTransaction" ? "currency" : "healthStatus";
      const orig = p[target];
      p[target] = [orig];
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Wrapped scalar property '${target}' into single-element array`
      };
    }

    case "TYP-06": {
      // Array to Scalar
      if (domain === "OrderCheckout" && Array.isArray(p.items)) {
        const orig = p.items;
        p.items = orig[0]; // send single object instead of array
        return {
          code: mutationCode,
          domain,
          mutatedPayload: p,
          targetField: "items",
          originalValue: orig,
          mutatedValue: p.items,
          mutationDescription: "Replaced array of items with a single standalone object"
        };
      } else if (domain === "DeviceTelemetry" && Array.isArray(p.readings)) {
        const orig = p.readings;
        p.readings = orig[0];
        return {
          code: mutationCode,
          domain,
          mutatedPayload: p,
          targetField: "readings",
          originalValue: orig,
          mutatedValue: p.readings,
          mutationDescription: "Replaced array of readings with a single standalone object"
        };
      }
      p["items"] = "scalar-value";
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: "items",
        originalValue: [],
        mutatedValue: "scalar-value",
        mutationDescription: "Mutated collection array into scalar string"
      };
    }

    // ---------------- Constraints Drift ----------------
    case "CST-01": {
      // Numeric Out of Bounds
      const target = domain === "UserProfile" ? "age" :
                     domain === "OrderCheckout" ? "totalAmount" :
                     domain === "PaymentTransaction" ? "amount" : "batteryLevel";
      const orig = p[target];
      p[target] = domain === "UserProfile" ? 250 : // max 120
                  domain === "PaymentTransaction" ? -500 : // min 1
                  domain === "DeviceTelemetry" ? 180.5 : // max 100
                  -10.0;
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Violated numeric boundary constraint on '${target}': ${p[target]}`
      };
    }

    case "CST-02": {
      // String Regex Violation
      const target = domain === "UserProfile" ? "email" :
                     domain === "OrderCheckout" ? "orderId" :
                     domain === "PaymentTransaction" ? "transactionId" : "firmwareVersion";
      const orig = p[target];
      p[target] = domain === "UserProfile" ? "sarah_connor_at_resistance_dot_com" : // invalid email
                  domain === "OrderCheckout" ? "INVALID_ID_WITHOUT_ORD_PREFIX" :
                  domain === "PaymentTransaction" ? "INVALID_NO_TX_PREFIX" :
                  "v2-canary-alpha"; // not digits.digits.digits
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Violated regex pattern constraint on '${target}'`
      };
    }

    case "CST-03": {
      // String Length Excess
      const target = domain === "OrderCheckout" ? "currency" :
                     domain === "UserProfile" ? "displayName" :
                     domain === "PaymentTransaction" ? "metadata" : "firmwareVersion";
      if (domain === "OrderCheckout") {
        const orig = p.currency;
        p.currency = "UNITED_STATES_DOLLAR"; // exceeds 3 chars
        return {
          code: mutationCode,
          domain,
          mutatedPayload: p,
          targetField: "currency",
          originalValue: orig,
          mutatedValue: p.currency,
          mutationDescription: "Exceeded max string length for ISO currency code"
        };
      }
      p["displayName"] = "A".repeat(250); // exceeds 100 max
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: "displayName",
        originalValue: "Sarah Connor",
        mutatedValue: "A * 250",
        mutationDescription: "Exceeded max string length constraint"
      };
    }

    case "CST-04": {
      // Array Cardinality Underflow
      const target = domain === "OrderCheckout" ? "items" :
                     domain === "DeviceTelemetry" ? "readings" : "tags";
      const orig = p[target];
      p[target] = []; // minItems: 1 violated
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: [],
        mutationDescription: `Violated minItems constraint on array '${target}': sent empty list []`
      };
    }

    case "CST-05": {
      // Empty String Violation
      const target = domain === "UserProfile" ? "displayName" :
                     domain === "OrderCheckout" ? "customerId" :
                     domain === "PaymentTransaction" ? "sourceAccount" : "deviceId";
      const orig = p[target];
      p[target] = "";
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: "",
        mutationDescription: `Sent empty string "" for mandatory non-empty field '${target}'`
      };
    }

    // ---------------- Nullability Drift ----------------
    case "NUL-01": {
      // Mandatory Key Set to Null
      const target = domain === "UserProfile" ? "displayName" :
                     domain === "OrderCheckout" ? "totalAmount" :
                     domain === "PaymentTransaction" ? "sourceAccount" : "batteryLevel";
      const orig = p[target];
      p[target] = null;
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: null,
        mutationDescription: `Assigned null to non-nullable required property '${target}'`
      };
    }

    case "NUL-02": {
      // Mandatory Key Set to Undefined
      const target = domain === "UserProfile" ? "email" :
                     domain === "OrderCheckout" ? "customerId" :
                     domain === "PaymentTransaction" ? "destinationAccount" : "healthStatus";
      const orig = p[target];
      p[target] = undefined;
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: undefined,
        mutationDescription: `Assigned undefined to mandatory field '${target}'`
      };
    }

    case "NUL-03": {
      // Nullable Key Provided Null (Valid non-breaking usage)
      if (domain === "UserProfile") {
        p.bio = null;
      } else if (domain === "OrderCheckout") {
        p.discountCode = null;
      }
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: domain === "UserProfile" ? "bio" : "discountCode",
        originalValue: null,
        mutatedValue: null,
        mutationDescription: "Explicitly passed null to declared nullable property (permissible)"
      };
    }

    case "NUL-04": {
      // Optional Property Omitted
      if (domain === "UserProfile") {
        delete p.bio;
      } else if (domain === "OrderCheckout") {
        delete p.discountCode;
      }
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: "optionalField",
        originalValue: "omitted",
        mutatedValue: undefined,
        mutationDescription: "Omitted optional field that downstream component assumed present"
      };
    }

    // ---------------- Semantic & Enum Drift ----------------
    case "ENM-01": {
      // Undocumented Enum Variant
      const target = domain === "UserProfile" ? "role" :
                     domain === "OrderCheckout" ? "status" :
                     domain === "PaymentTransaction" ? "paymentMethod" : "healthStatus";
      const orig = p[target];
      p[target] = domain === "UserProfile" ? "SUPER_ADMIN" :
                  domain === "OrderCheckout" ? "REFUNDED_PENDING_DISPUTE" :
                  domain === "PaymentTransaction" ? "BITCOIN_LIGHTNING" : "STANDBY_MAINTENANCE";
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Injected undocumented enum variant '${p[target]}' for '${target}'`
      };
    }

    case "ENM-02": {
      // Enum Casing Shift
      const target = domain === "UserProfile" ? "role" :
                     domain === "OrderCheckout" ? "status" :
                     domain === "PaymentTransaction" ? "currency" : "healthStatus";
      const orig = p[target];
      p[target] = String(orig).toLowerCase();
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Altered enum casing on '${target}' from '${orig}' to '${p[target]}'`
      };
    }

    case "ENM-03": {
      // Deprecated Enum Value Sent
      const target = domain === "PaymentTransaction" ? "paymentMethod" : "role";
      const orig = p[target];
      p[target] = "DEPRECATED_LEGACY_PROTOCOL";
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: target,
        originalValue: orig,
        mutatedValue: p[target],
        mutationDescription: `Dispatched obsolete/deprecated enum member '${p[target]}'`
      };
    }

    // ---------------- Protocol Drift ----------------
    case "PRO-01": {
      // Status Code Contract Divergence
      p["error"] = {
        code: "INTERNAL_TRANSACTION_ABORTED",
        message: "Downstream ledger synchronization timeout"
      };
      p["_httpStatusReturned"] = 200; // Sent 200 OK with business failure body
      return {
        code: mutationCode,
        domain,
        mutatedPayload: p,
        targetField: "error",
        originalValue: undefined,
        mutatedValue: p["error"],
        mutationDescription: "Returned HTTP 200 OK carrying an unhandled error object"
      };
    }

    default:
      throw new Error(`Unknown drift mutation code: ${mutationCode}`);
  }
}
