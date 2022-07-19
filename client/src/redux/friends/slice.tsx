// src/ redux/friends/slice.js

// a mini / sub-reducer that handles changes to the global state - but only specific to the friends.

/* 
friends []: is a property inside global state. We are using default parameter here.
action: is a string describe the action to take
*/

export default function friendsAndWannabeesReducer(
    friends: [] = [],
    action: string
) {
    return friends;
}

/* 


1. spread Operator, works in Object and Arrays

2. MAP work ONLY in ARRAYS!

3. FILTER - an array method
great for removing thing from array

*/
