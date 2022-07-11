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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
/* TODO: clear input. I don't know why I got something in code even though nothing was written. Its keep the email input value  */
var ResetPassword = /** @class */ (function (_super) {
    __extends(ResetPassword, _super);
    function ResetPassword(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            email: "",
            code: "",
            newPassword: "",
            view: 1,
            error: false,
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSendEmail = _this.handleSendEmail.bind(_this);
        _this.handleSetNewPassword = _this.handleSetNewPassword.bind(_this);
        return _this;
    }
    ResetPassword.prototype.handleChange = function (event) {
        var _a;
        var _this = this;
        this.setState(__assign(__assign({}, this.state), (_a = {}, _a[event.target.name] = event.target.value, _a)), function () { return console.log("this.state in handleChange:", _this.state); });
    };
    ResetPassword.prototype.handleSendEmail = function () {
        var _this = this;
        console.log("Send Email!");
        console.log("this.state.email", this.state.email);
        var _a = this.state, error = _a.error, view = _a.view, userInput = __rest(_a, ["error", "view"]);
        console.log("userInput", userInput);
        fetch("/resetPassword/sendEmail.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("data from POST/ SendEmail", data);
            if (data.status === "Success") {
                _this.setState({
                    view: 2,
                    error: false,
                });
            }
            else {
                _this.setState({
                    error: true,
                });
            }
        })
            .catch(function () {
            _this.setState({
                error: true,
            });
        });
        // (e.target as HTMLInputElement)
        // emailRef.current.value = "";
        console.log("this.state:", this.state);
    };
    ResetPassword.prototype.handleSetNewPassword = function () {
        var _this = this;
        console.log("Set New Password");
        var _a = this.state, error = _a.error, view = _a.view, userInput = __rest(_a, ["error", "view"]);
        console.log("userInput", userInput);
        fetch("/resetPassword/setNewPassword.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("data from POST/ setNewPassword", data);
            if (data.status === "Success") {
                _this.setState({
                    view: 3,
                    error: false,
                });
            }
            else {
                _this.setState({
                    error: true,
                });
            }
        })
            .catch(function () {
            _this.setState({
                error: true,
            });
        });
        console.log("this.state:", this.state);
    };
    ResetPassword.prototype.determineViewToRender = function () {
        // this method determines what the render!
        switch (this.state.view) {
            case 1:
                return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "form" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Step 1:" }), (0, jsx_runtime_1.jsx)("p", { children: "Enter your mail" }), (0, jsx_runtime_1.jsx)("input", { type: "email", name: "email", placeholder: "Email", required: true, ref: "emailRef", onChange: this.handleChange }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: this.handleSendEmail }, { children: "Submit" }))] })));
            case 2:
                return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "form" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Step 2:" }), (0, jsx_runtime_1.jsx)("p", { children: "Verify your email where you recived your code and enter a new password" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "code", placeholder: "code", required: true, ref: "codeRef", onChange: this.handleChange }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "newPassword", placeholder: "Password", required: true, ref: "passwordRef", onChange: this.handleChange }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: this.handleSetNewPassword }, { children: "Submit" }))] })));
            case 3:
                // remember to also add a link to login ;)
                return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "form" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Your Password was successfully change. Please Log In" }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/login" }, { children: " Log in " })) })] })));
        }
    };
    ResetPassword.prototype.render = function () {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Follow the next steps to reset your Password." }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "error" }, { children: this.state.error && (0, jsx_runtime_1.jsx)("p", { children: "oops, something went wrong" }) })), this.determineViewToRender()] }));
    };
    return ResetPassword;
}(react_1.Component));
exports.default = ResetPassword;
