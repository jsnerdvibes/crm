"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogResources = exports.LogActions = void 0;
var LogActions;
(function (LogActions) {
    LogActions["CREATE"] = "CREATE";
    LogActions["UPDATE"] = "UPDATE";
    LogActions["DELETE"] = "DELETE";
    LogActions["DEACTIVATE"] = "DEACTIVATE";
    LogActions["ASSIGNED"] = "ASSIGNED";
    LogActions["UPDATE_STAGE"] = "UPDATE_STAGE";
    LogActions["CONVERT"] = "CONVERT";
})(LogActions || (exports.LogActions = LogActions = {}));
var LogResources;
(function (LogResources) {
    LogResources["USER"] = "USER";
    LogResources["LEAD"] = "LEAD";
    LogResources["DEAL"] = "DEAL";
    LogResources["CONTACT"] = "CONTACT";
    LogResources["COMPANY"] = "COMPANY";
    LogResources["ACTIVITY"] = "ACTIVITY";
})(LogResources || (exports.LogResources = LogResources = {}));
