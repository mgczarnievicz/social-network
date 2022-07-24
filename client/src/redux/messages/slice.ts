// Reducer for messages
import { ChatInfo } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: {
        message?: ChatInfo;
        newestMsg?: Array<ChatInfo>;
    };
}

export default function messagesReducer(
    messages: Array<ChatInfo> = [],
    action: ActionType
) {
    switch (action.type) {
        case "messages/newestMsg":
            messages = action.payload.newestMsg;
            break;
        case "messages_general/received":
            messages = [action.payload.message, ...messages];

            break;
        default:
            break;
    }

    return messages;
}

// Action Creator
export function messagesReceived(messages: Array<ChatInfo>) {
    return {
        type: "messages/newestMsg",
        payload: { newestMsg: messages },
    };
}

export function addNewMessage(message: ChatInfo) {
    return {
        type: "messages_general/received",
        payload: { message },
    };
}
