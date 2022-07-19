import React, { useEffect, useState } from "react";
import { ReactReduxContext } from "react-redux";

interface FriendButtonProps {
    viewUser: number;
}

interface FriendShipStatus {
    button: string;
    viewUserId: number;
}

/* 
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/

export default function FriendButton(props: FriendButtonProps) {
    const [friendshipStatus, setFriendshipStatus] =
        useState<FriendShipStatus | null>({} as FriendShipStatus);

    useEffect(() => {
        let abort = false;
        if (!abort) {
            console.log(`viewUser: ${props.viewUser}`);

            fetch(`/api/friendshipStatus/${props.viewUser}`)
                .then((resp) => {
                    return resp.json();
                })
                .then((data) => {
                    console.log(
                        "data received form api/friendshipStatus",
                        data
                    );
                    console.log("data.data", data.data);
                    setFriendshipStatus(data.data);
                    console.log("friendshipStatus", friendshipStatus);
                })
                .catch();
        }
        return () => {
            abort = true;
        };
    }, []);

    console.log("friendshipStatus outside!", friendshipStatus);
    console.log("props", props);

    function buttonHandler() {
        //When we press the button we want to do a post request to my server!
        console.log("Clicked in button friendship");
        console.log("friendshipStatus to send:", friendshipStatus);

        fetch("/api/setFriendshipStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(friendshipStatus),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Data from post setFriendshipStatus", data);
                setFriendshipStatus(data.data);
            });
    }
    return (
        <>
            {/* <pre>{JSON.stringify(friendshipStatus)}</pre> */}
            <button onClick={buttonHandler}>{friendshipStatus?.button} </button>
            {/* <h1>Friendship Status</h1> */}
        </>
    );
}
