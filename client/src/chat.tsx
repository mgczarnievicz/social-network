import React, {
    Component,
    ChangeEvent,
    useState,
    KeyboardEvent,
    useEffect,
} from "react";

import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "./redux/reducer";
import { socket } from "./socket";
import { ChatInfo } from "./typesClient";
import ProfilePhoto from "./profilePhoto";

export default function Chat() {
    const messagesInfo = useSelector((state: RootState) => state.messages);
    const history = useHistory();

    console.log("messagesInfo", messagesInfo);

    useEffect(() => {
        let abort = false;
        socket.emit("newest-generalMsg-chat", null);
        return () => {
            console.log("Running clean up in chat");
            abort = true;
        };
    }, []);

    // React.ChangeEvent<HTMLTextAreaElement>
    const keyCheck = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("What was pass.");
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);
            socket.emit("generalMsg-new-message", event.target.value);
            event.target.value = "";
        }
    };

    function seeFriendProfile(idUserToSee: number) {
        console.log("idUserToSee", idUserToSee);
        history.push(`/user/${idUserToSee}`);
    }

    return (
        <div className="container-main-width">
            <h1>Welcome to chat</h1>
            <div className="chat-container">
                {messagesInfo &&
                    messagesInfo.map((each: ChatInfo) => {
                        return (
                            <div className="message" key={each.id}>
                                <ProfilePhoto
                                    name={each.name}
                                    surname={each.surname}
                                    photourl={each.photourl}
                                />
                                <div className="message-info">
                                    <p
                                        onClick={() => {
                                            seeFriendProfile(each.user_id);
                                        }}
                                    >
                                        {each.name} {each.surname}
                                    </p>
                                    <h3>{each.message}</h3>
                                    <h6>{each.send_at}</h6>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Write a new Message"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
