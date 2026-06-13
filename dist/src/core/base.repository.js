"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const db_1 = require("./db");
const error_1 = require("./error");
class BaseRepository {
    constructor(modelName) {
        this.modelName = modelName;
    }
    get model() {
        return db_1.prisma[this.modelName];
    }
    async create(tenantId, data) {
        return this.model.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }
    async findById(tenantId, id) {
        return this.model.findFirst({
            where: { id, tenantId },
        });
    }
    async update(tenantId, id, data) {
        const result = await this.model.updateMany({
            where: { id, tenantId },
            data: data,
        });
        if (result.count === 0) {
            throw new error_1.NotFoundError(`${this.modelName} not found`);
        }
        const item = await this.findById(tenantId, id);
        if (!item) {
            throw new error_1.NotFoundError(`${this.modelName} not found after update`);
        }
        return item;
    }
    async delete(tenantId, id) {
        await this.model.deleteMany({
            where: { id, tenantId },
        });
    }
}
exports.BaseRepository = BaseRepository;
