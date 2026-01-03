import { DealStage } from '../../core/db';

// src/modules/deal/types.ts (or activity/types.ts if shared)
export interface DealFilters {
  page?: number;
  limit?: number;
  stage?: DealStage; // Your Prisma enum or your DTO enum
  assignedToId?: string;
  companyId?: string;
  search?: string;
}
