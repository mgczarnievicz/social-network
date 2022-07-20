// src/ redux/friends/slice.js
// a mini / sub-reducer that handles changes to the global state - but only specific to the friends.

/* 
friends []: is a property inside global state. We are using default parameter here.
action: is a string describe the action to take
*/
import { Action, ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { ProfileInfo } from "./../../typesClient";
import { RootState } from "./../reducer";

export interface FriendProfile extends ProfileInfo {
    accepted: boolean;
}

export const DictionaryButtonAction = {
    "Add Friend": "wannabee",
    Unfriend: "delete",
    "Cancel Request": "delete",
    "Accept Friend": "accept",
    "Delete Request": "delete",
};

// to be able to accept any key name as string but the value as now, can only be a number
interface ActionType {
    type: string;
    payload: { id?: number; friends?: Array<FriendProfile> };
}

export default function friendsAndWannabeesReducer(
    friends: Array<FriendProfile | null> = [],
    action: ActionType
) {
    switch (action.type) {
        case "/friends-wannabees/receive":
            friends = action.payload.friends;
            break;
        case "/friends-wannabees/wannabee":
            friends = friends.map((friend: FriendProfile): FriendProfile => {
                if (friend.id == action.payload.id) {
                    return { ...friend, accepted: false };
                } else {
                    return friend;
                }
            });
            break;
        case "/friends-wannabees/delete":
            friends = friends.filter((friend: FriendProfile): FriendProfile => {
                if (friend.id != action.payload.id) {
                    // I need to take it out of the new array
                    return friend;
                }
            });
            break;
        case "/friends-wannabees/accept":
            friends = friends.map((friend: FriendProfile): FriendProfile => {
                if (friend.id == action.payload.id) {
                    return { ...friend, accepted: true };
                } else {
                    return friend;
                }
            });
            break;
        default:
            break;
    }
    return friends;
}

/* 
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/

export function changeFriendStatus(action: string, id: number) {
    return {
        type: `/friends-wannabees/${action}`,
        payload: { id },
    };
}

export function receiveFriendStatus(friends: Array<FriendProfile>) {
    return {
        type: `/friends-wannabees/receive`,
        payload: { friends },
    };
}

/* -------------------------------------------------------------------------------------------
                                    ASYNC: ThunkAction
----------------------------------------------------------------------------------------------*/

type FriendThunk = ThunkAction<void, RootState, null, Action<ActionType>>;

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

export const asyncReceiveFriendStatus =
    (abort: boolean): FriendThunk =>
    async (dispatch: Dispatch) => {
        console.log("I am in asyncReceiveFriendStatus");
        try {
            // handle fetch success
            const respBody = await fetch("/getFriends.json");
            const data = await respBody.json();
            console.log("Data from /getFriends.json", data);
            //
            if (!abort) {
                // We want to despatch the data
                //  dispatch(receiveFriendStatus(data.payload));
                return dispatch({
                    type: `/friends-wannabees/receive`,
                    payload: { friends: data.payload },
                });
            } else {
                console.log("ignore don't run a a state update");
            }
        } catch (err) {
            // handle fetch failure
            console.log("Error", err);
        }
    };

export const asyncChangeFriendStatus =
    (
        buttonAction: keyof typeof DictionaryButtonAction,
        friendId: number
    ): FriendThunk =>
    async (dispatch: Dispatch) => {
        console.log("I am in asyncChangeFriendStatus");
        try {
            const resp = await fetch("/api/setFriendshipStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    button: buttonAction,
                    viewUserId: friendId,
                }),
            });
            const data = await resp.json();
            console.log("Data from post setFriendshipStatus", data);

            return dispatch({
                type: `/friends-wannabees/${DictionaryButtonAction[buttonAction]}`,
                payload: { id: data.data.viewUserId },
            });
        } catch (err) {
            // handle fetch failure
        }
    };
