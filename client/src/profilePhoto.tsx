import React from "react";

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
