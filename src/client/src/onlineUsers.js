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
var react_redux_1 = require("react-redux");
var typesClient_1 = require("./typesClient");
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
function OnlineUsers(props) {
    var onlineUsers = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.onlineUsers) === null || _a === void 0 ? void 0 : _a.filter(function (each) { return each.id != state.user.id; }); });
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "onlineUsers-container" }, { children: [(0, jsx_runtime_1.jsx)("h3", { children: "Chats" }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "user-online", onClick: function () {
                    props.changeUserToChat(typesClient_1.GeneralChat);
                } }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: "General Message", surname: "General Message", photourl: "/toAll.png" }), (0, jsx_runtime_1.jsx)("h4", { children: "General Chat" })] })), onlineUsers &&
                onlineUsers.map(function (each) {
                    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "user-online", onClick: function () {
                            props.changeUserToChat(each);
                        } }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: each.name, surname: each.surname, photourl: each.photourl }), (0, jsx_runtime_1.jsxs)("h4", { children: [each.name, " ", each.surname] })] }), each.id));
                })] })));
}
exports.default = OnlineUsers;
