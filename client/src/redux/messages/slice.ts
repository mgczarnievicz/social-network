// Reducer for messages
import { ChatInfo } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: { message?: ChatInfo; newestMsg?: Array<ChatInfo> };
}

export default function messagesReducer(
    messages: Array<ChatInfo> = [],
    action: ActionType
) {
    switch (action.type) {
        case "messages_general/newestMsg":
            console.log(
                "action.payload IN messages_general/newestMsg",
                action.payload
            );
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

// Action Creator
export function messagesReceived(messages: Array<ChatInfo>) {
    return {
        type: "messages_general/newestMsg",
        payload: { newestMsg: messages },
    };
}

export function addNewMessage(messages: ChatInfo) {
    return {
        type: "messages_general/received",
        payload: { messages },
    };
}
