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
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
var bioEditor_1 = __importDefault(require("./bioEditor"));
// interface ProfileProps {
//     name: string;
//     surname: string;
//     photoUrl: string;
//     bio?: string[];
//     toggleUploader?: Function;
//     upDateBio?: Function;
// }
function Profile(props) {
    console.log("log the props in Profile");
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "profile-component" }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: props.name, surname: props.surname, photoUrl: props.photourl, toggleUploader: props.toggleUploader }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "profile-info" }, { children: [(0, jsx_runtime_1.jsxs)("h1", { children: ["Welcome ", props.name, " ", props.surname] }), (0, jsx_runtime_1.jsx)(bioEditor_1.default, { bio: props.bio, upDateBio: props.upDateBio })] }))] })));
}
exports.default = Profile;
