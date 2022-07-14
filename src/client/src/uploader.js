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
        _this.setNewPhoto = _this.setNewPhoto.bind(_this);
        return _this;
    }
    Uploader.prototype.componentDidMount = function () {
        console.log("Uploader just mount this.props", this.props);
    };
    // HTMLFormElement HTMLFormElement React.SyntheticEvent
    Uploader.prototype.setNewPhoto = function (event) {
        var _this = this;
        console.log("I am clicking accept!");
        event.preventDefault();
        // /upload.json
        console.log("event target in setNewPhoto:", event.target);
        fetch("/upload.json", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("Data received POST load.json", data);
            if (data.status === "Success") {
                // Call function form parent with the argument as the url.
                _this.props.upDatingPhoto(data.photourl);
            }
            else {
                _this.setState({
                    error: true,
                });
            }
            console.log("this.state:", _this.state);
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
        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "uploader" }, { children: [(0, jsx_runtime_1.jsx)("h1", __assign({ onClick: function () {
                        _this.props.toggleUploader();
                    } }, { children: "X" })), (0, jsx_runtime_1.jsxs)("form", __assign({ encType: "multipart/form-data", onSubmit: this.setNewPhoto }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "select-img" }, { children: (0, jsx_runtime_1.jsxs)("label", __assign({ htmlFor: "inputTag" }, { children: [(0, jsx_runtime_1.jsx)("i", { className: "fa fa-2x fa-camera" }), (0, jsx_runtime_1.jsx)("br", {}), " Select Image", (0, jsx_runtime_1.jsx)("input", { type: "file", className: "hidden", name: "image", accept: "image/*", ref: "file", id: "inputTag" }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("span", { id: "imageName" })] })) })), (0, jsx_runtime_1.jsx)("button", __assign({ type: "submit" }, { children: "Accept" }))] }))] })));
    };
    return Uploader;
}(react_1.Component));
exports.default = Uploader;
