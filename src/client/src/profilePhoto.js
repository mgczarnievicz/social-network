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
function ProfilePhoto(props) {
    console.log("Log the prop in PhotoProfile", props);
    // Save in public a "default.png" onClick={props.toggleModal()}
    var photoUrl = props.photoUrl || "defaultProfile.png";
    var altName = "".concat(props.name, " ").concat(props.surname);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "profilePhoto" }, { children: (0, jsx_runtime_1.jsx)("img", { src: photoUrl, alt: altName, onClick: function () { return props.toggleUploader(); } }) })));
}
exports.default = ProfilePhoto;
