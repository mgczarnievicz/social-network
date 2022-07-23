"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var slice_1 = __importDefault(require("./friends/slice"));
var slice_2 = __importDefault(require("./user/slice"));
var slice_3 = __importDefault(require("./messages/slice"));
var slice_4 = __importDefault(require("./wall/slice"));
var slice_5 = __importDefault(require("./comments/slice"));
var rootReducer = (0, redux_1.combineReducers)({
    friends: slice_1.default,
    user: slice_2.default,
    messages: slice_3.default,
    posts: slice_4.default,
    comments: slice_5.default,
});
exports.default = rootReducer;
