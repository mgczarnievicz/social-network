import { useState } from "react";
import ChatMessage from "./chatMessage";
import OnlineUsers from "./onlineUsers";
import { ProfileInfo, GeneralChat } from "./typesClient";

// GeneralChat
export default function Chat() {
    const [userToChat, setUserToChat] = useState<ProfileInfo>(GeneralChat);

    function changeUserToChat(userInfo: ProfileInfo) {
        console.log("userId", userInfo);
        setUserToChat(userInfo);
    }
    console.log("userToChat", userToChat);

    return (
        <div className="chat-container">
            <ChatMessage userIdToTalk={userToChat} />
            <OnlineUsers changeUserToChat={changeUserToChat} />
        </div>
    );
}
