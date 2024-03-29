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
    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    return (
        <div className="profile-component container-main-width shadow">
            <ProfilePhoto toggleUploader={props.toggleUploader} />
            <div className="profile-bio">
                <h1>Welcome {userInfo.name}</h1>
                <BioEditor />
            </div>
            {userInfo.id && <Friends otherUserId={userInfo.id} />}
        </div>
    );
}
