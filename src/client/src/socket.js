"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.socket = void 0;
var socket_io_client_1 = require("socket.io-client");
var init = function (store) {
    if (!exports.socket) {
        // establish a socket connection once
        // socket = io.connect();
        // REVIEW with Merle
        exports.socket = (0, socket_io_client_1.io)();
    }
    exports.socket.on("last-10-messages", function (msgs) {
        console.log("server just emitted last-20-messages", msgs);
        // time to dispatch an action messages/received would be a good one
        // pass to action creator the messages your server emitted
    });
    exports.socket.on("add-new-message", function (msg) {
        console.log("server just emitted a new msg to add", msg);
        // time to dispatch an action message/addNew would be a good one
        // pass to action the object containing the message, and the user info
        // of the author
    });
};
exports.init = init;
