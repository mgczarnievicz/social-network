import React from "react";
import { ProgressPlugin } from "webpack";
import WriteWall from "./writeWall";
import WallPost from "./wallPost";

interface WallProps {
    wallUserId: number;
}

export default function Wall(props: WallProps) {
    return (
        <>
            <WriteWall wallUserId={props.wallUserId} />
            <WallPost wallUserId={props.wallUserId} />
        </>
    );
}
