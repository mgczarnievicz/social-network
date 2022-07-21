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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_redux_1 = require("react-redux");
function Chat() {
    var messages = (0, react_redux_1.useSelector)(function (state) { return state.messages; });
    // KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    // React.ChangeEvent<HTMLTextAreaElement>
    var keyCheck = function (event) {
        console.log("What was pass.");
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);
            // after emitting our msg we clear the text area
            event.target.value = "";
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "container-main-width" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Welcome to chat" }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "chat-container" }, { children: (0, jsx_runtime_1.jsx)("p", { children: "Chat Messages" }) })), (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Write a new Message", onKeyDown: keyCheck })] })));
}
exports.default = Chat;
