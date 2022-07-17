import React, { useEffect, useState } from "react";
import { ProgressPlugin } from "webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faComments } from "@fortawesome/free-solid-svg-icons";

library.add(faHeart, faComments);

//<FontAwesomeIcon icon="fa-solid fa-comments" />
//<FontAwesomeIcon icon="fa-solid fa-heart" />

interface WallProps {
    wallUserId: number;
}

export default function Wall(props: WallProps) {
    const [post, setPost] = useState([]);

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const respBody = await fetch(
                    `/getPost?from=${props.wallUserId}`
                );
                const data = await respBody.json();
                console.log("Data from /getPost", data);
                if (!abort) {
                    // We have new data!
                } else {
                    // just ignore data.
                }
            } catch {
                console.log("Error in getting data from /getPost");
            }
        })();
        return () => {
            abort = true;
        };
    });
    return (
        <>
            <h1>This are post!</h1>
            {post &&
                post.map((each: string) => {
                    <div>
                        <h1>each</h1>
                        <FontAwesomeIcon icon="heart" />
                        <FontAwesomeIcon icon="comments" />
                    </div>;
                })}
            <div>
                <FontAwesomeIcon icon="heart" size="3x" color="grey" />
                <FontAwesomeIcon icon="comments" size="2x" color="green" />
            </div>
        </>
    );
}
