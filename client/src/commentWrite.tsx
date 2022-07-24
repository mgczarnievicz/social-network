import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfoWBio } from "./typesClient";
import { asyncNewComment } from "./redux/comments/slice";
import { text } from "stream/consumers";

import React, {
    Component,
    ChangeEvent,
    useState,
    KeyboardEvent,
    useEffect,
} from "react";

interface WriteWallProps {
    postId?: number;
}

interface postIfo {
    id: number;
    wallUserId: number;
    post: string;
}

export default function WallWrite(props: WriteWallProps) {
    const dispatch = useDispatch();
    const [comment, setComment] = useState<string>("");

    const userInfo: ProfileInfoWBio = useSelector(
        (state: RootState) => state.user
    );

    const keyCheck = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("event.target.value", event.target.value);

        setComment(event.target.value);
        console.log("Comment", comment);

        if (event.key === "Enter") {
            event.preventDefault();
            console.log("event.target.value", event.target.value);
            dispatch(asyncNewComment(props.postId, comment));
            event.target.value = "";
        }
    };

    return (
        <div className="input-comment">
            <textarea
                // value={comment}
                placeholder="write a comment"
                onKeyDown={keyCheck}
                rows={3}
                cols={10}
            ></textarea>
        </div>
    );
}
