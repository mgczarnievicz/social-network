"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
function FriendsAndWannabees() {
    var dispatch = (0, react_redux_1.useDispatch)();
    // const wannabees = useSelector((state) =>
    //     state.friends.FILTER((friend: FriendProfile) => !friend.accepted)
    // );
    // get all the friends
    (0, react_1.useEffect)(function () {
        /*
        1. Make a fetch request to gets my friends and wannabees.
    
        2. dispatch an action creator and pass the data recived.
        */
    }, []);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("section", { children: (0, jsx_runtime_1.jsx)("h1", { children: "Friends" }) }) }));
}
exports.default = FriendsAndWannabees;
