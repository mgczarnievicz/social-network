"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.socket = void 0;
var socket_io_client_1 = require("socket.io-client");
var slice_1 = require("./redux/messages/slice");
var slice_2 = require("./redux/usersOnline/slice");
var init = function (store) {
    if (!exports.socket) {
        // establish a socket connection once
        // socket = io.connect();
        // REVIEW with Merle
        exports.socket = (0, socket_io_client_1.io)();
    }
    exports.socket.on("chat-newest-message", function (newestChat) {
        store.dispatch((0, slice_1.messagesReceived)(newestChat));
    });
    exports.socket.on("chat-new-message", function (newMsg) {
        store.dispatch((0, slice_1.addNewMessage)(newMsg));
    });
    exports.socket.on("online-users", function (newMsg) {
        store.dispatch((0, slice_2.usersOnlineUpdate)(newMsg));
    });
};
exports.init = init;
