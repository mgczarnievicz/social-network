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
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/wall/slice");
function WallWrite(props) {
    var dispatch = (0, react_redux_1.useDispatch)();
    var _a = (0, react_1.useState)(""), post = _a[0], setPost = _a[1];
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    var wallId = props.wallUserId || userInfo.id;
    function submitPost() {
        var abort = false;
        dispatch((0, slice_1.asyncNewPost)(abort, wallId, post));
        setPost("");
        return function () {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "input-post" }, { children: [(0, jsx_runtime_1.jsx)("textarea", { value: post, onChange: function (e) {
                    setPost(e.target.value);
                }, rows: 3, cols: 10 }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: submitPost }, { children: "Post" }))] })));
}
exports.default = WallWrite;
