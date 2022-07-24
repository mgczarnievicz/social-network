import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncReceiveComments } from "./redux/comments/slice";
import { RootState } from "./redux/reducer";

import { CommentsId, CommentsObject } from "./typesClient";
import CommentDisplay from "./commentDisplay";

interface commentProps {
    postId: number;
}

export default function Comments(props: commentProps) {
    // I have to search for the comments Id for the post I am in.
    console.log("Props in function comments:");

    //
    //[props.postId]
    const commentsId: Array<CommentsId> = useSelector((state: RootState) =>
        state.comments?.filter(
            (each: CommentsId) => each.post_id == props.postId
        )
    );

    console.log("in Comments", commentsId);

    return (
        <div className="comment-container">
            {/* {props.writeComment && <CommentWrite />} */}

            {commentsId &&
                commentsId.map((each: CommentsId) => {
                    return (
                        <>
                            {console.log("each", each)}
                            <CommentDisplay
                                key={each.comment_id}
                                comment_id={each.comment_id}
                            />
                        </>
                    );
                })}
        </div>
    );
}
