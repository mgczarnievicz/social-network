import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncReceiveComments } from "./redux/comments/slice";
import { RootState } from "./redux/reducer";

import { CommentsId, CommentsObject } from "./typesClient";
import Comments from "./comments";
import CommentWrite from "./commentWrite";

interface commentProps {
    postId: number;
    writeComment?: boolean;
}

export default function WallComments(props: commentProps) {
    // I have to search for the comments Id for the post I am in.
    console.log("Props in function WALL comments:", props);
    const dispatch = useDispatch();

    useEffect(() => {
        let abort = false;
        dispatch(asyncReceiveComments(abort, props.postId));

        return () => {
            abort = true;
        };
    }, []);

    return (
        <>
            {/* {props.writeComment && <CommentWrite postId={props.postId} />} key={props.postId}*/}
            {props.writeComment && (
                <CommentWrite postId={props.postId} key={props.postId} />
            )}
            <Comments postId={props.postId} />
        </>
    );
}
