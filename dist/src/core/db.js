"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.db = db;
const client_1 = require("../../generated/prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const config_1 = require("../config");
const tenantScope_1 = require("./tenantScope");
__exportStar(require("../../generated/prisma/client"), exports);
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host: config_1.config.database.host,
    user: config_1.config.database.user,
    password: config_1.config.database.password,
    database: config_1.config.database.dbName,
    connectionLimit: 5,
});
const prisma = global.__prisma ??
    new client_1.PrismaClient({
        adapter,
        log: ['query', 'error', 'warn'],
    });
exports.prisma = prisma;
if (config_1.config.app.env !== 'production') {
    global.__prisma = prisma;
}
// ---- Multi-Tenant Wrapper ---- //
/**

* Returns a Prisma client scoped to a tenant.
* Supports:
* * schema → switches database schema using USE <tenant_schema>
* * field  → injects tenantId into all queries automatically
    */
function db(tenantId) {
    const mode = config_1.config.tenancy.mode;
    // -------- SCHEMA MODE -------- //
    if (mode === 'schema') {
        if (!tenantId)
            throw new Error('❌ tenantId is required when TENANCY_MODE=schema');
        return prisma.$extends({
            query: {
                $allModels: {
                    async $allOperations({ query, args }) {
                        // Switch MariaDB schema (database)
                        await prisma.$executeRawUnsafe(`USE \`${tenantId}\`;`);
                        return query(args);
                    },
                },
            },
        });
    }
    // -------- FIELD MODE -------- //
    if (mode === 'field') {
        if (!tenantId)
            throw new Error('❌ tenantId is required when TENANCY_MODE=field');
        return prisma.$extends({
            query: {
                $allModels: {
                    async $allOperations({ query, args }) {
                        // Wrap args with tenantScope to inject tenantId consistently
                        const scopedArgs = { ...args };
                        return query((0, tenantScope_1.tenantScope)(scopedArgs, tenantId));
                    },
                },
            },
        });
    }
    // -------- DEFAULT: no multi-tenancy -------- //
    return prisma;
}
