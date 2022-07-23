import React from "react";
import { RootState } from "./redux/reducer";
import { useDispatch, useSelector } from "react-redux";

import ProfilePhoto from "./profilePhoto";
import BioEditor from "./bioEditor";
import { ProfileInfoWBio } from "./typesClient";
import Friends from "./friends";

interface ProfileProps {
    toggleUploader?: Function;
}

export default function Profile(props: ProfileProps) {
    console.log("log the props in Profile");
    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    return (
        <div className="profile-component container-main-width">
            <ProfilePhoto toggleUploader={props.toggleUploader} />
            <div className="profile-info">
                <h1>
                    Welcome {userInfo.name} {userInfo.surname}
                </h1>
                <BioEditor />
                {/* <Friends otherUserId={userInfo.id} /> */}
            </div>
        </div>
    );
}
