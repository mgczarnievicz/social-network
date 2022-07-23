import React, { useEffect, useState } from "react";
import { ProgressPlugin } from "webpack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faComments, faPlay } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfoWBio } from "./typesClient";
import { useHistory, useParams } from "react-router";

library.add(faHeart, faComments, faPlay);

//<FontAwesomeIcon icon="fa-solid fa-comments" />
//<FontAwesomeIcon icon="fa-solid fa-heart" />

interface postProps {
    postId?: number;
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
interface PostInfo {
    id: number;
    walluser_id: number;
    writer_id: number;
    walluser_name: string;
    walluser_surname: string;
    wallwriter_name: string;
    wallwriter_surname: string;
    post: string;
    created_at: string;
}
interface CommentInfo {}

export default function Post(props: postProps) {
    const [postInfo, setPostInfo] = useState<PostInfo>();
    const [comments, setComments] = useState<Array<CommentInfo>>([]);
    const [commentInput, setCommentInput] = useState<string>("");
    const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

    const { postIdToSee } = useParams<Record<string, string | undefined>>();
    const history = useHistory();

    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    function clickLick() {
        // send the like to the server.
    }

    useEffect(() => {
        let postToDisplay: number;
        console.log("postIdToSee in post", postIdToSee);
        console.log("props in post", props);

        if (postIdToSee) {
            postToDisplay = Number.parseInt(postIdToSee);

            console.log("otherUserId after parseInt", postToDisplay);
            if (Number.isNaN(postToDisplay)) {
                history.replace("/");
            }
        } else {
            postToDisplay = props.postId;
        }

        console.log("postToDisplay:", postToDisplay);

        fetch(`/getPost/?postId=${postToDisplay}`)
            .then((respBody) => respBody.json())
            .then((data) => {
                console.log("Data from /getPost", data);
                if (data.status == "Success") {
                    setPostInfo(data.post);
                }
            })
            .catch((err) => console.log("Error in getPost", err));
    }, []);
    console.log("postInfo", postInfo);

    function clickedComment() {
        console.log("I clicked In comments! Lets Add some!");
    }

    return (
        <>
            {postInfo && (
                <div key={postInfo.id} className="post">
                    {/* <h1>This is post: {postInfo.id}</h1> */}
                    {postInfo.walluser_id == postInfo.writer_id && (
                        <p>
                            {postInfo.walluser_name} {postInfo.walluser_surname}
                        </p>
                    )}
                    {postInfo.walluser_id != postInfo.writer_id && (
                        <div className="user-post">
                            <p>
                                {postInfo.walluser_name}{" "}
                                {postInfo.walluser_surname}
                            </p>
                            <FontAwesomeIcon
                                icon="play"
                                size="xs"
                                color="darkgray"
                                className="post-to"
                            />
                            <p>
                                {postInfo.wallwriter_name}{" "}
                                {postInfo.wallwriter_surname}
                            </p>
                        </div>
                    )}
                    <h3>{postInfo.post}</h3>
                    <h6>{postInfo.created_at}</h6>
                    <div className="icons">
                        <FontAwesomeIcon icon="heart" size="1x" color="grey" />
                        <FontAwesomeIcon
                            icon="comments"
                            size="1x"
                            color="green"
                        />
                    </div>
                </div>
            )}
            {/* comments.map((each: WallPost) => { */}
        </>
    );
}