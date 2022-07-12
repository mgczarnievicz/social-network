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
var logo_1 = __importDefault(require("./logo"));
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
var profile_1 = __importDefault(require("./profile"));
var uploader_1 = __importDefault(require("./uploader"));
// <AppProps, AppState>
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
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
            _this.setState(__assign(__assign({}, _this.state), data.data), function () { return console.log("this.state:", _this.state); });
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
        this.setState({
            bio: newBio,
        });
        console.log("loging this after bio", this);
    };
    App.prototype.render = function () {
        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "app-container" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "header" }, { children: [(0, jsx_runtime_1.jsx)(logo_1.default, {}), (0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: this.state.name, surname: this.state.surname, photoUrl: this.state.photourl, toggleUploader: this.toggleUploader })] })), this.state.uploaderVisible && ((0, jsx_runtime_1.jsx)(uploader_1.default, { upDatingPhoto: this.upDatingPhoto })), (0, jsx_runtime_1.jsx)(profile_1.default, { name: this.state.name, surname: this.state.surname, photoUrl: this.state.photourl, bio: this.state.bio, toggleUploader: this.toggleUploader, upDateBio: this.upDateBio })] })));
    };
    return App;
}(react_1.Component));
exports.default = App;
