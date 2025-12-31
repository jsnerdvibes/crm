// src/testPrisma.ts
import { prisma } from '../core/db';
import { logger } from '../core/logger';

async function main() {
  try {
    logger.info('Fetching users from the database...');

    const users = await prisma.user.findMany();

    logger.info('✅ Users fetched successfully:');
    logger.info(users);
  } catch (err) {
    logger.error('❌ Error fetching users:');
    logger.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
