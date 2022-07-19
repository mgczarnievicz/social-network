"use strict";
// src/ redux/friends/slice.js
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
exports.receiveFriendStatus = exports.changeFriendStatus = exports.DictionaryButtonAction = void 0;
exports.DictionaryButtonAction = {
    "Add Friend": "wannabee",
    Unfriend: "delete",
    "Cancel Request": "delete",
    "Accept Friend": "accept",
    "Delete Request": "delete",
};
function friendsAndWannabeesReducer(friends, action) {
    if (friends === void 0) { friends = []; }
    switch (action.type) {
        case "/friends-wannabees/receive":
            friends = action.payload.friends;
            break;
        case "/friends-wannabees/wannabee":
            friends = friends.map(function (friend) {
                if (friend.id == action.payload.id) {
                    return __assign(__assign({}, friend), { accepted: false });
                }
                else {
                    return friend;
                }
            });
            break;
        case "/friends-wannabees/delete":
            friends = friends.filter(function (friend) {
                if (friend.id != action.payload.id) {
                    // I need to take it out of the new array
                    return friend;
                }
            });
            break;
        case "/friends-wannabees/accept":
            friends = friends.map(function (friend) {
                if (friend.id == action.payload.id) {
                    return __assign(__assign({}, friend), { accepted: true });
                }
                else {
                    return friend;
                }
            });
            break;
        default:
            break;
    }
    return friends;
}
exports.default = friendsAndWannabeesReducer;
/*


1. spread Operator, works in Object and Arrays

2. MAP work ONLY in ARRAYS!

3. FILTER - an array method
great for removing thing from array

*/
/*
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/
function changeFriendStatus(action, id) {
    return {
        type: "/friends-wannabees/".concat(action),
        payload: { id: id },
    };
}
exports.changeFriendStatus = changeFriendStatus;
function receiveFriendStatus(friends) {
    return {
        type: "/friends-wannabees/receive",
        payload: { friends: friends },
    };
}
exports.receiveFriendStatus = receiveFriendStatus;
