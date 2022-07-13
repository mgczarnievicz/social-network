import React, { useEffect, useState } from "react";

interface FriendInfo {
    id: number;
    name: string;
    surname: string;
    photourl: string;
}

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
    const [friends, setFriends] = useState(null);
    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                console.log("searchInput right now", searchInput);
                const respBody = await fetch(
                    `/searchFriend?search=${searchInput}`
                );
                const data = await respBody.json();
                console.log("data from /searchFriend", data);
                if (!abort) {
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
            console.log("cleanup running");
            abort = true;
        };
    }, [searchInput]);

    return (
        <div className="search-container">
            <div className="search-inputs">
                <h1>Friends</h1>

                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={searchInput}
                />
                {!searchInput && <h1>See the newest Users!</h1>}
            </div>
            <div className="friend-container">
                {friends &&
                    friends.map((friend: FriendInfo, i: number) => {
                        console.log("Friend", friend);
                        return (
                            <div key={friend.id} className="friend-info">
                                <img
                                    src={
                                        friend.photourl || "defaultProfile.png"
                                    }
                                />
                                <h3>
                                    {friend.name}
                                    {friend.surname}
                                </h3>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
