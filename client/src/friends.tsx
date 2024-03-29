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
        console.log("Props in Friends!", props);

        dispatch(asyncReceiveFriendStatus(abort, props.otherUserId));

        return () => {
            abort = true;
        };
        // friends
    }, []);

    function seeFriendProfile(idUserToSee: number) {
        console.log("idUserToSee", idUserToSee);
        history.push(`/user/${idUserToSee}`);
        // location.replace("/");
    }

    return (
        <div className="friends-container">
            <h2>Friends</h2>
            <div className="friends">
                {friends.length == 0 && <h3>No friends yet</h3>}
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
