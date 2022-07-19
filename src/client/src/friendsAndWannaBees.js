"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/friends/slice");
// export interface FriendProfile extends ProfileInfo {
//     accepted: boolean;
// }
// export const DictionaryButtonAction = {
//     "Add Friend": "wannabee",
//     Unfriend: "delete",
//     "Cancel Request": "delete",
//     "Accept Friend": "accept",
//     "Delete Request": "delete",
// };
/*
FriendButton values:
   - Add Friend
   - Unfriend
   - Cancel Request
   - Accept Friend
   - Delete Request
*/
function FriendsAndWannabees() {
    var dispatch = (0, react_redux_1.useDispatch)();
    // const wannabees = useSelector((state) =>
    //     state.friends.FILTER((friend: FriendProfile) => !friend.accepted)
    // );
    // const actualFriends = useSelector((state) =>
    //     state.friends.FILTER((friend: FriendProfile) => friend.accepted)
    // );
    // Just so we can copile
    var actualFriends = [];
    var wannabees = [];
    // get all the friends
    (0, react_1.useEffect)(function () {
        /*
        1. Make a fetch request to gets my friends and wannabees.
    
        2. dispatch an action creator and pass the data recived.
        */
    }, []);
    function buttonHandler(buttonAction, friendId) {
        //When we press the button we want to do a post request to my server!
        console.log("Clicked in button friendship");
        console.log("Clicked, button action", buttonAction);
        fetch("/api/setFriendshipStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                button: buttonAction,
                viewUserId: friendId,
            }),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("Data from post setFriendshipStatus", data);
            dispatch((0, slice_1.changeFriendStatus)(slice_1.DictionaryButtonAction[buttonAction], data.data.viewUserId));
            // setFriendshipStatus(data.data);
        });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Friends" }), actualFriends &&
                actualFriends.map(function (friend) {
                    (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: friend.photourl || "/defaultProfile.png", alt: "".concat(friend.name, " ").concat(friend.surname) }), (0, jsx_runtime_1.jsxs)("h1", { children: [friend.name, " ", friend.surname] }), (0, jsx_runtime_1.jsx)("button", { children: "Unfriend" })] }, friend.id);
                }), (0, jsx_runtime_1.jsx)("h1", { children: "WannaBees" }), wannabees &&
                wannabees.map(function (wannabee) {
                    (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("img", { src: wannabee.photourl || "/defaultProfile.png", alt: "".concat(wannabee.name, " ").concat(wannabee.surname) }), (0, jsx_runtime_1.jsxs)("h1", { children: [wannabee.name, " ", wannabee.surname] }), (0, jsx_runtime_1.jsx)("button", { children: "Accept Friend" })] }, wannabee.id);
                })] }));
}
exports.default = FriendsAndWannabees;
