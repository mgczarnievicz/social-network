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
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var fontawesome_svg_core_1 = require("@fortawesome/fontawesome-svg-core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_redux_1 = require("react-redux");
var react_router_1 = require("react-router");
var wallComment_1 = __importDefault(require("./wallComment"));
fontawesome_svg_core_1.library.add(free_solid_svg_icons_1.faHeart, free_solid_svg_icons_1.faComments, free_solid_svg_icons_1.faPlay);
function Post(props) {
    var _a = (0, react_1.useState)(), postInfo = _a[0], setPostInfo = _a[1];
    var _b = (0, react_1.useState)([]), comments = _b[0], setComments = _b[1];
    var _c = (0, react_1.useState)(""), commentInput = _c[0], setCommentInput = _c[1];
    var _d = (0, react_1.useState)(false), showCommentInput = _d[0], setShowCommentInput = _d[1];
    var postIdToSee = (0, react_router_1.useParams)().postIdToSee;
    var history = (0, react_router_1.useHistory)();
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    function clickLick() {
        // send the like to the server.
    }
    (0, react_1.useEffect)(function () {
        var postToDisplay;
        console.log("postIdToSee in post", postIdToSee);
        console.log("props in post", props);
        if (postIdToSee) {
            postToDisplay = Number.parseInt(postIdToSee);
            console.log("otherUserId after parseInt", postToDisplay);
            if (Number.isNaN(postToDisplay)) {
                history.replace("/");
            }
        }
        else {
            postToDisplay = props.postId;
        }
        console.log("postToDisplay:", postToDisplay);
        fetch("/getPost/?postId=".concat(postToDisplay))
            .then(function (respBody) { return respBody.json(); })
            .then(function (data) {
            console.log("Data from /getPost", data);
            if (data.status == "Success") {
                setPostInfo(data.post);
            }
        })
            .catch(function (err) { return console.log("Error in getPost", err); });
    }, []);
    console.log("postInfo", postInfo);
    function clickedComment() {
        console.log("I clicked In comments! Lets Add some!");
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: postInfo && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "post" }, { children: [postInfo.walluser_id == postInfo.writer_id && ((0, jsx_runtime_1.jsxs)("p", { children: [postInfo.walluser_name, " ", postInfo.walluser_surname] })), postInfo.walluser_id != postInfo.writer_id && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "user-post" }, { children: [(0, jsx_runtime_1.jsxs)("p", { children: [postInfo.walluser_name, " ", postInfo.walluser_surname] }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "play", size: "xs", color: "darkgray", className: "post-to" }), (0, jsx_runtime_1.jsxs)("p", { children: [postInfo.wallwriter_name, " ", postInfo.wallwriter_surname] })] }))), (0, jsx_runtime_1.jsx)("h3", { children: postInfo.post }), (0, jsx_runtime_1.jsx)("h6", { children: postInfo.created_at }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "icons" }, { children: [(0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "heart", size: "1x", color: "grey" }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "comments", size: "1x", color: "green" })] }))] }), postInfo.id), (0, jsx_runtime_1.jsx)(wallComment_1.default, { postId: postInfo.id }, postInfo.id)] })) }));
}
exports.default = Post;
