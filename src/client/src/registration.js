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
var Registration = /** @class */ (function (_super) {
    __extends(Registration, _super);
    function Registration(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            error: false,
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    /* TODO:
    1. render 4 inputs fields + button
    2. capture the users input ans store it state
    3. when the user submit, we want to send that data to the server
    4. if sth goes  wrong conditional render and error.
    4. if everything goes well shw them the logo.
    */
    // HTMLInputElement
    // e: ChangeEvent<{ value: string }>
    /*
    
    (property) React.InputHTMLAttributes<HTMLInputElement>.onChange?: React.ChangeEventHandler<HTMLInputElement>
     React.FormEvent<HTMLInputElement>
      React.ChangeEventHandler<HTMLInputElement>

       React.ChangeEvent<HTMLInputElement>
      React.SyntheticEvent
    */
    Registration.prototype.handleChange = function (event) {
        var _a, _b, _c, _d;
        var _this = this;
        // console.log("Handel Change is running");
        console.log(event.target.value);
        /*
        FIXME!!!!!!!!
        look for a nice solution!!!
         */
        switch (event.target.name) {
            case "name":
                this.setState((_a = {},
                    _a[event.target.name] = event.target.value,
                    _a), function () { return console.log("this.state:", _this.state); });
                break;
            case "surname":
                this.setState((_b = {},
                    _b[event.target.name] = event.target.value,
                    _b), function () { return console.log("this.state:", _this.state); });
                break;
            case "email":
                this.setState((_c = {},
                    _c[event.target.name] = event.target.value,
                    _c), function () { return console.log("this.state:", _this.state); });
                break;
            case "password":
                this.setState((_d = {},
                    _d[event.target.name] = event.target.value,
                    _d), function () { return console.log("this.state:", _this.state); });
                break;
            default:
                break;
        }
        // if (key === "name" || key === "surname" || key === "email") {
        //     this.setState(
        //         {
        //             [key]: event.target.value,
        //         },
        //         () => console.log("this.state:", this.state)
        //     );
        // }
        // this.setState(
        //     {
        //         [event.target.name as "name"]: event.target.value,
        //     },
        //     () => console.log("this.state:", this.state)
        // );
    };
    Registration.prototype.handleSubmit = function () {
        console.log("Clicked submit!");
        fetch("/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("data from POST/ registration", data);
            // trigger the page to reload
            location.reload();
        });
    };
    Registration.prototype.render = function () {
        return (_jsxs("div", { children: [_jsx("h1", { children: " Rendering Registration" }), _jsxs("p", { children: ["Registration ||", _jsx(Link, __assign({ to: "/login" }, { children: " Log in " }))] }), this.state.error && (_jsx("p", __assign({ className: "error" }, { children: "oops, something went wrong" }))), _jsx("input", { type: "text", name: "name", placeholder: "Name", onChange: this.handleChange, required: true }), _jsx("input", { type: "text", name: "surname", placeholder: "Surname", onChange: this.handleChange, required: true }), _jsx("input", { type: "email", name: "email", placeholder: "Email", onChange: this.handleChange, required: true }), _jsx("input", { type: "password", name: "password", placeholder: "Password", onChange: this.handleChange, required: true }), _jsx("button", __assign({ onClick: this.handleSubmit }, { children: "Submit" }))] }));
    };
    return Registration;
}(Component));
export default Registration;
