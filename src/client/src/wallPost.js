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
var fontawesome_svg_core_1 = require("@fortawesome/fontawesome-svg-core");
// import { fab } from "@fortawesome/free-brands-svg-icons";
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_redux_1 = require("react-redux");
fontawesome_svg_core_1.library.add(free_solid_svg_icons_1.faHeart, free_solid_svg_icons_1.faComments, free_solid_svg_icons_1.faPlay);
var post_1 = __importDefault(require("./post"));
function WallPost(props) {
    var _a = (0, react_1.useState)([]), posts = _a[0], setPosts = _a[1];
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    var wallId = props.wallUserId || userInfo.id;
    console.log("The wall I am going to tell the server to search:", wallId);
    function clickLick() {
        // send the like to the server.
    }
    (0, react_1.useEffect)(function () {
        console.log("Props in Wall Post:", props);
        // Here I only want the las 5 post id.
        fetch("/getWallPost/?from=".concat(wallId))
            .then(function (respBody) { return respBody.json(); })
            .then(function (data) {
            console.log("Data from /getPost", data);
            if (data.status == "Success") {
                setPosts(data.posts);
            }
        })
            .catch(function (err) { return console.log("Error in getPost", err); });
        // try {
        //     console.log(`/getPost/?from=${wallId}`);
        //     const respBody = await fetch(`/getPost/?from=${wallId}`);
        //     const data = await respBody.json();
        //     console.log("Data from /getPost", data);
        //     if (data.status == "Success") {
        //         console.log("I am here");
        //         setPost(data.posts);
        //     }
        // } catch {
        //     console.log("Error in getting data from /getPost");
        // }
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "posts-container" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "This are post!" }), posts &&
                posts.map(function (each) {
                    return (0, jsx_runtime_1.jsx)(post_1.default, { postId: each.id }, each.id);
                })] })));
}
exports.default = WallPost;
