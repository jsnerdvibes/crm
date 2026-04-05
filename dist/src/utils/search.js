"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchOR = buildSearchOR;
function buildSearchOR(search, fields = []) {
    if (!search)
        return undefined;
    return {
        OR: fields.map((field) => ({
            [field]: {
                contains: search,
            },
        })),
    };
}
