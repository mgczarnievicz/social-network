import React, { useEffect, useState } from "react";
import { ProgressPlugin } from "webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faComments, faPlay } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfoWBio } from "./typesClient";
import e from "express";

library.add(faHeart, faComments, faPlay);

import Post from "./post";

//<FontAwesomeIcon icon="fa-solid fa-comments" />
//<FontAwesomeIcon icon="fa-solid fa-heart" />

interface WallProps {
    wallUserId?: number;
}
/*  created_at: "21/07/2022, 17:10:13"
id: 8
post: "I am with you!"
walluser_id: 5
walluser_name: "Lori"
walluser_surname: "Antonio"
wallwriter_name: "Elsa"
wallwriter_surname: "Elsa"
writer_id: 1 */
interface WallPost {
    id: number;
    //     walluser_id: number;
    //     writer_id: number;
    //     walluser_name: string;
    //     walluser_surname: string;
    //     wallwriter_name: string;
    //     wallwriter_surname: string;
    //     post: string;
    //     created_at: string;
}

export default function WallPost(props: WallProps) {
    const [posts, setPosts] = useState<Array<WallPost>>([]);

    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    const wallId = props.wallUserId || userInfo.id;
    console.log("The wall I am going to tell the server to search:", wallId);

    function clickLick() {
        // send the like to the server.
    }

    useEffect(() => {
        console.log("Props in Wall Post:", props);

        // Here I only want the las 5 post id.
        fetch(`/getWallPost/?from=${wallId}`)
            .then((respBody) => respBody.json())
            .then((data) => {
                console.log("Data from /getPost", data);
                if (data.status == "Success") {
                    setPosts(data.posts);
                }
            })
            .catch((err) => console.log("Error in getPost", err));

        // try {
        //     console.log(`/getPost/?from=${wallId}`);

        //     const respBody = await fetch(`/getPost/?from=${wallId}`);
        //     const data = await respBody.json();
        //     console.log("Data from /getPost", data);
        //     if (data.status == "Success") {
        //         console.log("I am here");
        //         setPost(data.posts);
        //     }
        // } catch {
        //     console.log("Error in getting data from /getPost");
        // }
    }, []);

    return (
        <div className="posts-container">
            <h1>This are post!</h1>

            {posts &&
                posts.map((each: WallPost) => {
                    return <Post key={each.id} postId={each.id} />;
                })}

            {/* {posts &&
                posts.map((each: WallPost) => {
                    return (
                        <div key={each.id} className="post">
                            {each.walluser_id == each.writer_id && (
                                <p>
                                    {each.walluser_name} {each.walluser_surname}
                                </p>
                            )}
                            {each.walluser_id != each.writer_id && (
                                <div className="user-post">
                                    <p>
                                        {each.walluser_name}{" "}
                                        {each.walluser_surname}
                                    </p>
                                    <FontAwesomeIcon
                                        icon="play"
                                        className="post-to"
                                    />
                                    <p>
                                        {each.wallwriter_name}{" "}
                                        {each.wallwriter_surname}
                                    </p>
                                </div>
                            )}
                            <h3>{each.post}</h3>
                            <div className="icons">
                                <FontAwesomeIcon
                                    icon="heart"
                                    size="1x"
                                    color="grey"
                                />
                                <FontAwesomeIcon
                                    icon="comments"
                                    size="1x"
                                    color="green"
                                />
                            </div>
                        </div>
                    );
                })} */}
        </div>
    );
}
