"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/testPrisma.ts
const db_1 = require("../core/db");
const logger_1 = require("../core/logger");
async function main() {
    try {
        logger_1.logger.info('Fetching users from the database...');
        const users = await db_1.prisma.user.findMany();
        logger_1.logger.info('✅ Users fetched successfully:');
        logger_1.logger.info(users);
    }
    catch (err) {
        logger_1.logger.error('❌ Error fetching users:');
        logger_1.logger.error(err);
    }
    finally {
        await db_1.prisma.$disconnect();
    }
}
main();
