import React from "react";
import { RootState } from "./redux/reducer";
import { useDispatch, useSelector } from "react-redux";

import ProfilePhoto from "./profilePhoto";
import BioEditor from "./bioEditor";
import { ProfileInfoWBio } from "./typesClient";

interface ProfileProps {
    toggleUploader?: Function;
    upDateBio?: Function;
}

export default function Profile(props: ProfileProps) {
    console.log("log the props in Profile");
    // const userInfo: ProfileInfoWBio = useSelector(
    //     (state: RootState) => state.user
    // );

    const userInfo = {
        name: "maria",
        surname: "Inciarte",
        photourl: "",
        bio: "",
    };

    return (
        <div className="profile-component">
            <ProfilePhoto toggleUploader={props.toggleUploader} />
            <div className="profile-info">
                <h1>
                    Welcome {userInfo.name} {userInfo.surname}
                </h1>
                {/* <BioEditor upDateBio={props.upDateBio} /> */}
            </div>
        </div>
    );
}
