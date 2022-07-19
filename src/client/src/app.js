"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
var profile_1 = __importDefault(require("./profile"));
var uploader_1 = __importDefault(require("./uploader"));
var findPeople_1 = __importDefault(require("./findPeople"));
var otherProfile_1 = __importDefault(require("./otherProfile"));
var wall_1 = __importDefault(require("./wall"));
var friendsWannabees_1 = __importDefault(require("./friendsWannabees"));
// <AppProps, AppState>
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            id: null,
            name: "",
            surname: "",
            photourl: "",
            uploaderVisible: false,
        };
        _this.toggleUploader = _this.toggleUploader.bind(_this);
        _this.upDatingPhoto = _this.upDatingPhoto.bind(_this);
        _this.upDateBio = _this.upDateBio.bind(_this);
        return _this;
    }
    App.prototype.componentDidMount = function () {
        var _this = this;
        fetch("/getUserInfo.json")
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("data from GET / UserInfo", data);
            data.data.bio = data.data.bio.split("\n");
            console.log("Data after splitting", data);
            _this.setState(__assign(__assign({}, _this.state), data.data), function () {
                return console.log("this.state after /getUserInfo.json:", _this.state);
            });
        })
            .catch(function () { });
    };
    App.prototype.toggleUploader = function () {
        console.log("ToggleModal is running");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    };
    App.prototype.upDatingPhoto = function (url) {
        console.log("This is arg", url);
        this.setState({
            photourl: url,
            uploaderVisible: false,
        });
    };
    App.prototype.upDateBio = function (newBio) {
        // Here we want to update the bio.
        console.log("Getting data from edit Bio", newBio);
        var bioToSet = newBio.split("\n");
        this.setState({
            bio: bioToSet,
        });
        console.log("logging this after bio", this);
    };
    App.prototype.logOutFunction = function () {
        fetch("/logout.json")
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            if (data.status === "Success") {
                location.reload();
            }
        });
    };
    App.prototype.render = function () {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [this.state.uploaderVisible && ((0, jsx_runtime_1.jsx)(uploader_1.default, { upDatingPhoto: this.upDatingPhoto, toggleUploader: this.toggleUploader })), (0, jsx_runtime_1.jsxs)(react_router_dom_1.BrowserRouter, { children: [(0, jsx_runtime_1.jsxs)("header", __assign({ className: "header" }, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/" }, { children: (0, jsx_runtime_1.jsx)(logo_1.default, {}) })), (0, jsx_runtime_1.jsxs)("nav", { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/news" }, { children: "News" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/friends" }, { children: "Friends" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/searchPeople" }, { children: "Find Friends" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/" }, { children: "Profile" })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/", onClick: this.logOutFunction }, { children: "Log Out" }))] }), (0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: this.state.name, surname: this.state.surname, photoUrl: this.state.photourl, toggleUploader: this.toggleUploader })] })), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Switch, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ exact: true, path: "/" }, { children: (0, jsx_runtime_1.jsx)(profile_1.default, { id: this.state.id, name: this.state.name, surname: this.state.surname, photourl: this.state.photourl, bio: this.state.bio, toggleUploader: this.toggleUploader, upDateBio: this.upDateBio }) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/searchPeople" }, { children: (0, jsx_runtime_1.jsx)(findPeople_1.default, {}) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/user/:idUserToSee" }, { children: (0, jsx_runtime_1.jsx)(otherProfile_1.default, {}) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/news" }, { children: (0, jsx_runtime_1.jsx)(wall_1.default, { wallUserId: this.state.id }) })), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, __assign({ path: "/friends" }, { children: (0, jsx_runtime_1.jsx)(friendsWannabees_1.default, {}) }))] })] })] }));
    };
    return App;
}(react_1.Component));
exports.default = App;
