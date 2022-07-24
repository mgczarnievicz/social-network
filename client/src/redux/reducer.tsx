import { combineReducers } from "redux";
import friendsAndWannabeesReducer from "./friends/slice";
import userReducer from "./user/slice";
import messagesReducer from "./messages/slice";
import postsReducer from "./wall/slice";
import commentsReducer from "./comments/slice";
import onlineUsersReducer from "./usersOnline/slice";

const rootReducer = combineReducers({
    friends: friendsAndWannabeesReducer,
    user: userReducer,
    messages: messagesReducer,
    posts: postsReducer,
    comments: commentsReducer,
    onlineUsers: onlineUsersReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
