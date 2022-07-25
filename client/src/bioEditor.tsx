import React, { Component, ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { runInThisContext } from "vm";
import { parentPort } from "worker_threads";
import { RootState } from "./redux/reducer";

import { userUpdateBio } from "./redux/user/slice";

// --------------------------------------------------------------------------------------------------

interface BioProps {}

function BioEditor(props: BioProps) {
    const dispatch = useDispatch();

    const [draftBio, setDraftBio] = useState<string>("");
    const [showTextArea, setShowTextArea] = useState<boolean>(false);

    const bio = useSelector((state: RootState) => state.user.bio);

    // useEffect(() => {
    //     let abort = false;

    //     if (bio){
    //         setDraftBio = bio.join("\n");

    //     }

    // }, []);
    // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
    // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
    function handleBioChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setDraftBio(event.target.value);
    }

    function submitBio() {
        // console.log("U clicked Save Bio!");

        fetch("/setBioInfo.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("Data from update Bio", data);
                if (data.status === "Success") {
                    setShowTextArea(false);
                    setDraftBio("");
                    dispatch(userUpdateBio(data.bio));
                }
            });
    }

    function toggleBioEditor() {
        let stringDraftBio: string = "";
        if (bio) stringDraftBio = bio.join("\n");

        setShowTextArea(!showTextArea);
        setDraftBio(stringDraftBio);
    }

    return (
        <div className="bio-container">
            {bio && !showTextArea && (
                <div className="bio-display">
                    {bio &&
                        bio.map((bioSentence: string, i: number) => {
                            // console.log("Bio ", bioSentence);
                            return (
                                <h3 className="bio-text" key={i}>
                                    {bioSentence}
                                </h3>
                            );
                        })}

                    {/* <h3>{bio}</h3> */}
                    <button onClick={toggleBioEditor}>Edit Bio</button>
                </div>
            )}

            {!bio && !showTextArea && (
                <button onClick={toggleBioEditor}>Add Bio</button>
            )}

            {showTextArea && (
                <div className="bio-display">
                    <textarea
                        value={draftBio}
                        onChange={handleBioChange}
                        rows={5}
                        cols={25}
                    ></textarea>
                    <button onClick={submitBio}>Save</button>
                </div>
            )}
        </div>
    );
}

export default BioEditor;
