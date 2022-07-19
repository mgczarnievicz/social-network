// src/ redux/friends/slice.js

// a mini / sub-reducer that handles changes to the global state - but only specific to the friends.

/* 
friends []: is a property inside global state. We are using default parameter here.
action: is a string describe the action to take
*/

import { ProfileInfo } from "./../../typesClient";

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

interface ActionType {
    type: string;
    // to be able to accept any key name as string but the value as now, can only be a number
    // payload: { [key: string]: number | Array<FriendProfile> };
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


1. spread Operator, works in Object and Arrays

2. MAP work ONLY in ARRAYS!

3. FILTER - an array method
great for removing thing from array

*/

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
