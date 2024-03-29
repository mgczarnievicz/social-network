"use strict";
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
/*
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/
function FriendButton(props) {
    var _a = (0, react_1.useState)({}), friendshipStatus = _a[0], setFriendshipStatus = _a[1];
    (0, react_1.useEffect)(function () {
        var abort = false;
        if (!abort) {
            fetch("/api/friendshipStatus/".concat(props.viewUser))
                .then(function (resp) {
                return resp.json();
            })
                .then(function (data) {
                setFriendshipStatus(data.data);
                console.log("friendshipStatus", friendshipStatus);
            })
                .catch();
        }
        return function () {
            abort = true;
        };
    }, []);
    function buttonHandler() {
        //When we press the button we want to do a post request to my server!
        fetch("/api/setFriendshipStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(friendshipStatus),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            setFriendshipStatus(data.data);
        });
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("button", __assign({ onClick: buttonHandler }, { children: [friendshipStatus === null || friendshipStatus === void 0 ? void 0 : friendshipStatus.button, " "] })) }));
}
exports.default = FriendButton;
