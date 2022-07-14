"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_1 = require("react-router");
function OtherProfile() {
    var _a = (0, react_1.useState)({}), user = _a[0], setUser = _a[1];
    var params = (0, react_router_1.useParams)();
    var history = (0, react_router_1.useHistory)();
    console.log("params", params);
    console.log("history", history);
    (0, react_1.useEffect)(function () {
        console.log("Other Profile just render.");
        /*
        1. Figure out what is the userId we want to fetch information from.
        2. Make a fetch to server to get data (name, surname, photo, bio.)

        Browser browser to se the rout. -> we have a hook called use Params
        */
        var abort = false;
        if (!abort) {
            //Here we make the fetch in the server.
            // only send Integer.
            // not found we want to render something saying NOT Found.
            // Searching myself we should go to our profile page.
            /* if the other user is myself
                history.push("/")
                or
                history.replace("/")
            */
        }
        return function () {
            abort = true;
        };
    });
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("h1", { children: "OTHER PROFILE!" }) }));
}
exports.default = OtherProfile;
