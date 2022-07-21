import React from "react";
import { RootState } from "./redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import { ProfileInfoWBio } from "./typesClient";

interface ProfilePhotoProps {
    name?: string;
    surname?: string;
    photourl?: string;
    toggleUploader?: Function;
}

export default function ProfilePhoto(props: ProfilePhotoProps) {
    let altName;
    let url;
    if (props.name) {
        altName = `${props.name} ${props.surname}`;
        url = props.photourl;
    } else {
        const userInfo: ProfileInfoWBio = useSelector(
            (state: RootState): ProfileInfoWBio => state?.user
        );

        altName = `${userInfo.name} ${userInfo.surname}`;
        url = userInfo.photourl;
    }

    return (
        <div className="profilePhoto">
            <img
                src={url || "/defaultProfile.png"}
                alt={altName}
                onClick={
                    props.toggleUploader ? () => props.toggleUploader() : null
                }
            />
        </div>
    );
}
