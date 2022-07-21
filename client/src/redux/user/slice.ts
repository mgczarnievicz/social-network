import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./../reducer";

import { ProfileInfoWBio, ProfileInfo } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: Partial<ProfileInfoWBio>;
}

const initUser: ProfileInfoWBio = {
    id: null,
    name: "",
    surname: "",
    photourl: "",
    bio: [],
};

// typeof ProfileInfoWBio
export default function userReducer(
    user: ProfileInfoWBio = initUser,
    action: ActionType
) {
    switch (action.type) {
        case "/userInfo/receive":
            console.log("action.payload", action.payload);
            user = { ...user, ...action.payload };

            // user = action.payload as ProfileInfoWBio;
            action.payload
                ? (user = action.payload as ProfileInfoWBio)
                : (user = initUser);
            break;
        case "/userInfo/updatePhotoUrl":
            user = { ...user, photourl: action.payload.photourl };
            break;
        case "/userInfo/updateBio":
            user = { ...user, bio: action.payload.bio };
            break;
        default:
            break;
    }
    return user;
}

/* -------------------------------------------------------------------------------------------
                                    ACTION
----------------------------------------------------------------------------------------------*/

export function userUpdatePhotoUrl(photourl: string) {
    return {
        type: `/userInfo/updatePhotoUrl`,
        payload: { photourl },
    };
}

export function userUpdateBio(bio: Array<string>) {
    return {
        type: `/userInfo/updateBio`,
        payload: { bio },
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

export const asyncReceiveUser =
    (abort: boolean): UserThunk =>
    async (dispatch: Dispatch) => {
        console.log("I am in asyncReceiveUser");
        try {
            // handle fetch success
            // REVIEW: Need to send the bio as array!
            const respBody = await fetch("/getUserInfo.json");
            const data = await respBody.json();
            console.log("Data from /getUserInfo.json", data);

            if (!abort) {
                return dispatch({
                    type: `/userInfo/receive`,
                    payload: { ...data.payload },
                });
            } else {
                console.log("ignore don't run a a state update");
            }
        } catch (err) {
            // handle fetch failure
            console.log("Error", err);
        }
    };
