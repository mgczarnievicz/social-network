"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.hash = function (password) {
    return bcryptjs_1.default.genSalt().then(function (salt) {
        return bcryptjs_1.default.hash(password, salt);
    });
};
exports.compare = bcryptjs_1.default.compare;
