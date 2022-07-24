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
var Registration = /** @class */ (function (_super) {
    __extends(Registration, _super);
    function Registration(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            error: false,
            name: "",
            surname: "",
            email: "",
            password: "",
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    Registration.prototype.handleChange = function (event) {
        var _a;
        var _this = this;
        this.setState(__assign(__assign({}, this.state), (_a = {}, _a[event.target.name] = event.target.value, _a)), function () { return console.log("this.state in handleChange:", _this.state); });
    };
    Registration.prototype.handleSubmit = function () {
        var _this = this;
        var _a = this.state, error = _a.error, newUser = __rest(_a, ["error"]);
        fetch("/registration.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            if (data.status === "Success") {
                // location.replace("/");
                location.reload();
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
            }, function () { return console.log("this.state:", _this.state); });
        });
    };
    Registration.prototype.render = function () {
        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "form" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Join our community" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Registration ||", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, __assign({ to: "/login" }, { children: " Log in " }))] }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "error" }, { children: this.state.error && (0, jsx_runtime_1.jsx)("p", { children: "oops, something went wrong" }) })), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "name", placeholder: "Name", onChange: this.handleChange, required: true }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "surname", placeholder: "Surname", onChange: this.handleChange, required: true }), (0, jsx_runtime_1.jsx)("input", { type: "email", name: "email", placeholder: "Email", onChange: this.handleChange, required: true }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "password", placeholder: "Password", onChange: this.handleChange, required: true }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: this.handleSubmit }, { children: "Submit" }))] })));
    };
    return Registration;
}(react_1.Component));
exports.default = Registration;
