"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTargetType = isTargetType;
const dto_1 = require("./dto");
function isTargetType(value) {
    return typeof value === 'string' && dto_1.TargetTypes.includes(value);
}
