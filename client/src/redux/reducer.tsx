import { combineReducers } from "redux";
import friendsAndWannabeesReducer from "./friends/slice";
import userReducer from "./user/slice";
import messagesReducer from "./messages/slice";
import postsReducer from "./wall/slice";
import commentsReducer from "./comments/slice";

const rootReducer = combineReducers({
    friends: friendsAndWannabeesReducer,
    user: userReducer,
    messages: messagesReducer,
    posts: postsReducer,
    comments: commentsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
