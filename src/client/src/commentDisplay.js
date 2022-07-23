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
var react_1 = require("react");
function CommentDisplay(props) {
    var _a = (0, react_1.useState)(), commentInfo = _a[0], setCommentInfo = _a[1];
    (0, react_1.useEffect)(function () {
        var abort = false;
        console.log("In Comment Display props", props);
        fetch("/getCommentInfo/?commentId=".concat(props.comment_id))
            .then(function (respBody) { return respBody.json(); })
            .then(function (data) {
            console.log("Data from /getPost", data);
            if (data.status == "Success") {
                setCommentInfo(data.commentInfo);
            }
        })
            .catch(function (err) { return console.log("Error in getPost", err); });
        return function () {
            abort = true;
        };
    }, []);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: commentInfo && (
        // key={commentInfo.comment_id}
        (0, jsx_runtime_1.jsxs)("div", __assign({ className: "comment-post" }, { children: [(0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(commentInfo.comment_id) }), (0, jsx_runtime_1.jsxs)("p", { children: [commentInfo.name, " ", commentInfo.surname] }), (0, jsx_runtime_1.jsx)("h3", { children: commentInfo.comment }), (0, jsx_runtime_1.jsx)("h6", { children: commentInfo.created_at })] }))) }));
}
exports.default = CommentDisplay;
