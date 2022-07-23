import React, { useEffect } from "react";
import { ProgressPlugin } from "webpack";
import WallWrite from "./wallWrite";
import WallPost from "./wallPost";
import { useDispatch, useSelector } from "react-redux";

import { asyncReceiveWallPosts } from "./redux/wall/slice";
import { ProfileInfoWBio } from "./typesClient";
import { RootState } from "./redux/reducer";

interface WallProps {
    wallUserId?: number;
}

export default function Wall(props: WallProps) {
    console.log("Props in function Wall:", props);
    const dispatch = useDispatch();

    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    const wallId = props.wallUserId || userInfo.id;
    console.log("The wall I am going to tell the server to search:", wallId);

    useEffect(() => {
        /*      1. Make a fetch request to gets my friends and wannabees.
        2. dispatch an action creator and pass the data recived.         */
        let abort = false;
        dispatch(asyncReceiveWallPosts(abort, wallId));

        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, []);

    return (
        <div className="container-main-width">
            <WallWrite />
            <WallPost />
        </div>
    );
}
