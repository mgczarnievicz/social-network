const spicedPg = require("spiced-pg");
import { QueryResult } from "pg";

let USER_NAME, USER_PASSWORD;
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

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
): QueryResult<{ id: number; name: string; surname: string }> => {
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

module.exports.getUserByEmail = (email: string) => {
    return db.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );
};
