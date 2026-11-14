import { z } from "zod";
import { Type, Static } from "@sinclair/typebox";
import * as v from "valibot";

export interface UserProfilePayload {
  userId: string;
  email: string;
  displayName: string;
  role: "ADMIN" | "MEMBER" | "GUEST";
  age: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    theme: "light" | "dark" | "system";
  };
  bio: string | null;
  createdAt: string;
  [key: string]: unknown;
}

export const USER_PROFILE_BASELINE: UserProfilePayload = {
  userId: "usr_948201",
  email: "sarah.connor@example.com",
  displayName: "Sarah Connor",
  role: "ADMIN",
  age: 34,
  address: {
    street: "100 Resistance Way",
    city: "Los Angeles",
    postalCode: "90001",
    country: "USA"
  },
  preferences: {
    newsletter: true,
    theme: "dark"
  },
  bio: null,
  createdAt: "2024-03-15T08:30:00.000Z"
};

// Zod Schema
export const UserProfileZodSchema = z.object({
  userId: z.string().min(5),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  role: z.enum(["ADMIN", "MEMBER", "GUEST"]),
  age: z.number().int().min(18).max(120),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().min(2)
  }),
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(["light", "dark", "system"])
  }),
  bio: z.string().nullable(),
  createdAt: z.string().datetime()
});

// TypeBox Schema
export const UserProfileTypeBoxSchema = Type.Object({
  userId: Type.String({ minLength: 5 }),
  email: Type.String({ format: "email" }),
  displayName: Type.String({ minLength: 1, maxLength: 100 }),
  role: Type.Union([Type.Literal("ADMIN"), Type.Literal("MEMBER"), Type.Literal("GUEST")]),
  age: Type.Integer({ minimum: 18, maximum: 120 }),
  address: Type.Object({
    street: Type.String({ minLength: 1 }),
    city: Type.String({ minLength: 1 }),
    postalCode: Type.String({ pattern: "^\\d{5}(-\\d{4})?$" }),
    country: Type.String({ minLength: 2 })
  }),
  preferences: Type.Object({
    newsletter: Type.Boolean(),
    theme: Type.Union([Type.Literal("light"), Type.Literal("dark"), Type.Literal("system")])
  }),
  bio: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String({ format: "date-time" })
});

// Valibot Schema
export const UserProfileValibotSchema = v.object({
  userId: v.pipe(v.string(), v.minLength(5)),
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  role: v.picklist(["ADMIN", "MEMBER", "GUEST"]),
  age: v.pipe(v.number(), v.integer(), v.minValue(18), v.maxValue(120)),
  address: v.object({
    street: v.pipe(v.string(), v.minLength(1)),
    city: v.pipe(v.string(), v.minLength(1)),
    postalCode: v.pipe(v.string(), v.regex(/^\d{5}(-\d{4})?$/)),
    country: v.pipe(v.string(), v.minLength(2))
  }),
  preferences: v.object({
    newsletter: v.boolean(),
    theme: v.picklist(["light", "dark", "system"])
  }),
  bio: v.nullable(v.string()),
  createdAt: v.pipe(v.string(), v.isoTimestamp())
});
