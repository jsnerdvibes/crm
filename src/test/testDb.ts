import { db, prisma } from '../core/db';
import { config } from '../config';

async function testDb() {
  console.log('========== DB TEST START ==========\n');
  console.log('Tenancy Mode:', config.tenancy.mode, '\n');

  // ------------------------------------
  // 1️⃣ Test default prisma (no tenancy)
  // ------------------------------------
  try {
    console.log('➡ Testing base prisma…');

    const result = await prisma.$queryRawUnsafe('SELECT 1 as ok;');
    console.log('Base Prisma OK:', result);
  } catch (err) {
    console.error('❌ Base Prisma Error:', err);
  }

  // ------------------------------------
  // 2️⃣ Test DB wrapper with tenantId
  // ------------------------------------
  try {
    console.log("\n➡ Testing db('tenant1')…");

    const tenantClient = db('tenant1');

    const result = await tenantClient.$queryRawUnsafe('SELECT 2 as ok;');
    console.log('Tenant DB OK:', result);
  } catch (err) {
    console.error('❌ Tenant DB Error:', err);
  }

  // ------------------------------------
  // 3️⃣ Test missing tenantId (Schema mode only)
  // ------------------------------------
  if (config.tenancy.mode === 'schema') {
    try {
      console.log('\n➡ Testing db() without tenantId in schema mode…');
      db(); // should throw
    } catch (err) {
      console.log('Expected Error:', err);
    }
  }

  // ------------------------------------
  // 4️⃣ Test field mode injection
  // ------------------------------------
  if (config.tenancy.mode === 'field') {
    try {
      console.log('\n➡ Testing Field Mode tenantId injection…');

      const tenantClient = db('tenantABC');

      const result = await tenantClient.user.findMany({
        where: { email: 'test@example.com' },
      });

      console.log('Field Mode Query Result:');
      console.log(result);
      console.log(
        '(If working: this query was forced where tenantId = tenantABC)'
      );
    } catch (err) {
      console.error('❌ Field Mode Test Error:', err);
    }
  }

  console.log('\n========== DB TEST END ==========');
  await prisma.$disconnect();
}

testDb();
