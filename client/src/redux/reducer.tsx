import { combineReducers } from "redux";
import friendsAndWannabeesReducer from "./friends/slice";

const rootReducer = combineReducers({
    friends: friendsAndWannabeesReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
