"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/comments/slice");
var comments_1 = __importDefault(require("./comments"));
var commentWrite_1 = __importDefault(require("./commentWrite"));
function WallComments(props) {
    // I have to search for the comments Id for the post I am in.
    console.log("Props in function WALL comments:", props);
    var dispatch = (0, react_redux_1.useDispatch)();
    (0, react_1.useEffect)(function () {
        var abort = false;
        dispatch((0, slice_1.asyncReceiveComments)(abort, props.postId));
        return function () {
            abort = true;
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [props.writeComment && ((0, jsx_runtime_1.jsx)(commentWrite_1.default, { postId: props.postId }, props.postId)), (0, jsx_runtime_1.jsx)(comments_1.default, { postId: props.postId })] }));
}
exports.default = WallComments;
