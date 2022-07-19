"use strict";
// src/ redux/friends/slice.js
Object.defineProperty(exports, "__esModule", { value: true });
// a mini / sub-reducer that handles changes to the global state - but only specific to the friends.
/*
friends []: is a property inside global state. We are using default parameter here.
action: is a string describe the action to take
*/
function friendsAndWannabeesReducer(friends, action) {
    if (friends === void 0) { friends = []; }
    return friends;
}
exports.default = friendsAndWannabeesReducer;
/*


1. spread Operator, works in Object and Arrays

2. MAP work ONLY in ARRAYS!

3. FILTER - an array method
great for removing thing from array

*/
