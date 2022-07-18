import React, { useState } from "react";

interface WriteWallProps {
    wallUserId: number;
}

interface postIfo {
    id: number;
    wallUserId: number;
    post: string;
}

export default function Wall(props: WriteWallProps) {
    const [post, setPost] = useState<string | null>(null);

    async function submitPost() {
        console.log("post value", post);
        try {
            const responds = await fetch("/wallPost.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallUserId: props.wallUserId, post }),
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
