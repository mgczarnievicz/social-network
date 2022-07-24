import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfo } from "./typesClient";

import { FriendProfile, asyncReceiveFriendStatus } from "./redux/friends/slice";
import { useHistory } from "react-router";
import ProfilePhoto from "./profilePhoto";

interface Friends {
    otherUserId: number;
}

export default function Friends(props: Friends) {
    const dispatch = useDispatch();
    const history = useHistory();

    const friends = useSelector((state: RootState) =>
        state.friends?.filter((friend: FriendProfile) => friend.accepted)
    );

    useEffect(() => {
        let abort = false;
        dispatch(asyncReceiveFriendStatus(abort, props.otherUserId));

        return () => {
            abort = true;
        };
    }, []);

    function seeFriendProfile(idUserToSee: number) {
        // console.log("idUserToSee", idUserToSee);
        history.push(`/user/${idUserToSee}`);
    }

    return (
        <div className="friends-container">
            <h1>Friends</h1>
            <div className="friends">
                {friends &&
                    friends.map((friend: FriendProfile) => {
                        return (
                            <div
                                key={friend.id}
                                className="friends-round"
                                onClick={() => {
                                    seeFriendProfile(friend.id);
                                }}
                            >
                                <ProfilePhoto
                                    name={friend.name}
                                    surname={friend.surname}
                                    photourl={friend.photourl}
                                />
                                <h4>{friend.name}</h4>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
