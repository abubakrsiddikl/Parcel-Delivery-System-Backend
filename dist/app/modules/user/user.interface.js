"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.Role = void 0;
// role enum
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["SENDER"] = "sender";
    Role["RECEIVER"] = "receiver";
})(Role || (exports.Role = Role = {}));
// user activate check
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
    IsActive["UNBLOCKED"] = "UNBLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
