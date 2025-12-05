"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const logger_1 = require("../core/logger");
// Load env
dotenv_1.default.config();
// Schema validation
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: zod_1.z.string().default('4000'),
    DATABASE_HOST: zod_1.z.string(),
    DATABASE_USER: zod_1.z.string(),
    DATABASE_PASSWORD: zod_1.z.string(),
    DATABASE_NAME: zod_1.z.string(),
    DATABASE_PORT: zod_1.z.string().default('3306'),
    JWT_SECRET: zod_1.z
        .string()
        .min(16, 'JWT_SECRET must be at least 16 characters long'),
    JWT_REFRESH_SECRET: zod_1.z
        .string()
        .min(16, 'JWT_SECRET must be at least 16 characters long'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    TENANCY_MODE: zod_1.z.enum(['schema', 'field']).default('schema'),
    BCRYPT_SALT_ROUNDS: zod_1.z.string().default('10'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    logger_1.logger.error('Invalid environment variables:');
    logger_1.logger.error(parsed.error.toString());
    logger_1.logger.error(parsed.error.issues);
    process.exit(1);
}
const env = parsed.data;
// Final structured config
exports.config = {
    app: {
        env: env.NODE_ENV,
        port: Number(env.PORT),
    },
    bcrypt: {
        saltRounds: Number(env.BCRYPT_SALT_ROUNDS),
    },
    database: {
        host: env.DATABASE_HOST,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        dbName: env.DATABASE_NAME,
        dbPort: env.DATABASE_PORT
    },
    jwt: {
        secret: env.JWT_SECRET,
        refreshSecret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
    },
    tenancy: {
        mode: env.TENANCY_MODE,
    },
};
