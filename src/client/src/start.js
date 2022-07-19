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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_dom_1 = __importDefault(require("react-dom"));
var welcome_1 = __importDefault(require("./welcome"));
var app_1 = __importDefault(require("./app"));
// To be able to use Global State
var redux_1 = require("redux");
var immutableState = __importStar(require("redux-immutable-state-invariant"));
var redux_devtools_extension_1 = require("redux-devtools-extension");
var react_redux_1 = require("react-redux");
var reducer_1 = __importDefault(require("./redux/reducer"));
var store = (0, redux_1.createStore)(reducer_1.default, (0, redux_devtools_extension_1.composeWithDevTools)((0, redux_1.applyMiddleware)(immutableState.default())));
fetch("/user/id.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    console.log("data from /user/id.json ", data);
    if (!data.userId) {
        react_dom_1.default.render((0, jsx_runtime_1.jsx)(welcome_1.default, {}), document.querySelector("main"));
    }
    else {
        react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ store: store }, { children: (0, jsx_runtime_1.jsx)(app_1.default, {}) })), document.querySelector("main"));
    }
});
