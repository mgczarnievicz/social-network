import React from "react";
import { RootState } from "./redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import { ProfileInfoWBio } from "./typesClient";

// REVIEW. when changing to global state, this should go. I am passing only the things that I need
interface ProfilePhotoProps {
    toggleUploader?: Function;
}

export default function ProfilePhoto(props: ProfilePhotoProps) {
    // const userInfo: ProfileInfoWBio = useSelector(
    //     (state: RootState): ProfileInfoWBio => state?.user
    // );

    const userInfo = {
        name: "maria",
        surname: "Inciarte",
        photourl: "",
    };
    const altName = `${userInfo.name} ${userInfo.surname}`;
    return (
        <div className="profilePhoto">
            <img
                src={userInfo.photourl || "/defaultProfile.png"}
                alt={altName}
                onClick={
                    props.toggleUploader ? () => props.toggleUploader() : null
                }
            />
        </div>
    );
}
