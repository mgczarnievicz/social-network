import { ProfileInfo } from "./../../typesClient";

interface ActionType {
    type: string;
    payload: { usersOnline?: Array<ProfileInfo> };
}

export default function onlineUsersReducer(
    onlineUsers: Array<ProfileInfo> = [],
    action: ActionType
) {
    switch (action.type) {
        case "usersOnline/update":
            console.log("IN usersOnline/update");
            onlineUsers = action.payload.usersOnline;
            break;
        default:
            break;
    }
    return onlineUsers;
}

export function usersOnlineUpdate(listUsers: Array<ProfileInfo>) {
    return {
        type: "usersOnline/update",
        payload: { usersOnline: listUsers },
    };
}
