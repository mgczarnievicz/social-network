import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfo } from "./typesClient";

import {
    FriendProfile,
    DictionaryButtonAction,
    asyncChangeFriendStatus,
    asyncReceiveFriendStatus,
} from "./redux/friends/slice";
import { useHistory } from "react-router";

// DictionaryButtonAction for FriendButton values: {
//     "Add Friend": "wannabee",
//     Unfriend: "delete",
//     "Cancel Request": "delete",
//     "Accept Friend": "accept",
//     "Delete Request": "delete",
// };

export default function FriendsAndWannabees() {
    const dispatch = useDispatch();
    const history = useHistory();

    const wannabees = useSelector((state: RootState) =>
        state.friends?.filter((friend: FriendProfile) => !friend.accepted)
    );
    const actualFriends = useSelector((state: RootState) =>
        state.friends?.filter((friend: FriendProfile) => friend.accepted)
    );

    console.log("I am in Friends & Wannabees");

    useEffect(() => {
        /*      1. Make a fetch request to gets my friends and wannabees.
        2. dispatch an action creator and pass the data recived.         */
        let abort = false;
        dispatch(asyncReceiveFriendStatus(abort));

        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, []);

    const buttonHandler = (
        buttonAction: keyof typeof DictionaryButtonAction,
        friendId: number
    ) => {
        //When we press the button we want to do a post request to my server!
        console.log(
            "Clicked in button friendship, button action",
            buttonAction
        );
        dispatch(asyncChangeFriendStatus(buttonAction, friendId));
    };

    function seeFriendProfile(idUserToSee: number) {
        console.log("idUserToSee", idUserToSee);
        history.push(`/user/${idUserToSee}`);
    }

    console.log("actualFriends", actualFriends);
    console.log("wannabees", wannabees);

    return (
        <div className="friends-wannabees-container">
            <h1>Friends</h1>
            <div className="friends-wannabees">
                {actualFriends &&
                    actualFriends.map((friend: FriendProfile) => {
                        return (
                            <div
                                key={friend.id}
                                className="friends-wannabees-profile"
                            >
                                <div>
                                    <img
                                        src={
                                            friend.photourl ||
                                            "/defaultProfile.png"
                                        }
                                        alt={`${friend.name} ${friend.surname}`}
                                        onClick={() => {
                                            seeFriendProfile(friend.id);
                                        }}
                                    />
                                    <h3>
                                        {friend.name} {friend.surname}
                                    </h3>
                                </div>
                                <button
                                    onClick={() =>
                                        buttonHandler("Unfriend", friend.id)
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
            </div>
            <h1>WannaBees</h1>
            <div className="friends-wannabees">
                {wannabees &&
                    wannabees.map((wannabee: FriendProfile) => {
                        return (
                            <div
                                key={wannabee.id}
                                className="friends-wannabees-profile  wannabees-profile"
                            >
                                <div>
                                    <img
                                        src={
                                            wannabee.photourl ||
                                            "/defaultProfile.png"
                                        }
                                        alt={`${wannabee.name} ${wannabee.surname}`}
                                        onClick={() => {
                                            seeFriendProfile(wannabee.id);
                                        }}
                                    />
                                    <h3>
                                        {wannabee.name} {wannabee.surname}
                                    </h3>
                                </div>
                                <div>
                                    <button
                                        onClick={() =>
                                            buttonHandler(
                                                "Accept Friend",
                                                wannabee.id
                                            )
                                        }
                                    >
                                        Accept Friend
                                    </button>
                                    <button
                                        onClick={() =>
                                            buttonHandler(
                                                "Delete Request",
                                                wannabee.id
                                            )
                                        }
                                        className="delete-request"
                                    >
                                        Delete Request
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
