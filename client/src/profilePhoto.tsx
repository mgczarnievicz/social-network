import React from "react";

export default function ProfilePhoto(props: {
    name: string;
    surname: string;
    photoUrl: string;
    toggleModal: Function;
}) {
    console.log("Log the prop in PhotoProfile", props);

    // Save in public a "default.png" onClick={props.toggleModal()}
    const photoUrl = props.photoUrl || "defaultProfile.png";
    const altName = `${props.name} ${props.surname}`;
    return (
        <div className="profilePhoto">
            <img
                src={photoUrl}
                alt={altName}
                onClick={() => props.toggleModal()}
            />
        </div>
    );
}
