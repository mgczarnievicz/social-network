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
exports.asyncChangeFriendStatus = exports.asyncReceiveFriendStatus = exports.receiveFriendStatus = exports.changeFriendStatus = exports.DictionaryButtonAction = void 0;
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
/*
    type ThunkAction<R, S, E, A extends Action>

  S = is the type of root state
    = is the return type of the getState() method.
  
  E = is the type of the extra arguments passed to the ThunkAction
  
  A = is the action type defined in your application.
    = it should be able to extend from Action.
      (this means that it should be an object
      that must have a `type` field.) Action type is defined in the redux typings.
  */
var asyncReceiveFriendStatus = function (abort, userId) {
    return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
        var respBody, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("I am in asyncReceiveFriendStatus");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/getFriends/?from=".concat(userId))];
                case 2:
                    respBody = _a.sent();
                    return [4 /*yield*/, respBody.json()];
                case 3:
                    data = _a.sent();
                    console.log("Data from /getFriends/?from=${wallId}", data);
                    //
                    if (!abort) {
                        // We want to despatch the data
                        //  dispatch(receiveFriendStatus(data.payload));
                        return [2 /*return*/, dispatch({
                                type: "/friends-wannabees/receive",
                                payload: { friends: data.payload },
                            })];
                    }
                    else {
                        console.log("ignore don't run a a state update");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    // handle fetch failure
                    console.log("Error", err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
};
exports.asyncReceiveFriendStatus = asyncReceiveFriendStatus;
var asyncChangeFriendStatus = function (buttonAction, friendId) {
    return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
        var resp, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("I am in asyncChangeFriendStatus");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/api/setFriendshipStatus", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                button: buttonAction,
                                viewUserId: friendId,
                            }),
                        })];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    data = _a.sent();
                    console.log("Data from post setFriendshipStatus", data);
                    return [2 /*return*/, dispatch({
                            type: "/friends-wannabees/".concat(exports.DictionaryButtonAction[buttonAction]),
                            payload: { id: data.data.viewUserId },
                        })];
                case 4:
                    err_2 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
};
exports.asyncChangeFriendStatus = asyncChangeFriendStatus;
