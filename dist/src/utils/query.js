"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryString = getQueryString;
exports.getQueryBoolean = getQueryBoolean;
function getQueryString(value) {
    return typeof value === 'string' ? value : undefined;
}
function getQueryBoolean(value) {
    if (typeof value !== 'string')
        return undefined;
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    return undefined;
}
