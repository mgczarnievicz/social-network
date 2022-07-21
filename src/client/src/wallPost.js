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
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var fontawesome_svg_core_1 = require("@fortawesome/fontawesome-svg-core");
// import { fab } from "@fortawesome/free-brands-svg-icons";
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_redux_1 = require("react-redux");
fontawesome_svg_core_1.library.add(free_solid_svg_icons_1.faHeart, free_solid_svg_icons_1.faComments, free_solid_svg_icons_1.faPlay);
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
        fetch("/getPost/?from=".concat(wallId))
            .then(function (respBody) { return respBody.json(); })
            .then(function (data) {
            console.log("Data from /getPost", data);
            if (data.status == "Success") {
                console.log("I am here");
                setPosts(data.posts);
                console.log("My post after setting them", posts);
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
    console.log("posts", posts);
    /*  created_at: "21/07/2022, 17:10:13"
id: 8
post: "I am with you!"
walluser_id: 5
walluser_name: "Lori"
walluser_surname: "Antonio"
wallwriter_name: "Elsa"
wallwriter_surname: "Elsa"
writer_id: 1 */
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "posts-container" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "This are post!" }), posts &&
                posts.map(function (each) {
                    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "post" }, { children: [each.walluser_id == each.writer_id && ((0, jsx_runtime_1.jsxs)("p", { children: [each.walluser_name, " ", each.walluser_surname] })), each.walluser_id != each.writer_id && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "user-post" }, { children: [(0, jsx_runtime_1.jsxs)("p", { children: [each.walluser_name, " ", each.walluser_surname] }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "play", className: "post-to" }), (0, jsx_runtime_1.jsxs)("p", { children: [each.wallwriter_name, " ", each.wallwriter_surname] })] }))), (0, jsx_runtime_1.jsx)("h3", { children: each.post }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "icons" }, { children: [(0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "heart", size: "1x", color: "grey" }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "comments", size: "1x", color: "green" })] }))] }), each.id));
                })] })));
}
exports.default = WallPost;
