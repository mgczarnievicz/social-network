"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var registration_1 = __importDefault(require("./registration"));
var login_1 = __importDefault(require("./login"));
var react_router_dom_1 = require("react-router-dom");
function Welcome() {
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ id: "welcome" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Welcome!" }), (0, jsx_runtime_1.jsx)("img", { src: "/logo.png" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ exact: true, path: "/" }, { children: (0, jsx_runtime_1.jsx)(registration_1.default, {}) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/login" }, { children: (0, jsx_runtime_1.jsx)(login_1.default, {}) }))] }) })] })));
}
exports.default = Welcome;
