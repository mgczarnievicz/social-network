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
import Registration from "./registration.js";
import LogIn from "./login.js";
import { BrowserRouter, Route } from "react-router-dom";
export default function Welcome() {
    return (_jsxs("div", __assign({ id: "welcome" }, { children: [_jsx("h1", { children: "Welcome!" }), _jsx("img", { src: "/logo.png" }), _jsx(BrowserRouter, { children: _jsxs("div", { children: [_jsx(Route, __assign({ exact: true, path: "/" }, { children: _jsx(Registration, {}) })), _jsx(Route, __assign({ path: "/login" }, { children: _jsx(LogIn, {}) }))] }) })] })));
}
