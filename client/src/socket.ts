import { Store } from "redux";
import { io, Socket } from "socket.io-client";
import { messagesReceived, addNewMessage } from "./redux/messages/slice";
import { ChatInfo } from "./typesClient";

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

    socket.on("newest-generalMsg-chat", (newestChat: Array<ChatInfo>) => {
        console.log("server just emitted newest-generalMsg-chat", newestChat);
        store.dispatch(messagesReceived(newestChat));
        // time to dispatch an action messages/received would be a good one
        // pass to action creator the messages your server emitted
    });

    socket.on("generalMsg-new-message", (newMsg: ChatInfo) => {
        console.log("server just emitted a new msg to add", newMsg);
        store.dispatch(addNewMessage(newMsg));

        // time to dispatch an action message/addNew would be a good one
        // pass to action the object containing the message, and the user info
        // of the author
    });
};
