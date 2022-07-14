import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";

import ProfilePhoto from "./profilePhoto";

// interface viewOtherUsers {
//     useParams?: number;
// }

interface FriendInfo {
    id: number;
    name: string;
    surname: string;
    photourl: string;
    bio?: [];
}

export default function OtherProfile() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        surname: "",
        photourl: "",
        bio: [],
    });

    const { idUserToSee } = useParams<Record<string, string | undefined>>();
    // const { useParams } = useParams<{ useParams: string }>();
    const history = useHistory();

    console.log("history", history);

    useEffect(() => {
        console.log("Other Profile just render.");
        const otherUserId = Number.parseInt(idUserToSee);
        console.log("otherUserId", otherUserId);

        /* 
        1. Figure out what is the userId we want to fetch information from.
        2. Make a fetch to server to get data (name, surname, photo, bio.)

        Browser browser to se the rout. -> we have a hook called use Params
        */
        let abort = false;
        if (!abort) {
            // const otherUserId = params.otherUserId;
            //Here we make the fetch in the server.
            // only send Integer.
            // not found we want to render something saying NOT Found.
            // Searching myself we should go to our profile page.
            /* if the other user is myself
                history.push("/")
                or
                history.replace("/")
            */
            if (Number.isNaN(otherUserId)) {
                history.replace("/");
            } else {
                // We do the query!
                fetch(`/api/profile/${otherUserId}`)
                    .then((resp) => resp.json())
                    .then((data) => {
                        console.log("data from profile", data);
                        switch (data.status) {
                            case "Equal":
                                // I called myself
                                // go to my profile user.
                                console.log("I am Equal");

                                history.push("/");
                                break;
                            case "Success":
                                // We have a profile.
                                data.profile.bio = data.profile.bio.split("\n");
                                console.log("Data after splitting", data);
                                setUser(data.profile);
                                break;
                            case "Error":
                                // Oops something went wrong.
                                history.go(0);
                                break;
                            case "Not Found":
                                // Not fount
                                setUser(null);
                                break;
                        }
                    });
            }
        }
        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            {user && (
                <div className="profile-component">
                    <ProfilePhoto
                        name={user.name}
                        surname={user.surname}
                        photoUrl={user.photourl}
                    />
                    <div className="profile-info">
                        <h1>
                            {user.name} {user.surname}
                        </h1>
                        {user.bio &&
                            user.bio.map((bioSentence: string, i: number) => {
                                console.log("Bio ", bioSentence);
                                return <h3 key={i}>{bioSentence}</h3>;
                            })}
                    </div>
                </div>
            )}
            {!user && (
                <div>
                    <br />
                    <h1> User Not Found!</h1>
                </div>
            )}
        </>
    );
}
