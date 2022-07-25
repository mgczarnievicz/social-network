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
var wallWrite_1 = __importDefault(require("./wallWrite"));
var wallPost_1 = __importDefault(require("./wallPost"));
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/wall/slice");
function Wall(props) {
    console.log("Props in function Wall:", props);
    var dispatch = (0, react_redux_1.useDispatch)();
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    var wallId = props.wallUserId || userInfo.id;
    console.log("The wall I am going to tell the server to search:", wallId);
    (0, react_1.useEffect)(function () {
        var abort = false;
        dispatch((0, slice_1.asyncReceiveWallPosts)(abort, wallId));
        return function () {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "wall-container" }, { children: [(0, jsx_runtime_1.jsx)(wallWrite_1.default, { wallUserId: props.wallUserId }), (0, jsx_runtime_1.jsx)(wallPost_1.default, {})] })));
}
exports.default = Wall;
