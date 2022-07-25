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
var post_1 = __importDefault(require("./post"));
function WallPost(props) {
    // In Global State is where the information of the post to display is.
    var posts = (0, react_redux_1.useSelector)(function (state) { return state.posts; });
    console.log("posts to display", posts);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "posts-container" }, { children: posts &&
            posts.map(function (each) {
                return (0, jsx_runtime_1.jsx)(post_1.default, { postId: each.post_id }, each.post_id);
            }) })));
}
exports.default = WallPost;
