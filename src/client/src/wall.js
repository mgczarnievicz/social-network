"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var writeWall_1 = __importDefault(require("./writeWall"));
var wallPost_1 = __importDefault(require("./wallPost"));
function Wall(props) {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(writeWall_1.default, { wallUserId: props.wallUserId }), (0, jsx_runtime_1.jsx)(wallPost_1.default, { wallUserId: props.wallUserId })] }));
}
exports.default = Wall;