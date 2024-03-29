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
var react_router_1 = require("react-router");
var socket_1 = require("./socket");
var profilePhoto_1 = __importDefault(require("./profilePhoto"));
var GeneralChat = {
    sender_id: 0,
    name: "General",
    surname: "",
    photourl: "/toAll.png",
};
function ChatMessage(props) {
    var messagesInfo;
    console.log("Props in Chat Messages", props.userIdToTalk);
    if (props.userIdToTalk.id) {
        console.log("I am Filtering");
        messagesInfo = (0, react_redux_1.useSelector)(function (state) {
            var _a;
            return (_a = state.messages) === null || _a === void 0 ? void 0 : _a.filter(function (each) {
                return (each.sender_id == props.userIdToTalk.id &&
                    each.receiver_id == state.user.id) ||
                    (each.receiver_id == props.userIdToTalk.id &&
                        each.sender_id == state.user.id);
            });
        });
    }
    else {
        console.log("I am here!!! :(");
        messagesInfo = (0, react_redux_1.useSelector)(function (state) { var _a; return (_a = state.messages) === null || _a === void 0 ? void 0 : _a.filter(function (each) { return !each.receiver_id; }); });
    }
    var history = (0, react_router_1.useHistory)();
    console.log("messagesInfo", messagesInfo);
    (0, react_1.useEffect)(function () {
        var abort = false;
        socket_1.socket.emit("chat-newest-message", props.userIdToTalk.id);
        return function () {
            abort = true;
        };
    }, [props.userIdToTalk]);
    // React.ChangeEvent<HTMLTextAreaElement>
    var keyCheck = function (event) {
        console.log("What was pass.");
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);
            socket_1.socket.emit("chat-new-message", {
                message: event.target.value,
                receiver_id: props.userIdToTalk.id,
            });
            event.target.value = "";
        }
    };
    function seeFriendProfile(idUserToSee) {
        console.log("idUserToSee", idUserToSee);
        history.push("/user/".concat(idUserToSee));
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "container-main-width message-section" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "chat-to-whom" }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: props.userIdToTalk.name, surname: props.userIdToTalk.surname, photourl: props.userIdToTalk.photourl }), (0, jsx_runtime_1.jsxs)("h1", { children: [props.userIdToTalk.name, " ", props.userIdToTalk.surname] })] })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "message-container" }, { children: [messagesInfo && messagesInfo.length == 0 && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("h4", { children: "No Messages" }) })), messagesInfo &&
                        messagesInfo.map(function (each) {
                            return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "message" }, { children: [(0, jsx_runtime_1.jsx)(profilePhoto_1.default, { name: each.name, surname: each.surname, photourl: each.photourl }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "message-info" }, { children: [(0, jsx_runtime_1.jsxs)("p", __assign({ onClick: function () {
                                                    seeFriendProfile(each.sender_id);
                                                } }, { children: [each.name, " ", each.surname] })), (0, jsx_runtime_1.jsx)("h3", { children: each.message }), (0, jsx_runtime_1.jsx)("h6", { children: each.send_at })] }))] }), each.id));
                        })] })), (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Write a new Message", onKeyDown: keyCheck })] })));
}
exports.default = ChatMessage;
