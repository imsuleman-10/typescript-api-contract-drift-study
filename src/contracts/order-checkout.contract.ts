import { z } from "zod";
import { Type } from "@sinclair/typebox";
import * as v from "valibot";

export interface OrderCheckoutPayload {
  orderId: string;
  customerId: string;
  currency: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: Array<{
    sku: string;
    quantity: number;
    unitPrice: number;
    title: string;
  }>;
  shippingAddress: {
    recipientName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
  };
  discountCode: string | null;
  placedAt: string;
  [key: string]: unknown;
}

export const ORDER_CHECKOUT_BASELINE: OrderCheckoutPayload = {
  orderId: "ord_8820194",
  customerId: "cust_12345",
  currency: "USD",
  totalAmount: 149.99,
  status: "PROCESSING",
  items: [
    {
      sku: "SKU-99201",
      quantity: 2,
      unitPrice: 49.99,
      title: "Ergonomic Mechanical Keyboard"
    },
    {
      sku: "SKU-33012",
      quantity: 1,
      unitPrice: 50.01,
      title: "USB-C Braided Cable 2m"
    }
  ],
  shippingAddress: {
    recipientName: "Alex Mercer",
    streetAddress: "404 Innovation Way",
    city: "Austin",
    state: "TX",
    zip: "78701"
  },
  discountCode: null,
  placedAt: "2024-03-15T09:15:00.000Z"
};

// Zod Schema
export const OrderCheckoutZodSchema = z.object({
  orderId: z.string().startsWith("ord_"),
  customerId: z.string().min(3),
  currency: z.string().length(3),
  totalAmount: z.number().positive(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  items: z.array(
    z.object({
      sku: z.string().min(3),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
      title: z.string().min(1)
    })
  ).min(1),
  shippingAddress: z.object({
    recipientName: z.string().min(2),
    streetAddress: z.string().min(5),
    city: z.string().min(1),
    state: z.string().length(2),
    zip: z.string().regex(/^\d{5}$/)
  }),
  discountCode: z.string().nullable(),
  placedAt: z.string().datetime()
});

// TypeBox Schema
export const OrderCheckoutTypeBoxSchema = Type.Object({
  orderId: Type.String({ pattern: "^ord_" }),
  customerId: Type.String({ minLength: 3 }),
  currency: Type.String({ minLength: 3, maxLength: 3 }),
  totalAmount: Type.Number({ minimum: 0.01 }),
  status: Type.Union([
    Type.Literal("PENDING"),
    Type.Literal("PROCESSING"),
    Type.Literal("SHIPPED"),
    Type.Literal("DELIVERED"),
    Type.Literal("CANCELLED")
  ]),
  items: Type.Array(
    Type.Object({
      sku: Type.String({ minLength: 3 }),
      quantity: Type.Integer({ minimum: 1 }),
      unitPrice: Type.Number({ minimum: 0.01 }),
      title: Type.String({ minLength: 1 })
    }),
    { minItems: 1 }
  ),
  shippingAddress: Type.Object({
    recipientName: Type.String({ minLength: 2 }),
    streetAddress: Type.String({ minLength: 5 }),
    city: Type.String({ minLength: 1 }),
    state: Type.String({ minLength: 2, maxLength: 2 }),
    zip: Type.String({ pattern: "^\\d{5}$" })
  }),
  discountCode: Type.Union([Type.String(), Type.Null()]),
  placedAt: Type.String({ format: "date-time" })
});

// Valibot Schema
export const OrderCheckoutValibotSchema = v.object({
  orderId: v.pipe(v.string(), v.startsWith("ord_")),
  customerId: v.pipe(v.string(), v.minLength(3)),
  currency: v.pipe(v.string(), v.length(3)),
  totalAmount: v.pipe(v.number(), v.minValue(0.01)),
  status: v.picklist(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  items: v.pipe(
    v.array(
      v.object({
        sku: v.pipe(v.string(), v.minLength(3)),
        quantity: v.pipe(v.number(), v.integer(), v.minValue(1)),
        unitPrice: v.pipe(v.number(), v.minValue(0.01)),
        title: v.pipe(v.string(), v.minLength(1))
      })
    ),
    v.minLength(1)
  ),
  shippingAddress: v.object({
    recipientName: v.pipe(v.string(), v.minLength(2)),
    streetAddress: v.pipe(v.string(), v.minLength(5)),
    city: v.pipe(v.string(), v.minLength(1)),
    state: v.pipe(v.string(), v.length(2)),
    zip: v.pipe(v.string(), v.regex(/^\d{5}$/))
  }),
  discountCode: v.nullable(v.string()),
  placedAt: v.pipe(v.string(), v.isoTimestamp())
});
