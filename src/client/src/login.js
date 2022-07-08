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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
import { Link } from "react-router-dom";
var LogIn = /** @class */ (function (_super) {
    __extends(LogIn, _super);
    function LogIn(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            email: "",
            password: "",
            error: false,
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    LogIn.prototype.handleChange = function (event) {
        var _a, _b;
        var _this = this;
        // console.log("Handel Change is running");
        console.log(event.target.value);
        // FIXME! see a nicer way to do it!
        switch (event.target.name) {
            case "email":
                this.setState((_a = {},
                    _a[event.target.name] = event.target.value,
                    _a), function () { return console.log("this.state:", _this.state); });
                break;
            case "password":
                this.setState((_b = {},
                    _b[event.target.name] = event.target.value,
                    _b), function () { return console.log("this.state:", _this.state); });
                break;
            default:
                break;
        }
    };
    LogIn.prototype.handleSubmit = function () {
        console.log("Clicked submit!");
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("data from POST/ login", data);
            // trigger the page to reload
            location.reload();
        });
    };
    LogIn.prototype.render = function () {
        return (_jsxs("div", { children: [_jsx("h1", { children: " Rendering Registration" }), _jsxs("p", { children: [_jsx(Link, __assign({ to: "/" }, { children: " Registration " })), " || Log in"] }), this.state.error && (_jsx("p", __assign({ className: "error" }, { children: "oops, something went wrong" }))), _jsx("input", { type: "email", name: "email", placeholder: "Email", onChange: this.handleChange }), _jsx("input", { type: "password", name: "password", placeholder: "Password", onChange: this.handleChange }), _jsx("button", __assign({ onClick: this.handleSubmit }, { children: "Submit" }))] }));
    };
    return LogIn;
}(Component));
export default LogIn;
