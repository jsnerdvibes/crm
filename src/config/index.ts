import dotenv from 'dotenv';
import { z } from 'zod';

// Load env
dotenv.config();

// Schema validation
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.string().default('4000'),
  CORS_ORIGINS: z.string().default('http://localhost:3001'),

  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.string().default('3306'),

  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16, 'JWT_SECRET must be at least 16 characters long'),
  JWT_EXPIRES_IN: z.string().default('15m'),

  TENANCY_MODE: z.enum(['schema', 'field']).default('schema'),

  BCRYPT_SALT_ROUNDS: z.string().default('10'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.toString());
  console.error(parsed.error.issues);
  process.exit(1);
}

const env = parsed.data;

// Final structured config
export const config = {
  app: {
    env: env.NODE_ENV,
    port: Number(env.PORT),
    corsOrigins: env.CORS_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },

  bcrypt: {
    saltRounds: Number(env.BCRYPT_SALT_ROUNDS),
  },

  database: {
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    dbName: env.DATABASE_NAME,
    dbPort: env.DATABASE_PORT,
  },

  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  tenancy: {
    mode: env.TENANCY_MODE,
  },
} as const;

export type AppConfig = typeof config;
