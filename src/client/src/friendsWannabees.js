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
var react_router_1 = require("react-router");
function FriendsAndWannabees() {
    var dispatch = (0, react_redux_1.useDispatch)();
    var history = (0, react_router_1.useHistory)();
    var wannabees = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return !friend.accepted; }); });
    var actualFriends = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return friend.accepted; }); });
    var user = (0, react_redux_1.useSelector)(function (state) { return state.user; });
    (0, react_1.useEffect)(function () {
        /*      1. Make a fetch request to gets my friends and wannabees.
        2. dispatch an action creator and pass the data recived.         */
        var abort = false;
        dispatch((0, slice_1.asyncReceiveFriendStatus)(abort, user.id));
        return function () {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            abort = true;
        };
    }, []);
    var buttonHandler = function (buttonAction, friendId) {
        //When we press the button we want to do a post request to my server!
        dispatch((0, slice_1.asyncChangeFriendStatus)(buttonAction, friendId));
    };
    function seeFriendProfile(idUserToSee) {
        // console.log("idUserToSee", idUserToSee);
        history.push("/user/".concat(idUserToSee));
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-wannabees-container" }, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Friends" }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "friends-wannabees" }, { children: actualFriends &&
                    actualFriends.map(function (friend) {
                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-wannabees-profile" }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: friend.photourl ||
                                                "/defaultProfile.png", alt: "".concat(friend.name, " ").concat(friend.surname), onClick: function () {
                                                seeFriendProfile(friend.id);
                                            } }), (0, jsx_runtime_1.jsxs)("h3", { children: [friend.name, " ", friend.surname] })] }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                                        return buttonHandler("Unfriend", friend.id);
                                    } }, { children: "Unfriend" }))] }), friend.id));
                    }) })), (0, jsx_runtime_1.jsx)("h1", { children: "WannaBees" }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "friends-wannabees" }, { children: wannabees &&
                    wannabees.map(function (wannabee) {
                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-wannabees-profile  wannabees-profile" }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: wannabee.photourl ||
                                                "/defaultProfile.png", alt: "".concat(wannabee.name, " ").concat(wannabee.surname), onClick: function () {
                                                seeFriendProfile(wannabee.id);
                                            } }), (0, jsx_runtime_1.jsxs)("h3", { children: [wannabee.name, " ", wannabee.surname] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                                                return buttonHandler("Accept Friend", wannabee.id);
                                            } }, { children: "Accept Friend" })), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: function () {
                                                return buttonHandler("Delete Request", wannabee.id);
                                            }, className: "delete-request" }, { children: "Delete Request" }))] })] }), wannabee.id));
                    }) }))] })));
}
exports.default = FriendsAndWannabees;
