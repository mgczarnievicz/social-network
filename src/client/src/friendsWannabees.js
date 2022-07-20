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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/friends/slice");
// export interface FriendProfile extends ProfileInfo {
//     accepted: boolean;
// }
// export const DictionaryButtonAction = {
//     "Add Friend": "wannabee",
//     Unfriend: "delete",
//     "Cancel Request": "delete",
//     "Accept Friend": "accept",
//     "Delete Request": "delete",
// };
/*
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/
function FriendsAndWannabees() {
    var _this = this;
    var dispatch = (0, react_redux_1.useDispatch)();
    var wannabees = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return !friend.accepted; }); });
    var actualFriends = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.friends) === null || _a === void 0 ? void 0 : _a.filter(function (friend) { return friend.accepted; }); });
    console.log("I am in Friends & Wannabees");
    // Just so we can copile
    // const actualFriends: Array<FriendProfile | null> = [];
    // const wannabees: Array<FriendProfile | null> = [];
    // get all the friends
    (0, react_1.useEffect)(function () {
        /*
        1. Make a fetch request to gets my friends and wannabees.
        2. dispatch an action creator and pass the data recived.
        */
        var abort = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var respBody, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/getFriends.json")];
                    case 1:
                        respBody = _a.sent();
                        return [4 /*yield*/, respBody.json()];
                    case 2:
                        data = _a.sent();
                        console.log("Data from /getFriends.json", data);
                        //
                        if (!abort) {
                            // We want to despatch the data
                            dispatch((0, slice_1.receiveFriendStatus)(data.payload));
                        }
                        else {
                            console.log("ignore don't run a a state update");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log("Error", err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })(); // this closes the async iife
        return function () {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, []);
    function buttonHandler(buttonAction, friendId) {
        //When we press the button we want to do a post request to my server!
        console.log("Clicked in button friendship");
        console.log("Clicked, button action", buttonAction);
        fetch("/api/setFriendshipStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                button: buttonAction,
                viewUserId: friendId,
            }),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("Data from post setFriendshipStatus", data);
            dispatch((0, slice_1.changeFriendStatus)(slice_1.DictionaryButtonAction[buttonAction], data.data.viewUserId));
        });
    }
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
