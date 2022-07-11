"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function ProfilePhoto(props) {
    console.log("Log the prop in PhotoProfile", props);
    // Save in public a "default.png"
    // photoUrl = photoUrl || "default.png"
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: props.photoUrl, alt: "logo" }), (0, jsx_runtime_1.jsxs)("h1", { children: ["Hi my name is ", props.name, " ", props.surname, " and this is my photo!"] })] }));
}
exports.default = ProfilePhoto;
