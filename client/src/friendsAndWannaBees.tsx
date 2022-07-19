import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProfileInfo } from "./typesClient";

export interface FriendProfile extends ProfileInfo {
    accepted: boolean;
}

export default function FriendsAndWannabees() {
    const dispatch = useDispatch();
    // const wannabees = useSelector((state) =>
    //     state.friends.FILTER((friend: FriendProfile) => !friend.accepted)
    // );
    // get all the friends
    useEffect(() => {
        /* 
        1. Make a fetch request to gets my friends and wannabees.
    
        2. dispatch an action creator and pass the data recived.
        */
    }, []);
    return (
        <>
            <section>
                <h1>Friends</h1>
                {/* <h1>WannaBees</h1>
                {wannabees && wannabees.map((wannabee)=>{
                    <div key={wannabee.id}>
                        <h1>{wannabee.name}</h1>
                    </div>
                })} */}
            </section>
        </>
    );
}
