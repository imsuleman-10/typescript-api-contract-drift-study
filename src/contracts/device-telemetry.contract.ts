import { z } from "zod";
import { Type } from "@sinclair/typebox";
import * as v from "valibot";

export interface DeviceTelemetryPayload {
  deviceId: string;
  firmwareVersion: string;
  batteryLevel: number;
  healthStatus: "HEALTHY" | "DEGRADED" | "CRITICAL";
  readings: Array<{
    sensorType: string;
    value: number;
    unit: string;
    recordedAt: string;
  }>;
  location: {
    latitude: number;
    longitude: number;
    altitudeMeters: number;
  };
  uptimeSeconds: number;
  lastSync: string;
  [key: string]: unknown;
}

export const DEVICE_TELEMETRY_BASELINE: DeviceTelemetryPayload = {
  deviceId: "iot_sens_771029",
  firmwareVersion: "2.4.1",
  batteryLevel: 94.5,
  healthStatus: "HEALTHY",
  readings: [
    {
      sensorType: "TEMPERATURE",
      value: 23.4,
      unit: "CELSIUS",
      recordedAt: "2024-03-15T09:44:50.000Z"
    },
    {
      sensorType: "HUMIDITY",
      value: 48.2,
      unit: "PERCENT",
      recordedAt: "2024-03-15T09:44:50.000Z"
    }
  ],
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
    altitudeMeters: 16.2
  },
  uptimeSeconds: 864200,
  lastSync: "2024-03-15T09:45:00.000Z"
};

// Zod Schema
export const DeviceTelemetryZodSchema = z.object({
  deviceId: z.string().startsWith("iot_sens_"),
  firmwareVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  batteryLevel: z.number().min(0).max(100),
  healthStatus: z.enum(["HEALTHY", "DEGRADED", "CRITICAL"]),
  readings: z.array(
    z.object({
      sensorType: z.string().min(2),
      value: z.number(),
      unit: z.string().min(1),
      recordedAt: z.string().datetime()
    })
  ).min(1),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    altitudeMeters: z.number()
  }),
  uptimeSeconds: z.number().int().nonnegative(),
  lastSync: z.string().datetime()
});

// TypeBox Schema
export const DeviceTelemetryTypeBoxSchema = Type.Object({
  deviceId: Type.String({ pattern: "^iot_sens_" }),
  firmwareVersion: Type.String({ pattern: "^\\d+\\.\\d+\\.\\d+$" }),
  batteryLevel: Type.Number({ minimum: 0, maximum: 100 }),
  healthStatus: Type.Union([
    Type.Literal("HEALTHY"),
    Type.Literal("DEGRADED"),
    Type.Literal("CRITICAL")
  ]),
  readings: Type.Array(
    Type.Object({
      sensorType: Type.String({ minLength: 2 }),
      value: Type.Number(),
      unit: Type.String({ minLength: 1 }),
      recordedAt: Type.String({ format: "date-time" })
    }),
    { minItems: 1 }
  ),
  location: Type.Object({
    latitude: Type.Number({ minimum: -90, maximum: 90 }),
    longitude: Type.Number({ minimum: -180, maximum: 180 }),
    altitudeMeters: Type.Number()
  }),
  uptimeSeconds: Type.Integer({ minimum: 0 }),
  lastSync: Type.String({ format: "date-time" })
});

// Valibot Schema
export const DeviceTelemetryValibotSchema = v.object({
  deviceId: v.pipe(v.string(), v.startsWith("iot_sens_")),
  firmwareVersion: v.pipe(v.string(), v.regex(/^\d+\.\d+\.\d+$/)),
  batteryLevel: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
  healthStatus: v.picklist(["HEALTHY", "DEGRADED", "CRITICAL"]),
  readings: v.pipe(
    v.array(
      v.object({
        sensorType: v.pipe(v.string(), v.minLength(2)),
        value: v.number(),
        unit: v.pipe(v.string(), v.minLength(1)),
        recordedAt: v.pipe(v.string(), v.isoTimestamp())
      })
    ),
    v.minLength(1)
  ),
  location: v.object({
    latitude: v.pipe(v.number(), v.minValue(-90), v.maxValue(90)),
    longitude: v.pipe(v.number(), v.minValue(-180), v.maxValue(180)),
    altitudeMeters: v.number()
  }),
  uptimeSeconds: v.pipe(v.number(), v.integer(), v.minValue(0)),
  lastSync: v.pipe(v.string(), v.isoTimestamp())
});
