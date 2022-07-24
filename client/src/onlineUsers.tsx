import React from "react";
import { RootState } from "./redux/reducer";
import { useSelector } from "react-redux";

import { ProfileInfo } from "./typesClient";
import ProfilePhoto from "./profilePhoto";

interface OnlineUsersProp {
    changeUserToChat: Function;
}

export default function OnlineUsers(props: OnlineUsersProp) {
    const onlineUsers: Array<ProfileInfo> = useSelector((state: RootState) =>
        state.onlineUsers?.filter((each) => each.id != state.user.id)
    );

    return (
        <div className="onlineUsers-container">
            <h3>Chats</h3>
            <div
                className="user-online"
                onClick={() => {
                    props.changeUserToChat(0);
                }}
            >
                <ProfilePhoto
                    name={"General Message"}
                    surname={"General Message"}
                    photourl={"/toAll.png"}
                />
                <h4>General Chat</h4>
            </div>
            {onlineUsers &&
                onlineUsers.map((each: ProfileInfo) => {
                    return (
                        <div
                            className="user-online"
                            onClick={() => {
                                props.changeUserToChat(each.id);
                            }}
                            key={each.id}
                        >
                            <ProfilePhoto
                                name={each.name}
                                surname={each.surname}
                                photourl={each.photourl}
                            />
                            <h4>
                                {each.name} {each.surname}
                            </h4>
                        </div>
                    );
                })}
        </div>
    );
}
