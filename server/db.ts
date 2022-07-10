const spicedPg = require("spiced-pg");
import { QueryResult } from "pg";

import { UserBasicInfo, UserLoggingIn } from "./typesServer";

let USER_NAME, USER_PASSWORD;
if (!process.env.DATABASE_URL) {
    // Bc we are deploying we need to define where to get the value.
    USER_NAME = require("./secrets").USER_NAME;
    USER_PASSWORD = require("./secrets").USER_PASSWORD;
}

const database = "socialNetwork";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${USER_NAME}:${USER_PASSWORD}@localhost:5432/${database}`
);

/* ---------------------------------------------------------------
                    users TABLE
----------------------------------------------------------------*/

module.exports.registerUser = (
    name: string,
    surname: string,
    email: string,
    password: string
): QueryResult<UserBasicInfo> => {
    console.log(
        "Log registerUser:\n name, surname, email, password:",
        name,
        surname,
        email,
        password
    );
    const q = `INSERT INTO users (name, surname, email, password)
    VALUES ($1, $2, $3, $4 ) RETURNING id, name, surname`;

    // RETURNING all
    const param = [name, surname, email, password];
    return db.query(q, param);
};

// If the user is not register it will return an empty array
module.exports.getUserByEmail = (
    email: string
): QueryResult<UserLoggingIn | null> => {
    return db.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.searchUserByEmail = (
    email: string
): QueryResult<{ id: number }> => {
    return db.query(
        `SELECT id FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.updatePassword = (
    email: string,
    newPassword: string
): QueryResult => {
    const q = ` UPDATE users
            SET password = $2
            WHERE email = $1;`;
    const param = [email, newPassword];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                   Reset Password TABLE
----------------------------------------------------------------*/
module.exports.registerCode = (
    email: string,
    code: string
): QueryResult<{ id: number }> => {
    console.log("Log resetpassword:\n email, code:", email, code);
    const q = `INSERT INTO resetpassword (email, code)
    VALUES ($1, $2) RETURNING id`;

    // RETURNING all
    const param = [email, code];
    return db.query(q, param);
};

module.exports.searchCode = (email: string): QueryResult<{ code: number }> => {
    console.log("Log resetpassword:\n email:", email);
    const q = `SELECT code FROM resetpassword
    WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND
    email = $1
    LIMIT 1 
    ORDER DEC
    `;

    // RETURNING all
    const param = [email];
    return db.query(q, param);
};
