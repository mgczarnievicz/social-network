import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../reducer";

import { PostId } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: { postsId?: Array<PostId>; newPost?: PostId };
}

// typeof ProfileInfoWBio
export default function postsReducer(
    posts: Array<PostId> = [],
    action: ActionType
) {
    switch (action.type) {
        case "/wallPost/receive":
            console.log("/wallPost/receive action.payload", action.payload);
            posts = action.payload.postsId;
            break;
        case "/wallPost/newPost":
            posts = [action.payload.newPost, ...posts];
            break;

        default:
            break;
    }
    return posts;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/

export function updateWallPost(newPost: number) {
    return {
        type: `/wallPost/newPost`,
        payload: { newPost },
    };
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

export const asyncReceiveWallPosts =
    (abort: boolean, wallId: number): UserThunk =>
    async (dispatch: Dispatch) => {
        console.log("I am in asyncReceiveWallPosts");
        try {
            const respBody = await fetch(`/getWallPost/?from=${wallId}`);
            const data = await respBody.json();
            console.log("Data from /getPost", data);

            if (!abort) {
                if (data.status == "Success") {
                    return dispatch({
                        type: `/wallPost/receive`,
                        payload: { postsId: data.posts },
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
