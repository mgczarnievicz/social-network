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
var react_1 = require("react");
var chatMessage_1 = __importDefault(require("./chatMessage"));
var onlineUsers_1 = __importDefault(require("./onlineUsers"));
var typesClient_1 = require("./typesClient");
// GeneralChat
function Chat() {
    var _a = (0, react_1.useState)(typesClient_1.GeneralChat), userToChat = _a[0], setUserToChat = _a[1];
    function changeUserToChat(userInfo) {
        console.log("userId", userInfo);
        setUserToChat(userInfo);
    }
    console.log("userToChat", userToChat);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "chat-container" }, { children: [(0, jsx_runtime_1.jsx)(chatMessage_1.default, { userIdToTalk: userToChat }), (0, jsx_runtime_1.jsx)(onlineUsers_1.default, { changeUserToChat: changeUserToChat })] })));
}
exports.default = Chat;
