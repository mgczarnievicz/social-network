"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewMessage = exports.messagesReceived = void 0;
function messagesReducer(messages, action) {
    if (messages === void 0) { messages = []; }
    switch (action.type) {
        case "messages_general/newestMsg":
            console.log("action.payload IN messages_general/newestMsg", action.payload);
            messages = action.payload.newestMsg;
            break;
        case "messages_general/received":
            messages.push(action.payload.message);
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
        type: "messages_general/newestMsg",
        payload: { newestMsg: messages },
    };
}
exports.messagesReceived = messagesReceived;
function addNewMessage(messages) {
    return {
        type: "messages_general/received",
        payload: { messages: messages },
    };
}
exports.addNewMessage = addNewMessage;
