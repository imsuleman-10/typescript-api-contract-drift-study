import {
  USER_PROFILE_BASELINE,
  UserProfilePayload,
  UserProfileZodSchema,
  UserProfileTypeBoxSchema,
  UserProfileValibotSchema
} from "./user-profile.contract.js";

import {
  ORDER_CHECKOUT_BASELINE,
  OrderCheckoutPayload,
  OrderCheckoutZodSchema,
  OrderCheckoutTypeBoxSchema,
  OrderCheckoutValibotSchema
} from "./order-checkout.contract.js";

import {
  PAYMENT_TRANSACTION_BASELINE,
  PaymentTransactionPayload,
  PaymentTransactionZodSchema,
  PaymentTransactionTypeBoxSchema,
  PaymentTransactionValibotSchema
} from "./payment-transaction.contract.js";

import {
  DEVICE_TELEMETRY_BASELINE,
  DeviceTelemetryPayload,
  DeviceTelemetryZodSchema,
  DeviceTelemetryTypeBoxSchema,
  DeviceTelemetryValibotSchema
} from "./device-telemetry.contract.js";

export * from "./user-profile.contract.js";
export * from "./order-checkout.contract.js";
export * from "./payment-transaction.contract.js";
export * from "./device-telemetry.contract.js";

export interface DomainContractBundle {
  domain: string;
  baseline: Record<string, unknown>;
  zodSchema: unknown;
  typeBoxSchema: unknown;
  valibotSchema: unknown;
  openApiSchema: Record<string, unknown>;
  consumerSubset: string[];
}

export const BENCHMARK_DOMAINS: Record<string, DomainContractBundle> = {
  UserProfile: {
    domain: "UserProfile",
    baseline: USER_PROFILE_BASELINE as unknown as Record<string, unknown>,
    zodSchema: UserProfileZodSchema,
    typeBoxSchema: UserProfileTypeBoxSchema,
    valibotSchema: UserProfileValibotSchema,
    openApiSchema: UserProfileTypeBoxSchema as unknown as Record<string, unknown>,
    consumerSubset: ["userId", "email", "displayName", "role", "address.city", "address.postalCode"]
  },
  OrderCheckout: {
    domain: "OrderCheckout",
    baseline: ORDER_CHECKOUT_BASELINE as unknown as Record<string, unknown>,
    zodSchema: OrderCheckoutZodSchema,
    typeBoxSchema: OrderCheckoutTypeBoxSchema,
    valibotSchema: OrderCheckoutValibotSchema,
    openApiSchema: OrderCheckoutTypeBoxSchema as unknown as Record<string, unknown>,
    consumerSubset: ["orderId", "totalAmount", "status", "items", "shippingAddress.zip"]
  },
  PaymentTransaction: {
    domain: "PaymentTransaction",
    baseline: PAYMENT_TRANSACTION_BASELINE as unknown as Record<string, unknown>,
    zodSchema: PaymentTransactionZodSchema,
    typeBoxSchema: PaymentTransactionTypeBoxSchema,
    valibotSchema: PaymentTransactionValibotSchema,
    openApiSchema: PaymentTransactionTypeBoxSchema as unknown as Record<string, unknown>,
    consumerSubset: ["transactionId", "amount", "currency", "paymentMethod", "settled"]
  },
  DeviceTelemetry: {
    domain: "DeviceTelemetry",
    baseline: DEVICE_TELEMETRY_BASELINE as unknown as Record<string, unknown>,
    zodSchema: DeviceTelemetryZodSchema,
    typeBoxSchema: DeviceTelemetryTypeBoxSchema,
    valibotSchema: DeviceTelemetryValibotSchema,
    openApiSchema: DeviceTelemetryTypeBoxSchema as unknown as Record<string, unknown>,
    consumerSubset: ["deviceId", "batteryLevel", "healthStatus", "readings", "uptimeSeconds"]
  }
};
