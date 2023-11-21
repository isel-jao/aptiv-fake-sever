import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  BROKER_URL: z.string().url().default("mqtt://localhost:1883"),
  BROKER_USERNAME: z.string().default("isel"),
  BROKER_PASSWORD: z.string().default("isel123"),
  DEBUG: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
