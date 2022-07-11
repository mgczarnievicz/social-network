import React from "react";

export default function ProfilePhoto(props: {
    name: string;
    surname: string;
    photoUrl: string;
}) {
    console.log("Log the prop in PhotoProfile", props);

    // Save in public a "default.png"
    // photoUrl = photoUrl || "default.png"
    return (
        <div>
            <img src={props.photoUrl} alt="logo" />
            <h1>
                Hi my name is {props.name} {props.surname} and this is my photo!
            </h1>
        </div>
    );
}
