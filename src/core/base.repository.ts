/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from './db';
import { NotFoundError } from './error';

export interface IBaseRepository<T, CreateInput, UpdateInput> {
  create(tenantId: string, data: CreateInput): Promise<T>;
  findById(tenantId: string, id: string): Promise<T | null>;
  update(tenantId: string, id: string, data: UpdateInput): Promise<T>;
  delete(tenantId: string, id: string): Promise<void>;
}

export class BaseRepository<T, CreateInput, UpdateInput> implements IBaseRepository<T, CreateInput, UpdateInput> {
  constructor(protected readonly modelName: string) {}

  protected get model() {
    return (prisma as any)[this.modelName];
  }

  async create(tenantId: string, data: CreateInput): Promise<T> {
    return this.model.create({
      data: {
        ...(data as any),
        tenantId,
      },
    });
  }

  async findById(tenantId: string, id: string): Promise<T | null> {
    return this.model.findFirst({
      where: { id, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: UpdateInput): Promise<T> {
    const result = await this.model.updateMany({
      where: { id, tenantId },
      data: data as any,
    });

    if (result.count === 0) {
      throw new NotFoundError(`${this.modelName} not found`);
    }

    const item = await this.findById(tenantId, id);
    if (!item) {
      throw new NotFoundError(`${this.modelName} not found after update`);
    }

    return item;
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.model.deleteMany({
      where: { id, tenantId },
    });
  }
}
