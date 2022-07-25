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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/friends/slice");
var react_router_1 = require("react-router");
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
function Friends(props) {
    var dispatch = (0, react_redux_1.useDispatch)();
    var history = (0, react_router_1.useHistory)();
    var friends = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return friend.accepted; }); });
    (0, react_1.useEffect)(function () {
        var abort = false;
        console.log("Props in Friends!", props);
        dispatch((0, slice_1.asyncReceiveFriendStatus)(abort, props.otherUserId));
        return function () {
            abort = true;
        };
        // friends
    }, []);
    function seeFriendProfile(idUserToSee) {
        console.log("idUserToSee", idUserToSee);
        // history.push(`/user/${idUserToSee}`);
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-container" }, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Friends" }), (0, jsx_runtime_1.jsx)("div", __assign({ className: "friends" }, { children: friends &&
                    friends.map(function (friend) {
                        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "friends-round", onClick: function () {
                                seeFriendProfile(friend.id);
                            } }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: friend.name, surname: friend.surname, photourl: friend.photourl }), (0, jsx_runtime_1.jsx)("h4", { children: friend.name })] }), friend.id));
                    }) }))] })));
}
exports.default = Friends;
