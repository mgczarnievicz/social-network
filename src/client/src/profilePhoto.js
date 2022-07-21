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
function ProfilePhoto(props) {
    var altName;
    var url;
    if (props.name) {
        altName = "".concat(props.name, " ").concat(props.surname);
        url = props.photourl;
    }
    else {
        var userInfo = (0, react_redux_1.useSelector)(function (state) { return state === null || state === void 0 ? void 0 : state.user; });
        altName = "".concat(userInfo.name, " ").concat(userInfo.surname);
        url = userInfo.photourl;
    }
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "profilePhoto" }, { children: (0, jsx_runtime_1.jsx)("img", { src: url || "/defaultProfile.png", alt: altName, onClick: props.toggleUploader ? function () { return props.toggleUploader(); } : null }) })));
}
exports.default = ProfilePhoto;
