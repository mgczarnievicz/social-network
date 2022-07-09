"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spicedPg = require("spiced-pg");
var USER_NAME, USER_PASSWORD;
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
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
module.exports.getUserByEmail = function (email) {
    return db.query("SELECT * FROM users\n        WHERE email = $1", [email]);
};
