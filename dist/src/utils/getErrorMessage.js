"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
function getErrorMessage(err, fallback) {
    if (err instanceof Error) {
        return err.message;
    }
    return fallback;
}
