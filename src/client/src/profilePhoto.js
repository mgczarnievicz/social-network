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
    // const userInfo: ProfileInfoWBio = useSelector(
    //     (state: RootState): ProfileInfoWBio => state?.user
    // );
    var userInfo = {
        name: "maria",
        surname: "Inciarte",
        photourl: "",
    };
    var altName = "".concat(userInfo.name, " ").concat(userInfo.surname);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "profilePhoto" }, { children: (0, jsx_runtime_1.jsx)("img", { src: userInfo.photourl || "/defaultProfile.png", alt: altName, onClick: props.toggleUploader ? function () { return props.toggleUploader(); } : null }) })));
}
exports.default = ProfilePhoto;
