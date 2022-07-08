import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
fetch("/user/id.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    if (!data.userId) {
        ReactDOM.render(_jsx(Welcome, {}), document.querySelector("main"));
    }
    else {
        ReactDOM.render(_jsx("img", { src: "/logo.gif", alt: "logo" }), document.querySelector("main"));
    }
});
