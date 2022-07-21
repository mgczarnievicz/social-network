import React, { Component, ChangeEvent, useState, KeyboardEvent } from "react";

import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";

export default function Chat() {
    const messages = useSelector((state: RootState) => state.messages);
    // KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>

    // React.ChangeEvent<HTMLTextAreaElement>
    const keyCheck = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("What was pass.");
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);
            // after emitting our msg we clear the text area
            event.target.value = "";
        }
    };
    return (
        <>
            <h1>Welcome to chat</h1>
            <div className="chat-container">
                <p>Chat Messages</p>
            </div>
            <textarea
                placeholder="Write a new Message"
                onKeyDown={keyCheck}
            ></textarea>
        </>
    );
}
