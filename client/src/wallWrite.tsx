import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfoWBio } from "./typesClient";
import { asyncNewPost } from "./redux/wall/slice";
import { text } from "stream/consumers";

interface WriteWallProps {
    wallUserId?: number;
}

interface postIfo {
    id: number;
    wallUserId: number;
    post: string;
}

export default function WallWrite(props: WriteWallProps) {
    const dispatch = useDispatch();
    const [post, setPost] = useState<string | null>("");

    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    const wallId = props.wallUserId || userInfo.id;

    function submitPost() {
        let abort = false;
        dispatch(asyncNewPost(abort, wallId, post));
        setPost("");

        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }

    return (
        <div className="input-post">
            <textarea
                value={post}
                onChange={(e) => {
                    setPost(e.target.value);
                }}
                rows={3}
                cols={10}
            ></textarea>
            <button onClick={submitPost}>Post</button>
        </div>
    );
}
