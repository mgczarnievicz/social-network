import React from "react";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

library.add(faHeart);

interface CommentProps {
    comment_id: number;
}

interface CommentInfo {
    comment_id: number;
    name: string;
    surname: string;
    comment: string;
    created_at: string;
}

export default function CommentDisplay(props: CommentProps) {
    const [commentInfo, setCommentInfo] = useState<CommentInfo>();

    useEffect(() => {
        let abort = false;

        // console.log("In Comment Display props", props);

        fetch(`/getCommentInfo/?commentId=${props.comment_id}`)
            .then((respBody) => respBody.json())
            .then((data) => {
                // console.log("Data from /getPost", data);
                if (data.status == "Success") {
                    setCommentInfo(data.commentInfo);
                }
            })
            .catch((err) => console.log("Error in getPost", err));

        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            {commentInfo && (
                // key={commentInfo.comment_id}
                <div className="comment-post">
                    {/* <pre>{JSON.stringify(commentInfo.comment_id)}</pre> */}
                    <p>
                        {commentInfo.name} {commentInfo.surname}
                    </p>
                    <h4>{commentInfo.comment}</h4>
                    <div className="comment-icon icons">
                        <FontAwesomeIcon icon="heart" size="sm" color="grey" />
                        <h6>{commentInfo.created_at}</h6>
                    </div>
                </div>
            )}
        </>
    );
}
