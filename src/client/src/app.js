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
var react_router_dom_1 = require("react-router-dom");
var logo_1 = __importDefault(require("./logo"));
var profile_1 = __importDefault(require("./profile"));
var uploader_1 = __importDefault(require("./uploader"));
var findPeople_1 = __importDefault(require("./findPeople"));
var otherProfile_1 = __importDefault(require("./otherProfile"));
var chat_1 = __importDefault(require("./chat"));
var friendsWannabees_1 = __importDefault(require("./friendsWannabees"));
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/user/slice");
function App(props) {
    var dispatch = (0, react_redux_1.useDispatch)();
    var _a = (0, react_1.useState)(false), uploaderVisible = _a[0], setUploaderVisible = _a[1];
    var userInfo = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    console.log("In App", userInfo);
    (0, react_1.useEffect)(function () {
        var abort = false;
        console.log("I am in the useEffect in App");
        dispatch((0, slice_1.asyncReceiveUser)(abort));
        return function () {
            console.log("cleanup running");
            abort = true;
        };
    }, []);
    function toggleUploader() {
        console.log("ToggleModal is running");
        setUploaderVisible(!uploaderVisible);
    }
    function upDatingPhoto(url) {
        console.log("This is arg", url);
        setUploaderVisible(false);
        dispatch((0, slice_1.userUpdatePhotoUrl)(url));
    }
    function upDateBio(newBio) {
        // Here we want to update the bio. This will be done in BIO!
        console.log("Getting data from edit Bio", newBio);
        var bioToSet = newBio.split("\n");
        dispatch((0, slice_1.userUpdateBio)(bioToSet));
        // console.log("logging this after bio", this);
    }
    function logOutFunction() {
        fetch("/logout.json")
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            if (data.status === "Success") {
                location.reload();
            }
        });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [uploaderVisible && ((0, jsx_runtime_1.jsx)(uploader_1.default, { upDatingPhoto: upDatingPhoto, toggleUploader: toggleUploader })), (0, jsx_runtime_1.jsxs)(react_router_dom_1.BrowserRouter, { children: [(0, jsx_runtime_1.jsxs)("header", __assign({ className: "header" }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/" }, { children: (0, jsx_runtime_1.jsx)(logo_1.default, {}) })), (0, jsx_runtime_1.jsxs)("nav", { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/news" }, { children: "News" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/friends" }, { children: "Friends" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/searchPeople" }, { children: "Find Friends" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/" }, { children: "Profile" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/", onClick: logOutFunction }, { children: "Log Out" }))] })] })), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Switch, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ exact: true, path: "/" }, { children: (0, jsx_runtime_1.jsx)(profile_1.default, { toggleUploader: toggleUploader, upDateBio: upDateBio }) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/chat" }, { children: (0, jsx_runtime_1.jsx)(chat_1.default, {}) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/searchPeople" }, { children: (0, jsx_runtime_1.jsx)(findPeople_1.default, {}) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/user/:idUserToSee" }, { children: (0, jsx_runtime_1.jsx)(otherProfile_1.default, {}) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/news" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/friends" }, { children: (0, jsx_runtime_1.jsx)(friendsWannabees_1.default, {}) }))] })] })] }));
}
exports.default = App;
