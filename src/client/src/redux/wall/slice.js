"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncNewPost = exports.asyncReceiveWallPosts = void 0;
// typeof ProfileInfoWBio
function postsReducer(posts, action) {
    if (posts === void 0) { posts = []; }
    switch (action.type) {
        case "/wallPost/receive":
            console.log("/wallPost/receive action.payload", action.payload);
            posts = action.payload.postsId;
            break;
        case "/wallPost/newPost":
            posts = __spreadArray([action.payload.newPost], posts, true);
            break;
        default:
            break;
    }
    return posts;
}
exports.default = postsReducer;
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
var asyncReceiveWallPosts = function (abort, wallId) {
    return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
        var respBody, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("I am in asyncReceiveWallPosts");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/getWallPost/?from=".concat(wallId))];
                case 2:
                    respBody = _a.sent();
                    return [4 /*yield*/, respBody.json()];
                case 3:
                    data = _a.sent();
                    console.log("Data from /getWallPost", data);
                    if (!abort) {
                        if (data.status == "Success") {
                            return [2 /*return*/, dispatch({
                                    type: "/wallPost/receive",
                                    payload: { postsId: data.posts },
                                })];
                        }
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
exports.asyncReceiveWallPosts = asyncReceiveWallPosts;
var asyncNewPost = function (abort, wallId, post) {
    return function (dispatch) { return __awaiter(void 0, void 0, void 0, function () {
        var respBody, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("I am in asyncReceiveWallPosts");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/newPost.json", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ wallUserId: wallId, post: post }),
                        })];
                case 2: return [4 /*yield*/, _a.sent()];
                case 3:
                    respBody = _a.sent();
                    return [4 /*yield*/, respBody.json()];
                case 4:
                    data = _a.sent();
                    console.log("Data from /wallPost.json", data);
                    if (!abort) {
                        if (data.status == "Success") {
                            return [2 /*return*/, dispatch({
                                    type: "/wallPost/newPost",
                                    payload: { newPost: data.payload },
                                })];
                        }
                    }
                    else {
                        console.log("ignore don't run a a state update");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    // handle fetch failure
                    console.log("Error", err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
};
exports.asyncNewPost = asyncNewPost;
