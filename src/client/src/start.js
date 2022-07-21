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
// To be able to use Global State
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var redux_thunk_1 = __importDefault(require("redux-thunk"));
var reducer_1 = __importDefault(require("./redux/reducer"));
var react_dom_1 = __importDefault(require("react-dom"));
var welcome_1 = __importDefault(require("./welcome"));
var app_1 = __importDefault(require("./app"));
// import { init } from "./socket";
var store = (0, redux_1.createStore)(reducer_1.default, (0, redux_1.applyMiddleware)(redux_thunk_1.default));
// composeWithDevTools(applyMiddleware(immutableState.default()));
fetch("/user/id.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    console.log("data from /user/id.json ", data);
    if (!data.userId) {
        react_dom_1.default.render((0, jsx_runtime_1.jsx)(welcome_1.default, {}), document.querySelector("main"));
    }
    else {
        // I want to initialize Websocket connection ans pass the store to it
        // init(store);
        react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ store: store }, { children: (0, jsx_runtime_1.jsx)(app_1.default, {}) })), document.querySelector("main"));
    }
});
