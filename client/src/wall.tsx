import React from "react";
import { ProgressPlugin } from "webpack";
import WallWrite from "./wallWrite";
import WallPost from "./wallPost";

interface WallProps {}

export default function Wall(props: WallProps) {
    console.log("Props in function Wall:", props);

    return (
        <div className="container-main-width">
            <WallWrite />
            <WallPost />
        </div>
    );
}
