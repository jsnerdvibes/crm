import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../app';

// --------------------------------------------------------------------------
// UNMOCK STRATEGY: Disable setup.ts global mocks for database, config, and JWT
// --------------------------------------------------------------------------
vi.unmock('../../core/db');
vi.unmock('../../config');
vi.unmock('jsonwebtoken');
vi.unmock('../../utils/audit.log');

import { prisma } from '../../core/db';
import { config } from '../../config';
import jwt from 'jsonwebtoken';

describe('Multi-Tenant Isolation Integration Tests', () => {
  let tokenA: string; // Tenant A (Acme Corp)
  let tokenB: string; // Tenant B (Wayne Enterprises)
  
  let tenantA: any;
  let tenantB: any;
  
  let userA: any;
  let userB: any;

  // Tenant A seeded entities
  let leadA: any;
  let companyA: any;
  let contactA: any;
  let dealA: any;
  let activityA: any;

  // Tenant B seeded entities
  let leadB: any;
  let companyB: any;
  let contactB: any;
  let dealB: any;
  let activityB: any;

  beforeAll(async () => {
    // 1️⃣ Fetch seeded tenants from the real database
    tenantA = await prisma.tenant.findUnique({ where: { slug: 'acme-corp' } });
    tenantB = await prisma.tenant.findUnique({ where: { slug: 'wayne-enterprises' } });

    if (!tenantA || !tenantB) {
      throw new Error('Test tenants not found in database. Run prisma/seed.ts first.');
    }

    // 2️⃣ Fetch users for both tenants
    userA = await prisma.user.findFirst({ where: { tenantId: tenantA.id, email: 'admin@acme.com' } });
    userB = await prisma.user.findFirst({ where: { tenantId: tenantB.id, email: 'admin@wayne.com' } });

    if (!userA || !userB) {
      throw new Error('Test users not found in database. Run prisma/seed.ts first.');
    }

    // 3️⃣ Generate valid authentication tokens signed with the server JWT secret
    tokenA = jwt.sign(
      { sub: userA.id, role: userA.role, tenantId: tenantA.id },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    tokenB = jwt.sign(
      { sub: userB.id, role: userB.role, tenantId: tenantB.id },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // 4️⃣ Retrieve seeded Tenant A items
    leadA = await prisma.lead.findFirst({ where: { tenantId: tenantA.id } });
    companyA = await prisma.company.findFirst({ where: { tenantId: tenantA.id } });
    contactA = await prisma.contact.findFirst({ where: { tenantId: tenantA.id } });
    dealA = await prisma.deal.findFirst({ where: { tenantId: tenantA.id } });
    activityA = await prisma.activity.findFirst({ where: { tenantId: tenantA.id } });

    // 5️⃣ Retrieve seeded Tenant B items
    leadB = await prisma.lead.findFirst({ where: { tenantId: tenantB.id } });
    companyB = await prisma.company.findFirst({ where: { tenantId: tenantB.id } });
    contactB = await prisma.contact.findFirst({ where: { tenantId: tenantB.id } });
    dealB = await prisma.deal.findFirst({ where: { tenantId: tenantB.id } });
    activityB = await prisma.activity.findFirst({ where: { tenantId: tenantB.id } });
  });

  afterAll(async () => {
    // Clean up connections
    await prisma.$disconnect();
  });

  /* -------------------------------------------------------------------------- */
  /*                                LEAD MODULE                                 */
  /* -------------------------------------------------------------------------- */
  describe('Lead Isolation', () => {
    it('User A: GET /leads should return only Tenant A leads', async () => {
      const response = await request(app)
        .get('/api/v1/leads')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.leads).toBeDefined();
      
      const leadIds = response.body.data.leads.map((l: any) => l.id);
      expect(leadIds).toContain(leadA.id);
      expect(leadIds).not.toContain(leadB.id);
    });

    it('User A: GET /leads/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .get(`/api/v1/leads/${leadB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });

    it('User A: PATCH /leads/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .patch(`/api/v1/leads/${leadB.id}`)
        .send({ title: 'Hacked Title' })
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);

      // Verify DB was not changed
      const dbLead = await prisma.lead.findUnique({ where: { id: leadB.id } });
      expect(dbLead?.title).not.toBe('Hacked Title');
    });

    it('User A: DELETE /leads/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .delete(`/api/v1/leads/${leadB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);

      // Verify DB still contains the lead
      const dbLead = await prisma.lead.findUnique({ where: { id: leadB.id } });
      expect(dbLead).not.toBeNull();
    });

    it('User A: POST /leads/:id/convert of Tenant B should return 404', async () => {
      const response = await request(app)
        .post(`/api/v1/leads/${leadB.id}/convert`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                DEAL MODULE                                 */
  /* -------------------------------------------------------------------------- */
  describe('Deal Isolation', () => {
    it('User A: GET /deals should return only Tenant A deals', async () => {
      const response = await request(app)
        .get('/api/v1/deals')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.deals).toBeDefined();

      const dealIds = response.body.data.deals.map((d: any) => d.id);
      expect(dealIds).toContain(dealA.id);
      expect(dealIds).not.toContain(dealB.id);
    });

    it('User A: GET /deals/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .get(`/api/v1/deals/${dealB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });

    it('User A: PATCH /deals/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .patch(`/api/v1/deals/${dealB.id}`)
        .send({ title: 'Hacked Deal' })
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                               COMPANY MODULE                               */
  /* -------------------------------------------------------------------------- */
  describe('Company Isolation', () => {
    it('User A: GET /companies should return only Tenant A companies', async () => {
      const response = await request(app)
        .get('/api/v1/companies')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();

      const companyIds = response.body.data.map((c: any) => c.id);
      expect(companyIds).toContain(companyA.id);
      expect(companyIds).not.toContain(companyB.id);
    });

    it('User A: GET /companies/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .get(`/api/v1/companies/${companyB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                               CONTACT MODULE                               */
  /* -------------------------------------------------------------------------- */
  describe('Contact Isolation', () => {
    it('User A: GET /contacts should return only Tenant A contacts', async () => {
      const response = await request(app)
        .get('/api/v1/contacts')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      
      const contactIds = response.body.data.map((c: any) => c.id);
      expect(contactIds).toContain(contactA.id);
      expect(contactIds).not.toContain(contactB.id);
    });

    it('User A: GET /contacts/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .get(`/api/v1/contacts/${contactB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                              ACTIVITY MODULE                               */
  /* -------------------------------------------------------------------------- */
  describe('Activity Isolation', () => {
    it('User A: GET /activities should return only Tenant A activities', async () => {
      const response = await request(app)
        .get('/api/v1/activities')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      const activityIds = response.body.data.activities.map((a: any) => a.id);
      expect(activityIds).toContain(activityA.id);
      expect(activityIds).not.toContain(activityB.id);
    });

    it('User A: GET /activities/:id of Tenant B should return 404', async () => {
      const response = await request(app)
        .get(`/api/v1/activities/${activityB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                              SETTINGS MODULE                               */
  /* -------------------------------------------------------------------------- */
  describe('Settings Isolation', () => {
    it('User A: GET /settings should return only Tenant A settings', async () => {
      const response = await request(app)
        .get('/api/v1/settings')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      const settingsKeys = response.body.data.map((s: any) => s.key);
      expect(settingsKeys).toContain('theme');
      
      // Verify values
      const themeSetting = response.body.data.find((s: any) => s.key === 'theme');
      expect(themeSetting.value).toBe('dark'); // Tenant A is dark, Tenant B is light
    });

    it('User A: GET /settings/:key of Tenant B should return 404 if not present in Tenant A', async () => {
      // Clear Wayne setting if leftover from previous failed tests
      await prisma.setting.deleteMany({
        where: { tenantId: tenantB.id, key: 'wayne-secret-key' }
      });

      // Create a Wayne-only setting in database directly
      await prisma.setting.create({
        data: {
          tenantId: tenantB.id,
          key: 'wayne-secret-key',
          value: 'batmobile',
        },
      });

      const response = await request(app)
        .get('/api/v1/settings/wayne-secret-key')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);

      // Clean up Wayne setting
      await prisma.setting.delete({
        where: { tenantId_key: { tenantId: tenantB.id, key: 'wayne-secret-key' } }
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                USER MODULE                                 */
  /* -------------------------------------------------------------------------- */
  describe('User Management Isolation', () => {
    it('User A: GET /users should return only Tenant A users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      const userEmails = response.body.data.users.map((u: any) => u.email);
      expect(userEmails).toContain('admin@acme.com');
      expect(userEmails).toContain('user@acme.com');
      expect(userEmails).not.toContain('admin@wayne.com');
      expect(userEmails).not.toContain('user@wayne.com');
    });

    it('User A: GET /users/:id of Tenant B user should return 404', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${userB.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });

    it('User A: PATCH /users/:id of Tenant B user should return 404', async () => {
      const response = await request(app)
        .patch(`/api/v1/users/${userB.id}`)
        .send({ name: 'Hacked Name' })
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                             AUDIT LOG MODULE                               */
  /* -------------------------------------------------------------------------- */
  describe('Audit Log Isolation', () => {
    it('User A: GET /audit-logs should return only Tenant A audit logs', async () => {
      // Generate some audit logs first
      await prisma.auditLog.create({
        data: {
          tenantId: tenantA.id,
          action: 'CREATE',
          resource: 'Lead',
          resourceId: leadA.id,
        },
      });

      await prisma.auditLog.create({
        data: {
          tenantId: tenantB.id,
          action: 'CREATE',
          resource: 'Lead',
          resourceId: leadB.id,
        },
      });

      const response = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      const tenantIds = response.body.data.logs.map((log: any) => log.tenantId);
      expect(tenantIds.every((tId: string) => tId === tenantA.id)).toBe(true);
      expect(tenantIds).not.toContain(tenantB.id);
    });
  });
});
