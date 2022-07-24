import { Store } from "redux";
import { io, Socket } from "socket.io-client";
import { messagesReceived, addNewMessage } from "./redux/messages/slice";
import { usersOnlineUpdate } from "./redux/usersOnline/slice";
import { ChatInfo, ProfileInfo } from "./typesClient";

export let socket: Socket;

export const init = (
    store: Store & {
        dispatch: unknown;
    }
) => {
    if (!socket) {
        // establish a socket connection once
        // socket = io.connect();
        // REVIEW with Merle
        socket = io();
    }

    socket.on("chat-newest-message", (newestChat: Array<ChatInfo>) => {
        store.dispatch(messagesReceived(newestChat));
    });

    socket.on("chat-new-message", (newMsg: ChatInfo) => {
        store.dispatch(addNewMessage(newMsg));
    });

    socket.on("online-users", (newMsg: Array<ProfileInfo>) => {
        store.dispatch(usersOnlineUpdate(newMsg));
    });
};
