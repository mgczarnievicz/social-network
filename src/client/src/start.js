"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_dom_1 = __importDefault(require("react-dom"));
var welcome_1 = __importDefault(require("./welcome"));
fetch("/user/id.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    console.log("data from /user/id.json ", data);
    if (!data.userId) {
        react_dom_1.default.render((0, jsx_runtime_1.jsx)(welcome_1.default, {}), document.querySelector("main"));
    }
    else {
        react_dom_1.default.render((0, jsx_runtime_1.jsx)("img", { src: "/HorseMan.png", alt: "logo" }), document.querySelector("main"));
    }
});
