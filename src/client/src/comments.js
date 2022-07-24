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
var commentDisplay_1 = __importDefault(require("./commentDisplay"));
function Comments(props) {
    // I have to search for the comments Id for the post I am in.
    //[props.postId]
    var commentsId = (0, react_redux_1.useSelector)(function (state) {
        var _a;
        return (_a = state.comments) === null || _a === void 0 ? void 0 : _a.filter(function (each) { return each.post_id == props.postId; });
    });
    console.log("in Comments", commentsId);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "comment-container" }, { children: commentsId &&
            commentsId.map(function (each) {
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [console.log("each", each), (0, jsx_runtime_1.jsx)(commentDisplay_1.default, { comment_id: each.comment_id }, each.comment_id)] }));
            }) })));
}
exports.default = Comments;
