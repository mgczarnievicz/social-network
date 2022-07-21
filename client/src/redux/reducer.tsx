import { combineReducers } from "redux";
import friendsAndWannabeesReducer from "./friends/slice";
import userReducer from "./user/slice";
import messagesReducer from "./messages/slice";

const rootReducer = combineReducers({
    friends: friendsAndWannabeesReducer,
    user: userReducer,
    messages: messagesReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
