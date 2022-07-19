import React from "react";

// REVIEW. when changing to global state, this should go. I am passing only the things that I need
interface ProfilePhotoProps {
    name: string;
    surname: string;
    photoUrl: string;

    toggleUploader?: Function;
}

export default function ProfilePhoto(props: ProfilePhotoProps) {
    const altName = `${props.name} ${props.surname}`;
    return (
        <div className="profilePhoto">
            <img
                src={props.photoUrl || "/defaultProfile.png"}
                alt={altName}
                onClick={
                    props.toggleUploader ? () => props.toggleUploader() : null
                }
            />
        </div>
    );
}
