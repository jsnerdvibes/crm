// src/testPrisma.ts
import { prisma } from '../core/db';

async function main() {
  try {
    console.log('Fetching users from the database...');

    const users = await prisma.user.findMany();

    console.log('✅ Users fetched successfully:');
    console.log(users);
  } catch (err) {
    console.error('❌ Error fetching users:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
