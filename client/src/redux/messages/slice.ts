// Reducer for messages
interface ActionType {
    type: string;
    payload: {};
}

export default function messagesReducer(
    messages: Array<string> = [],
    action: ActionType
) {
    return messages;
}

// Action Creator
export function messagesReceived(messages: string) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function addNewMessage(messages: string) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}
