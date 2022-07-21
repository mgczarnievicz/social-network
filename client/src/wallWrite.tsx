import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfoWBio } from "./typesClient";

interface WriteWallProps {
    wallUserId?: number;
}

interface postIfo {
    id: number;
    wallUserId: number;
    post: string;
}

export default function WallWrite(props: WriteWallProps) {
    const [post, setPost] = useState<string | null>(null);

    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    const wallId = props.wallUserId || userInfo.id;

    async function submitPost() {
        console.log("post value", post);
        try {
            const responds = await fetch("/wallPost.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallUserId: wallId, post }),
            });
            const data = await responds.json();
            console.log("Data received from POST wall post", data);
            // now clean the campus.
            setPost("");
        } catch (err) {
            console.log("Error in post wall:", err);
        }
    }

    return (
        <>
            <textarea
                // value={post}
                onChange={(e) => {
                    setPost(e.target.value);
                }}
                rows={3}
                cols={50}
            ></textarea>
            <button onClick={submitPost}>Save</button>
        </>
    );
}
