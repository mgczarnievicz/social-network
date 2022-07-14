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
var react_router_1 = require("react-router");
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
function OtherProfile() {
    var _a = (0, react_1.useState)({
        id: "",
        name: "",
        surname: "",
        photourl: "",
        bio: [],
    }), user = _a[0], setUser = _a[1];
    var idUserToSee = (0, react_router_1.useParams)().idUserToSee;
    // const { useParams } = useParams<{ useParams: string }>();
    var history = (0, react_router_1.useHistory)();
    console.log("history", history);
    (0, react_1.useEffect)(function () {
        console.log("Other Profile just render.");
        var otherUserId = Number.parseInt(idUserToSee);
        console.log("otherUserId", otherUserId);
        /*
        1. Figure out what is the userId we want to fetch information from.
        2. Make a fetch to server to get data (name, surname, photo, bio.)

        Browser browser to se the rout. -> we have a hook called use Params
        */
        var abort = false;
        if (!abort) {
            // const otherUserId = params.otherUserId;
            //Here we make the fetch in the server.
            // only send Integer.
            // not found we want to render something saying NOT Found.
            // Searching myself we should go to our profile page.
            /* if the other user is myself
                history.push("/")
                or
                history.replace("/")
            */
            if (Number.isNaN(otherUserId)) {
                history.replace("/");
            }
            else {
                // We do the query!
                fetch("/api/profile/".concat(otherUserId))
                    .then(function (resp) { return resp.json(); })
                    .then(function (data) {
                    console.log("data from profile", data);
                    switch (data.status) {
                        case "Equal":
                            // I called myself
                            // go to my profile user.
                            console.log("I am Equal");
                            history.push("/");
                            break;
                        case "Success":
                            // We have a profile.
                            data.profile.bio = data.profile.bio.split("\n");
                            console.log("Data after splitting", data);
                            setUser(data.profile);
                            break;
                        case "Error":
                            // Oops something went wrong.
                            history.go(0);
                            break;
                        case "Not Found":
                            // Not fount
                            setUser(null);
                            break;
                    }
                });
            }
        }
        return function () {
            abort = true;
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [user && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "profile-component" }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: user.name, surname: user.surname, photoUrl: user.photourl }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "profile-info" }, { children: [(0, jsx_runtime_1.jsxs)("h1", { children: [user.name, " ", user.surname] }), user.bio &&
                                user.bio.map(function (bioSentence, i) {
                                    console.log("Bio ", bioSentence);
                                    return (0, jsx_runtime_1.jsx)("h3", { children: bioSentence }, i);
                                })] }))] }))), !user && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("h1", { children: " User Not Found!" })] }))] }));
}
exports.default = OtherProfile;
