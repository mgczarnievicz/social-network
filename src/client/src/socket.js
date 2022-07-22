"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.socket = void 0;
var socket_io_client_1 = require("socket.io-client");
var slice_1 = require("./redux/messages/slice");
var init = function (store) {
    if (!exports.socket) {
        // establish a socket connection once
        // socket = io.connect();
        // REVIEW with Merle
        exports.socket = (0, socket_io_client_1.io)();
    }
    exports.socket.on("newest-generalMsg-chat", function (newestChat) {
        console.log("server just emitted newest-generalMsg-chat", newestChat);
        store.dispatch((0, slice_1.messagesReceived)(newestChat));
        // time to dispatch an action messages/received would be a good one
        // pass to action creator the messages your server emitted
    });
    exports.socket.on("generalMsg-new-message", function (newMsg) {
        console.log("server just emitted a new msg to add", newMsg);
        store.dispatch((0, slice_1.addNewMessage)(newMsg));
        // time to dispatch an action message/addNew would be a good one
        // pass to action the object containing the message, and the user info
        // of the author
    });
};
exports.init = init;
