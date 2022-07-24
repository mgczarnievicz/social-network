import { useState } from "react";
import ChatMessage from "./chatMessage";
import OnlineUsers from "./onlineUsers";

export default function Chat() {
    const [userToChat, setUserToChat] = useState<number>(0);

    function changeUserToChat(userId: number) {
        console.log("userId", userId);

        setUserToChat(userId);
    }
    console.log("userToChat", userToChat);

    return (
        <div className="chat-container">
            <ChatMessage userIdToTalk={userToChat} />
            <OnlineUsers changeUserToChat={changeUserToChat} />
        </div>
    );
}
