import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../reducer";

import { CommentsId, CommentsObject } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: {
        commentsId?: Array<CommentsId>;
        newComment?: CommentsId;
        postId?: number;
    };
}

// export default function commentsReducer(
//     comments: CommentsObject = {},
//     action: ActionType
// ) {
//     switch (action.type) {
//         case "/comments/receive":
//             console.log("In /comments/receive", action.payload);
//             //I received a new key value and the array.
//             comments = {
//                 ...comments,
//                 [action.payload.postId as number]: action.payload.commentsId,
//             };

//             break;
//         case "/comments/newComment":
//             console.log("In /comments/new Comment", action.payload.commentsId);

//             // for(key in comments){
//             //     if(key == )
//             // }
//             // comments = {...comments, action.payload};
//             break;
//     }
//     return comments;
// }

export default function commentsReducer(
    comments: Array<CommentsId> = [],
    action: ActionType
) {
    switch (action.type) {
        case "/comments/receive":
            console.log("In /comments/receive", action.payload);
            //I received a new key value and the array.
            comments = action.payload.commentsId;
            // comments = [...action.payload.commentsId, ...comments];

            // comments = {
            //     ...comments,
            //     [action.payload.postId as number]: action.payload.commentsId,
            // };

            break;
        case "/comments/newComment":
            console.log("In /comments/new Comment", action.payload.commentsId);

            // for(key in comments){
            //     if(key == )
            // }
            // comments = {...comments, action.payload};
            comments = [...action.payload.commentsId, ...comments];

            break;
    }
    return comments;
}

/* -------------------------------------------------------------------------------------------
                                    ASYNC: ThunkAction
----------------------------------------------------------------------------------------------*/

type UserThunk = ThunkAction<void, RootState, null, Action<ActionType>>;

/* 
    type ThunkAction<R, S, E, A extends Action>

  S = is the type of root state
    = is the return type of the getState() method.
  
  E = is the type of the extra arguments passed to the ThunkAction
  
  A = is the action type defined in your application.
    = it should be able to extend from Action.
      (this means that it should be an object 
      that must have a `type` field.) Action type is defined in the redux typings.
  */

export const asyncReceiveComments =
    (abort: boolean, postId: number): UserThunk =>
    async (dispatch: Dispatch) => {
        console.log("I am in asyncReceiveWallPosts");
        try {
            const respBody = await fetch(
                `/getCommentsByPostId/?postId=${postId}`
            );
            const data = await respBody.json();
            console.log("Data from /getCommentsByPostId", data);
            console.log("postId, data.commentsId", postId, data.commentsId);

            if (!abort) {
                if (data.status == "Success") {
                    return dispatch({
                        type: `/comments/receive`,
                        payload: { commentsId: data.commentsId },
                    });
                }
            } else {
                console.log("ignore don't run a a state update");
            }
        } catch (err) {
            // handle fetch failure
            console.log("Error", err);
        }
    };

export const asyncNewComment =
    (abort: boolean, wallId: number, post: string): UserThunk =>
    async (dispatch: Dispatch) => {
        console.log("I am in asyncReceiveWallPosts");
        try {
            const respBody = await await fetch("/newComment.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallUserId: wallId, post }),
            });
            const data = await respBody.json();
            console.log("Data from /newComment.json", data);

            if (!abort) {
                if (data.status == "Success") {
                    return dispatch({
                        type: `/comments/newComment`,
                        payload: { newComment: data.payload },
                    });
                }
            } else {
                console.log("ignore don't run a a state update");
            }
        } catch (err) {
            // handle fetch failure
            console.log("Error", err);
        }
    };
