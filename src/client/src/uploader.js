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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Uploader = /** @class */ (function (_super) {
    __extends(Uploader, _super);
    function Uploader(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Uploader.prototype.componentDidMount = function () {
        console.log("Uploader just mount");
    };
    Uploader.prototype.methodInUploader = function (event) {
        console.log("I am clicking accept!");
        event.preventDefault();
        // /upload.json
        fetch("/upload.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("Data received POST load.json", data);
            // if (data.status === "Success") {
            //     location.reload();
            // } else {
            //     this.setState({
            //         error: true,
            //     });
            // }
            // console.log("this.state:", this.state);
        })
            .catch(function () {
            // this.setState(
            //     {
            //         error: true,
            //     },
            //     () => console.log("this.state:", this.state)
            // );
        });
        // Here we want to call the method of my parent. That live in props.
        //  this.props.methodInApp(true);
    };
    Uploader.prototype.render = function () {
        var _this = this;
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "I am the Uploader!" }), (0, jsx_runtime_1.jsxs)("form", __assign({ encType: "multipart/form-data" }, { children: [(0, jsx_runtime_1.jsx)("input", { type: "file", name: "image", accept: "image/*", ref: "file", id: "inputTag" }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function (e) {
                                _this.methodInUploader(e);
                            } }, { children: "Accept" }))] }))] }));
    };
    return Uploader;
}(react_1.Component));
exports.default = Uploader;
