import { z } from "zod";
import { Type } from "@sinclair/typebox";
import * as v from "valibot";

export interface PaymentTransactionPayload {
  transactionId: string;
  amount: number;
  currency: string;
  sourceAccount: string;
  destinationAccount: string;
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "SEPA_CREDIT_TRANSFER" | "WIRE";
  fee: number;
  settled: boolean;
  metadata: {
    referenceCode: string;
    riskScore: number;
  };
  timestamp: string;
  [key: string]: unknown;
}

export const PAYMENT_TRANSACTION_BASELINE: PaymentTransactionPayload = {
  transactionId: "tx_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  amount: 25000,
  currency: "EUR",
  sourceAccount: "DE89370400440532013000",
  destinationAccount: "FR7630006000011234567890189",
  paymentMethod: "SEPA_CREDIT_TRANSFER",
  fee: 150,
  settled: true,
  metadata: {
    referenceCode: "INV-2024-9912",
    riskScore: 12
  },
  timestamp: "2024-03-15T09:30:00.000Z"
};

// Zod Schema
export const PaymentTransactionZodSchema = z.object({
  transactionId: z.string().startsWith("tx_"),
  amount: z.number().int().positive(),
  currency: z.enum(["USD", "EUR", "GBP", "JPY"]),
  sourceAccount: z.string().min(8),
  destinationAccount: z.string().min(8),
  paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "SEPA_CREDIT_TRANSFER", "WIRE"]),
  fee: z.number().min(0),
  settled: z.boolean(),
  metadata: z.object({
    referenceCode: z.string().min(3),
    riskScore: z.number().min(0).max(100)
  }),
  timestamp: z.string().datetime()
});

// TypeBox Schema
export const PaymentTransactionTypeBoxSchema = Type.Object({
  transactionId: Type.String({ pattern: "^tx_" }),
  amount: Type.Integer({ minimum: 1 }),
  currency: Type.Union([
    Type.Literal("USD"),
    Type.Literal("EUR"),
    Type.Literal("GBP"),
    Type.Literal("JPY")
  ]),
  sourceAccount: Type.String({ minLength: 8 }),
  destinationAccount: Type.String({ minLength: 8 }),
  paymentMethod: Type.Union([
    Type.Literal("CREDIT_CARD"),
    Type.Literal("DEBIT_CARD"),
    Type.Literal("SEPA_CREDIT_TRANSFER"),
    Type.Literal("WIRE")
  ]),
  fee: Type.Number({ minimum: 0 }),
  settled: Type.Boolean(),
  metadata: Type.Object({
    referenceCode: Type.String({ minLength: 3 }),
    riskScore: Type.Number({ minimum: 0, maximum: 100 })
  }),
  timestamp: Type.String({ format: "date-time" })
});

// Valibot Schema
export const PaymentTransactionValibotSchema = v.object({
  transactionId: v.pipe(v.string(), v.startsWith("tx_")),
  amount: v.pipe(v.number(), v.integer(), v.minValue(1)),
  currency: v.picklist(["USD", "EUR", "GBP", "JPY"]),
  sourceAccount: v.pipe(v.string(), v.minLength(8)),
  destinationAccount: v.pipe(v.string(), v.minLength(8)),
  paymentMethod: v.picklist(["CREDIT_CARD", "DEBIT_CARD", "SEPA_CREDIT_TRANSFER", "WIRE"]),
  fee: v.pipe(v.number(), v.minValue(0)),
  settled: v.boolean(),
  metadata: v.object({
    referenceCode: v.pipe(v.string(), v.minLength(3)),
    riskScore: v.pipe(v.number(), v.minValue(0), v.maxValue(100))
  }),
  timestamp: v.pipe(v.string(), v.isoTimestamp())
});
