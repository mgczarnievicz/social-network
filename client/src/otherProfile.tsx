import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";

import ProfilePhoto from "./profilePhoto";
import FriendButton from "./friendButton";
import { ProfileInfoWBio } from "./typesClient";
import Wall from "./wall";
import Friends from "./friends";

export default function OtherProfile() {
    // DON'T TOUCH IF BREAKS FRIEND BUTTON
    const [user, setUser] = useState<ProfileInfoWBio | null>(null);
    const { idUserToSee } = useParams<Record<string, string | undefined>>();
    const history = useHistory();

    useEffect(() => {
        const otherUserId = Number.parseInt(idUserToSee);

        /* 
        1. Figure out what is the userId we want to fetch information from.
        2. Make a fetch to server to get data (name, surname, photo, bio.)
        Browser browser to se the rout. -> we have a hook called use Params
        */
        let abort = false;
        if (!abort) {
            if (Number.isNaN(otherUserId)) {
                history.replace("/");
            } else {
                // We do the query!
                fetch(`/api/profile/${otherUserId}`)
                    .then((resp) => resp.json())
                    .then((data) => {
                        switch (data.status) {
                            case "Equal":
                                // I called myself
                                // go to my profile user.
                                history.push("/");
                                break;
                            case "Success":
                                // We have a profile.
                                if (data.profile.bio)
                                    data.profile.bio =
                                        data.profile.bio.split("\n");
                                // console.log("Data after splitting", data);
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
            {!user && (
                <div>
                    <br />
                    <h1> User Not Found!</h1>
                </div>
            )}
            {user && (
                <>
                    <div className="profile-component container-main-width">
                        <div className="photo-friendButton">
                            <ProfilePhoto
                                name={user.name}
                                surname={user.surname}
                                photourl={user.photourl}
                            />
                            <FriendButton viewUser={user.id} />
                        </div>

                        <div className="profile-info">
                            <h1>
                                {user.name} {user.surname}
                            </h1>
                            {user.bio &&
                                user.bio.map(
                                    (bioSentence: string, i: number) => {
                                        return (
                                            <h3 className="bio-text" key={i}>
                                                {bioSentence}
                                            </h3>
                                        );
                                    }
                                )}
                        </div>
                        <Friends otherUserId={user.id} />
                        <Wall wallUserId={user.id} />
                    </div>
                </>
            )}
        </>
    );
}
