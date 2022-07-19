"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var slice_1 = __importDefault(require("./friends/slice"));
var rootReducer = (0, redux_1.combineReducers)({
    friends: slice_1.default,
});
exports.default = rootReducer;
