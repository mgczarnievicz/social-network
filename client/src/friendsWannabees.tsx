import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfo } from "./typesClient";

import {
    FriendProfile,
    DictionaryButtonAction,
    changeFriendStatus,
    receiveFriendStatus,
} from "./redux/friends/slice";

// export interface FriendProfile extends ProfileInfo {
//     accepted: boolean;
// }

// export const DictionaryButtonAction = {
//     "Add Friend": "wannabee",
//     Unfriend: "delete",
//     "Cancel Request": "delete",
//     "Accept Friend": "accept",
//     "Delete Request": "delete",
// };

/* 
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/

export default function FriendsAndWannabees() {
    const dispatch = useDispatch();
    const wannabees = useSelector((state: RootState) =>
        state.friends?.filter((friend: FriendProfile) => !friend.accepted)
    );
    const actualFriends = useSelector((state: RootState) =>
        state.friends?.filter((friend: FriendProfile) => friend.accepted)
    );

    console.log("I am in Friends & Wannabees");

    // Just so we can copile
    // const actualFriends: Array<FriendProfile | null> = [];
    // const wannabees: Array<FriendProfile | null> = [];
    // get all the friends
    useEffect(() => {
        /* 
        1. Make a fetch request to gets my friends and wannabees.
        2. dispatch an action creator and pass the data recived.
        */
        let abort = false;
        (async () => {
            try {
                const respBody = await fetch("/getFriends.json");
                const data = await respBody.json();
                console.log("Data from /getFriends.json", data);
                //
                if (!abort) {
                    // We want to despatch the data
                    dispatch(receiveFriendStatus(data.payload));
                } else {
                    console.log("ignore don't run a a state update");
                }
            } catch (err) {
                console.log("Error", err);
            }
        })(); // this closes the async iife
        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, []);

    function buttonHandler(
        buttonAction: keyof typeof DictionaryButtonAction,
        friendId: number
    ) {
        //When we press the button we want to do a post request to my server!
        console.log("Clicked in button friendship");
        console.log("Clicked, button action", buttonAction);

        fetch("/api/setFriendshipStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                button: buttonAction,
                viewUserId: friendId,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Data from post setFriendshipStatus", data);

                dispatch(
                    changeFriendStatus(
                        DictionaryButtonAction[buttonAction],
                        data.data.viewUserId
                    )
                );
            });
    }

    console.log("actualFriends", actualFriends);
    console.log("wannabees", wannabees);

    return (
        <>
            <h1>Friends</h1>
            <div className="friends-wannabees">
                {actualFriends &&
                    actualFriends.map((friend: FriendProfile) => {
                        return (
                            <div
                                key={friend.id}
                                className="friends-wannabees-profile"
                            >
                                <img
                                    src={
                                        friend.photourl || "/defaultProfile.png"
                                    }
                                    alt={`${friend.name} ${friend.surname}`}
                                />
                                <h2>
                                    {friend.name} {friend.surname}
                                </h2>
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
                                <img
                                    src={
                                        wannabee.photourl ||
                                        "/defaultProfile.png"
                                    }
                                    alt={`${wannabee.name} ${wannabee.surname}`}
                                />
                                <h2>
                                    {wannabee.name} {wannabee.surname}
                                </h2>
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
                        );
                    })}
            </div>
        </>
    );
}
