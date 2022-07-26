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
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
var bioEditor_1 = __importDefault(require("./bioEditor"));
var friends_1 = __importDefault(require("./friends"));
function Profile(props) {
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "profile-component container-main-width shadow" }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { toggleUploader: props.toggleUploader }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "profile-bio" }, { children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["Welcome ", userInfo.name] }), (0, jsx_runtime_1.jsx)(bioEditor_1.default, {})] })), userInfo.id && (0, jsx_runtime_1.jsx)(friends_1.default, { otherUserId: userInfo.id })] })));
}
exports.default = Profile;
