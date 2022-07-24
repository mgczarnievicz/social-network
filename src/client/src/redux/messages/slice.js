"use strict";
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
exports.addNewMessage = exports.messagesReceived = void 0;
function messagesReducer(messages, action) {
    if (messages === void 0) { messages = []; }
    switch (action.type) {
        case "messages/newestMsg":
            messages = action.payload.newestMsg;
            break;
        case "messages_general/received":
            messages = __spreadArray([action.payload.message], messages, true);
            break;
        default:
            break;
    }
    return messages;
}
exports.default = messagesReducer;
// Action Creator
function messagesReceived(messages) {
    return {
        type: "messages/newestMsg",
        payload: { newestMsg: messages },
    };
}
exports.messagesReceived = messagesReceived;
function addNewMessage(message) {
    return {
        type: "messages_general/received",
        payload: { message: message },
    };
}
exports.addNewMessage = addNewMessage;
