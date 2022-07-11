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
var uploader_1 = __importDefault(require("./uploader"));
// <AppProps, AppState>
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            name: "Maria",
            surname: "Inciarte",
            photoUrl: "",
            uploaderVisible: false,
        };
        _this.toggleModal = _this.toggleModal.bind(_this);
        return _this;
    }
    App.prototype.componentDidMount = function () {
        console.log("App Mounted!");
        /* TODO:
        We want the user info:
            name, surname, photo. When we have it we want to set ir to the state. (this.setState)

        */
    };
    App.prototype.toggleModal = function () {
        console.log("ToggleModal is running");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    };
    App.prototype.methodInApp = function (arg) {
        console.log("This is arg", arg);
    };
    App.prototype.render = function () {
        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "app-container" }, { children: [(0, jsx_runtime_1.jsx)(logo_1.default, {}), (0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: this.state.name, surname: this.state.surname, photoUrl: this.state.photoUrl, toggleModal: this.toggleModal }), (0, jsx_runtime_1.jsx)("h1", { children: "Profile Picture Component." }), (0, jsx_runtime_1.jsxs)("h1", { children: ["Welcome ", this.state.name, " ", this.state.surname] }), this.state.uploaderVisible && ((0, jsx_runtime_1.jsx)(uploader_1.default, { methodInApp: this.methodInApp }))] })));
    };
    return App;
}(react_1.Component));
exports.default = App;
