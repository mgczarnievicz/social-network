import React from "react";
import { useEffect, useState } from "react";

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

        console.log("In Comment Display props", props);

        fetch(`/getCommentInfo/?commentId=${props.comment_id}`)
            .then((respBody) => respBody.json())
            .then((data) => {
                console.log("Data from /getPost", data);
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
                    <pre>{JSON.stringify(commentInfo.comment_id)}</pre>
                    <p>
                        {commentInfo.name} {commentInfo.surname}
                    </p>
                    <h3>{commentInfo.comment}</h3>
                    <h6>{commentInfo.created_at}</h6>
                </div>
            )}
        </>
    );
}
