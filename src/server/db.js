"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spicedPg = require("spiced-pg");
var USER_NAME, USER_PASSWORD;
if (!process.env.DATABASE_URL) {
    // Bc we are deploying we need to define where to get the value.
    USER_NAME = require("./secrets").USER_NAME;
    USER_PASSWORD = require("./secrets").USER_PASSWORD;
}
var database = "socialNetwork";
var db = spicedPg(process.env.DATABASE_URL ||
    "postgres:".concat(USER_NAME, ":").concat(USER_PASSWORD, "@localhost:5432/").concat(database));
/* ---------------------------------------------------------------
                    users TABLE
----------------------------------------------------------------*/
module.exports.registerUser = function (name, surname, email, password) {
    console.log("Log registerUser:\n name, surname, email, password:", name, surname, email, password);
    var q = "INSERT INTO users (name, surname, email, password)\n    VALUES ($1, $2, $3, $4 ) RETURNING id, name, surname";
    // RETURNING all
    var param = [name, surname, email, password];
    return db.query(q, param);
};
// If the user is not register it will return an empty array
//<UserLoggingIn | null>
module.exports.getUserByEmail = function (email) {
    return db.query("SELECT * FROM users\n        WHERE email = $1", [email]);
};
module.exports.searchUserByEmail = function (email) {
    return db.query("SELECT id FROM users\n        WHERE email = $1", [email]);
};
module.exports.updatePassword = function (email, newPassword) {
    var q = " UPDATE users\n            SET password = $2\n            WHERE email = $1;";
    var param = [email, newPassword];
    return db.query(q, param);
};
module.exports.updateProfileImage = function (userId, url) {
    var q = " UPDATE users\n            SET photourl = $2\n            WHERE id = $1\n            RETURNING photourl;";
    var param = [userId, url];
    return db.query(q, param);
};
exports.getUserDataById = function (userId) {
    var q = " SELECT * FROM users\n            WHERE id = $1";
    var param = [userId];
    return db.query(q, param);
};
exports.upDateBioByUserId = function (userId, newBio) {
    var q = " UPDATE users\n            SET bio = $2\n            WHERE id = $1\n            RETURNING bio";
    var param = [userId, newBio];
    return db.query(q, param);
};
exports.getMatchingFriends = function (val) {
    return db.query("SELECT id, name, surname, photoUrl FROM users \n        WHERE name ILIKE $1;", [val + "%"]);
};
exports.getNewestUsers = function () {
    return db.query("SELECT id, name, surname, photoUrl FROM users \n        ORDER BY id DESC\n        LIMIT 15;", []);
};
/* ---------------------------------------------------------------
                   Reset Password TABLE
----------------------------------------------------------------*/
module.exports.registerCode = function (email, code) {
    console.log("Log resetpassword:\n email, code:", email, code);
    var q = "INSERT INTO resetpassword (email, code)\n    VALUES ($1, $2) RETURNING id";
    // RETURNING all
    var param = [email, code];
    return db.query(q, param);
};
module.exports.searchCode = function (email) {
    console.log("Log resetpassword:\n email:", email);
    var q = "SELECT code FROM resetpassword\n    WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' \n    AND email = $1\n    ORDER BY id DESC\n    LIMIT 1 \n    ";
    // RETURNING all
    var param = [email];
    return db.query(q, param);
};
