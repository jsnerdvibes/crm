"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/testPrisma.ts
const db_1 = require("../core/db");
async function main() {
    try {
        console.log('Fetching users from the database...');
        const users = await db_1.prisma.user.findMany();
        console.log('✅ Users fetched successfully:');
        console.log(users);
    }
    catch (err) {
        console.error('❌ Error fetching users:');
        console.error(err);
    }
    finally {
        await db_1.prisma.$disconnect();
    }
}
main();
