import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ProfileInfo } from "./typesClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

library.add(faMagnifyingGlass);

// interface FriendInfo {
//     id: number;
//     name: string;
//     surname: string;
//     photourl: string;
// }

export default function FindPeople() {
    /* useEffect allows us to have a lice cycle methods to hook into react's 
    render process it, it accept two arguments:
    1. a callback
    2. an array that limits when the effect should run
    
    
    Its better to user a unique id, not the index that we generate in the loop. 
    {countries?.map((country, i)=>{
        return <li key={i}>{country}</li>
    })}*/

    const [searchInput, setSearch] = useState("");
    const [text, setText] = useState("Newest Users");

    const [friends, setFriends] = useState(null);
    const history = useHistory();

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const respBody = await fetch(
                    `/searchFriend?search=${searchInput}`
                );
                const data = await respBody.json();
                
                if (!abort) {
                    if (searchInput) {
                        setText("");
                    } else {
                        setText("Newest Users");
                    }
                    if (data.friends.length == 0) {
                        setText("No Results");
                    }
                    setFriends(data.friends);
                } else {
                    console.log("ignore don't run a a state update");
                }
            } catch (err) {
                console.log("err on fetch Friends");
            }
        })(); // this closes the async iife
        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            abort = true;
        };
    }, [searchInput]);

    function seeFriendProfile(idUserToSee: number) {
        history.push(`/user/${idUserToSee}`);
    }

    return (
        <div className="search-container container-main-width">
            <div className="search-inputs">
                {/* {!searchInput && <h1>Newest Users</h1>} */}
                <div>
                    <h1>{text}</h1>
                </div>
                <div>
                    <input
                        onChange={(e) => setSearch(e.target.value)}
                        value={searchInput}
                        placeholder="Search"
                    />
                    <FontAwesomeIcon icon="magnifying-glass" color="grey" />
                </div>
            </div>
            <div className="friend-container">
                {friends &&
                    friends.map((friend: ProfileInfo, i: number) => {
                        return (
                            <div
                                key={friend.id}
                                className="friend-info"
                                onClick={() => {
                                    seeFriendProfile(friend.id);
                                }}
                            >
                                <img
                                    src={
                                        friend.photourl || "defaultProfile.png"
                                    }
                                />
                                <h3>
                                    {friend.name} {friend.surname}
                                </h3>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
