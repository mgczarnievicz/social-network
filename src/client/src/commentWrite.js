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
var slice_1 = require("./redux/comments/slice");
var react_1 = require("react");
function WallWrite(props) {
    var dispatch = (0, react_redux_1.useDispatch)();
    var _a = (0, react_1.useState)(""), comment = _a[0], setComment = _a[1];
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    var keyCheck = function (event) {
        console.log("event.target.value", event.target.value);
        setComment(event.target.value);
        console.log("Comment", comment);
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);
            dispatch((0, slice_1.asyncNewComment)(props.postId, comment));
            event.target.value = "";
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "input-comment" }, { children: (0, jsx_runtime_1.jsx)("textarea", { 
            // value={comment}
            placeholder: "write a comment", onKeyDown: keyCheck, rows: 3, cols: 10 }) })));
}
exports.default = WallWrite;
