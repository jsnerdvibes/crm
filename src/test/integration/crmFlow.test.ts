import { describe, it, expect, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../app';

// --------------------------------------------------------------------------
// UNMOCK STRATEGY: Disable setup.ts global mocks for database, config, JWT, bcrypt, and hash
// --------------------------------------------------------------------------
vi.unmock('../../core/db');
vi.unmock('../../config');
vi.unmock('jsonwebtoken');
vi.unmock('bcrypt');
vi.unmock('../../utils/hash');
vi.unmock('../../utils/audit.log');

import { prisma } from '../../core/db';

describe('End-to-End CRM Integration Flow (Auth -> Users -> Leads)', () => {
  const testTenantName = 'Stark Industries Dev';
  const testTenantSlug = 'stark-industries-dev';
  
  const adminEmail = 'tony@stark.dev';
  const adminPassword = 'securepassword123';
  
  const salesEmail = 'pepper@stark.dev';
  const salesPassword = 'pepperpassword123';
  const salesName = 'Pepper Potts';

  let tenantId: string;
  let adminUserId: string;
  
  let adminAccessToken: string;
  let adminRefreshToken: string;
  
  let salesUserId: string;
  let leadId: string;

  afterAll(async () => {
    // Clean up all data created for the test tenant to avoid polluting database
    if (tenantId) {
      await prisma.activity.deleteMany({ where: { tenantId } });
      await prisma.auditLog.deleteMany({ where: { tenantId } });
      await prisma.setting.deleteMany({ where: { tenantId } });
      await prisma.deal.deleteMany({ where: { tenantId } });
      await prisma.lead.deleteMany({ where: { tenantId } });
      await prisma.contact.deleteMany({ where: { tenantId } });
      await prisma.company.deleteMany({ where: { tenantId } });
      await prisma.refreshToken.deleteMany({ where: { user: { tenantId } } });
      await prisma.user.deleteMany({ where: { tenantId } });
      await prisma.tenant.delete({ where: { id: tenantId } });
    }
    await prisma.$disconnect();
  });

  /* -------------------------------------------------------------------------- */
  /*                               1. AUTHENTICATION                            */
  /* -------------------------------------------------------------------------- */
  describe('Onboarding & Authentication Flow', () => {
    it('should register a new tenant and default admin', async () => {
      // Clean up tenant if leftovers exist from previous failed test runs
      const existingTenant = await prisma.tenant.findUnique({ where: { slug: testTenantSlug } });
      if (existingTenant) {
        tenantId = existingTenant.id;
        await prisma.activity.deleteMany({ where: { tenantId } });
        await prisma.auditLog.deleteMany({ where: { tenantId } });
        await prisma.setting.deleteMany({ where: { tenantId } });
        await prisma.deal.deleteMany({ where: { tenantId } });
        await prisma.lead.deleteMany({ where: { tenantId } });
        await prisma.contact.deleteMany({ where: { tenantId } });
        await prisma.company.deleteMany({ where: { tenantId } });
        await prisma.refreshToken.deleteMany({ where: { user: { tenantId } } });
        await prisma.user.deleteMany({ where: { tenantId } });
        await prisma.tenant.delete({ where: { id: tenantId } });
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          tenantName: testTenantName,
          email: adminEmail,
          password: adminPassword,
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.tenantId).toBeDefined();
      expect(response.body.data.adminUserId).toBeDefined();

      tenantId = response.body.data.tenantId;
      adminUserId = response.body.data.adminUserId;
    });

    it('should fail to register the same tenant name (slug conflict)', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          tenantName: testTenantName,
          email: 'anotheradmin@stark.dev',
          password: adminPassword,
        });

      expect(response.status).toBe(400);
    });

    it('should successfully login as the admin user and return tokens', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: adminEmail,
          password: adminPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      adminAccessToken = response.body.data.accessToken;
      adminRefreshToken = response.body.data.refreshToken;
    });

    it('should successfully refresh the access token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: adminRefreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      adminAccessToken = response.body.data.accessToken;
      adminRefreshToken = response.body.data.refreshToken;
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                               2. USER MANAGEMENT                           */
  /* -------------------------------------------------------------------------- */
  describe('User Management Flow', () => {
    it('should create a new SALES user', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          email: salesEmail,
          password: salesPassword,
          name: salesName,
          role: 'SALES',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.email).toBe(salesEmail);
      expect(response.body.data.role).toBe('SALES');

      salesUserId = response.body.data.id;
    });

    it('should list all users under the tenant including admin and sales', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.users).toBeDefined();

      const userEmails = response.body.data.users.map((u: any) => u.email);
      expect(userEmails).toContain(adminEmail);
      expect(userEmails).toContain(salesEmail);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                               3. LEAD FLOW                                 */
  /* -------------------------------------------------------------------------- */
  describe('Lead Management & Conversion Flow', () => {
    it('should create a new lead', async () => {
      const response = await request(app)
        .post('/api/v1/leads')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Arc Reactor Supply Deal',
          description: 'Clean energy reactor lead',
          source: 'Website Form',
          status: 'NEW',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('Arc Reactor Supply Deal');
      expect(response.body.data.assignedToId).toBeNull();

      leadId = response.body.data.id;
    });

    it('should assign the lead to the sales user', async () => {
      const response = await request(app)
        .patch(`/api/v1/leads/${leadId}/assign`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          assignedToId: salesUserId,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.assignedToId).toBe(salesUserId);
    });

    it('should convert the lead to a Contact and Deal', async () => {
      const response = await request(app)
        .post(`/api/v1/leads/${leadId}/convert`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.leadId).toBe(leadId);
      expect(response.body.data.contactId).toBeDefined();
      expect(response.body.data.dealId).toBeDefined();

      const { contactId, dealId } = response.body.data;

      // 1️⃣ Verify Lead is now qualified
      const dbLead = await prisma.lead.findUnique({ where: { id: leadId } });
      expect(dbLead?.status).toBe('QUALIFIED');
      expect(dbLead?.contactId).toBe(contactId);

      // 2️⃣ Verify Contact is created
      const dbContact = await prisma.contact.findUnique({ where: { id: contactId } });
      expect(dbContact).not.toBeNull();
      expect(dbContact?.firstName).toBe('Arc Reactor Supply Deal');

      // 3️⃣ Verify Deal is created and assigned to sales user
      const dbDeal = await prisma.deal.findUnique({ where: { id: dealId } });
      expect(dbDeal).not.toBeNull();
      expect(dbDeal?.title).toBe('Arc Reactor Supply Deal');
      expect(dbDeal?.assignedToId).toBe(salesUserId);
      expect(dbDeal?.stage).toBe('QUALIFICATION');
    });
  });
});
