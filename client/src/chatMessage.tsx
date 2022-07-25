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
import { ChatInfo, ProfileInfo } from "./typesClient";
import ProfilePhoto from "./profilePhoto";
import { stat } from "fs";

interface ChatMessageProp {
    userIdToTalk: ProfileInfo;
}

interface SenderProfileInfo {
    sender_id: number;
    name: string;
    surname: string;
    photourl?: string;
}

const GeneralChat: SenderProfileInfo = {
    sender_id: 0,
    name: "General",
    surname: "",
    photourl: "/toAll.png",
};

export default function ChatMessage(props: ChatMessageProp) {
    let messagesInfo;
    console.log("Props in Chat Messages", props.userIdToTalk);

    if (props.userIdToTalk.id) {
        console.log("I am Filtering");
        messagesInfo = useSelector((state: RootState) =>
            state.messages?.filter(
                (each: ChatInfo) =>
                    (each.sender_id == props.userIdToTalk.id &&
                        each.receiver_id == state.user.id) ||
                    (each.receiver_id == props.userIdToTalk.id &&
                        each.sender_id == state.user.id)
            )
        );
    } else {
        console.log("I am here!!! :(");
        messagesInfo = useSelector((state: RootState) =>
            state.messages?.filter((each: ChatInfo) => !each.receiver_id)
        );
    }
    const history = useHistory();

    console.log("messagesInfo", messagesInfo);

    useEffect(() => {
        let abort = false;
        socket.emit("chat-newest-message", props.userIdToTalk.id);

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
                receiver_id: props.userIdToTalk.id,
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
            <div className="chat-to-whom">
                <ProfilePhoto
                    name={props.userIdToTalk.name}
                    surname={props.userIdToTalk.surname}
                    photourl={props.userIdToTalk.photourl}
                />
                <h1>
                    {props.userIdToTalk.name} {props.userIdToTalk.surname}
                </h1>
            </div>
            {/* <pre>{JSON.stringify(props.userIdToTalk)}</pre> */}

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
                                            seeFriendProfile(each.sender_id);
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
