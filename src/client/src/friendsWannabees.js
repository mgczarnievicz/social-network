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
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/friends/slice");
// DictionaryButtonAction for FriendButton values: {
//     "Add Friend": "wannabee",
//     Unfriend: "delete",
//     "Cancel Request": "delete",
//     "Accept Friend": "accept",
//     "Delete Request": "delete",
// };
function FriendsAndWannabees() {
    var dispatch = (0, react_redux_1.useDispatch)();
    var wannabees = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return !friend.accepted; }); });
    var actualFriends = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return friend.accepted; }); });
    console.log("I am in Friends & Wannabees");
    (0, react_1.useEffect)(function () {
        /*
        1. Make a fetch request to gets my friends and wannabees.
        2. dispatch an action creator and pass the data recived.
        */
        var abort = false;
        dispatch((0, slice_1.asyncReceiveFriendStatus)(abort));
        return function () {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, []);
    var buttonHandler = function (buttonAction, friendId) {
        //When we press the button we want to do a post request to my server!
        console.log("Clicked in button friendship, button action", buttonAction);
        dispatch((0, slice_1.asyncChangeFriendStatus)(buttonAction, friendId));
    };
    console.log("actualFriends", actualFriends);
    console.log("wannabees", wannabees);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Friends" }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "friends-wannabees" }, { children: actualFriends &&
                    actualFriends.map(function (friend) {
                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-wannabees-profile" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: friend.photourl || "/defaultProfile.png", alt: "".concat(friend.name, " ").concat(friend.surname) }), (0, jsx_runtime_1.jsxs)("h2", { children: [friend.name, " ", friend.surname] }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                                        return buttonHandler("Unfriend", friend.id);
                                    } }, { children: "Unfriend" }))] }), friend.id));
                    }) })), (0, jsx_runtime_1.jsx)("h1", { children: "WannaBees" }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "friends-wannabees" }, { children: wannabees &&
                    wannabees.map(function (wannabee) {
                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-wannabees-profile  wannabees-profile" }, { children: [(0, jsx_runtime_1.jsx)("img", { src: wannabee.photourl ||
                                        "/defaultProfile.png", alt: "".concat(wannabee.name, " ").concat(wannabee.surname) }), (0, jsx_runtime_1.jsxs)("h2", { children: [wannabee.name, " ", wannabee.surname] }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                                        return buttonHandler("Accept Friend", wannabee.id);
                                    } }, { children: "Accept Friend" })), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                                        return buttonHandler("Delete Request", wannabee.id);
                                    }, className: "delete-request" }, { children: "Delete Request" }))] }), wannabee.id));
                    }) }))] }));
}
exports.default = FriendsAndWannabees;
