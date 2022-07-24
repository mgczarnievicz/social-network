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
import { stat } from "fs";

interface ChatMessageProp {
    userIdToTalk: number;
}
export default function ChatMessage(props: ChatMessageProp) {
    let messagesInfo;

    if (props.userIdToTalk) {
        console.log("let filter our msg!", props.userIdToTalk);

        messagesInfo = useSelector((state: RootState) =>
            state.messages?.filter(
                (each: ChatInfo) =>
                    each.user_id == props.userIdToTalk ||
                    each.user_id == state.user.id
            )
        );
    } else {
        console.log("I am here!!! :(");
        messagesInfo = useSelector((state: RootState) => state.messages);
    }
    const history = useHistory();

    console.log("messagesInfo", messagesInfo);

    useEffect(() => {
        let abort = false;
        socket.emit("chat-newest-message", props.userIdToTalk);
        return () => {
            abort = true;
        };
    }, [props.userIdToTalk]);

    // React.ChangeEvent<HTMLTextAreaElement>
    const keyCheck = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("What was pass.");
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);

            socket.emit("chat-new-message", {
                message: event.target.value,
                receiver_id: props.userIdToTalk,
            });

            event.target.value = "";
        }
    };

    function seeFriendProfile(idUserToSee: number) {
        console.log("idUserToSee", idUserToSee);
        history.push(`/user/${idUserToSee}`);
    }

    return (
        <div className="container-main-width message-section">
            <h1>Welcome to chat</h1>
            <pre>{JSON.stringify(props.userIdToTalk)}</pre>

            <div className="message-container">
                {messagesInfo && messagesInfo.length == 0 && (
                    <div>
                        <h4>No Messages</h4>
                    </div>
                )}
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
