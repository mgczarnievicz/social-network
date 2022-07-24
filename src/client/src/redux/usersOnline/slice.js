"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersOnlineUpdate = void 0;
function onlineUsersReducer(onlineUsers, action) {
    if (onlineUsers === void 0) { onlineUsers = []; }
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
exports.default = onlineUsersReducer;
function usersOnlineUpdate(listUsers) {
    return {
        type: "usersOnline/update",
        payload: { usersOnline: listUsers },
    };
}
exports.usersOnlineUpdate = usersOnlineUpdate;
