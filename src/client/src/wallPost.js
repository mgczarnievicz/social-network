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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var fontawesome_svg_core_1 = require("@fortawesome/fontawesome-svg-core");
// import { fab } from "@fortawesome/free-brands-svg-icons";
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
fontawesome_svg_core_1.library.add(free_solid_svg_icons_1.faHeart, free_solid_svg_icons_1.faComments);
function Wall(props) {
    var _this = this;
    var _a = (0, react_1.useState)([]), post = _a[0], setPost = _a[1];
    function clickLick() {
        // send the like to the server.
    }
    (0, react_1.useEffect)(function () {
        var abort = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var respBody, data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/getPost?from=".concat(props.wallUserId))];
                    case 1:
                        respBody = _b.sent();
                        return [4 /*yield*/, respBody.json()];
                    case 2:
                        data = _b.sent();
                        console.log("Data from /getPost", data);
                        if (!abort) {
                            // We have new data!
                        }
                        else {
                            // just ignore data.
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        console.log("Error in getting data from /getPost");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            abort = true;
        };
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "This are post!" }), post &&
                post.map(function (each) {
                    (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "each" }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "heart", size: "2x", color: "grey" }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "comments", size: "2x", color: "green" })] });
                }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "heart", size: "3x", color: "grey" }), (0, jsx_runtime_1.jsx)(react_fontawesome_1.FontAwesomeIcon, { icon: "comments", size: "2x", color: "green" })] })] }));
}
exports.default = Wall;
