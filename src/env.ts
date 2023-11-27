import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  BROKER_URL: z.string().url().default("mqtt://localhost:1883"),
  BROKER_USERNAME: z.string().default("root"),
  BROKER_PASSWORD: z.string().default("toor"),
  DEBUG: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
