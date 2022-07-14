import React from "react";
import ProfilePhoto from "./profilePhoto";
import BioEditor from "./bioEditor";

interface ProfileProps {
    name: string;
    surname: string;
    photoUrl: string;
    bio?: string[];

    toggleUploader?: Function;
    upDateBio?: Function;
}

export default function Profile(props: ProfileProps) {
    console.log("log the props in Profile");

    return (
        <div className="profile-component">
            <ProfilePhoto
                name={props.name}
                surname={props.surname}
                photoUrl={props.photoUrl}
                toggleUploader={props.toggleUploader}
            />
            <div className="profile-info">
                <h1>
                    Welcome {props.name} {props.surname}
                </h1>
                <BioEditor bio={props.bio} upDateBio={props.upDateBio} />
            </div>
        </div>
    );
}
