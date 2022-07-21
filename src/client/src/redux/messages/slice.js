"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewMessage = exports.messagesReceived = void 0;
function messagesReducer(messages, action) {
    if (messages === void 0) { messages = []; }
    return messages;
}
exports.default = messagesReducer;
// Action Creator
function messagesReceived(messages) {
    return {
        type: "messages/received",
        payload: { messages: messages },
    };
}
exports.messagesReceived = messagesReceived;
function addNewMessage(messages) {
    return {
        type: "messages/received",
        payload: { messages: messages },
    };
}
exports.addNewMessage = addNewMessage;
