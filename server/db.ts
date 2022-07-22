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
    const q = `INSERT INTO users (name, surname, email, password)
    VALUES ($1, $2, $3, $4 ) RETURNING id, name, surname`;

    const param = [name, surname, email, password];
    return db.query(q, param);
};

// If the user is not register it will return an empty array
//<UserLoggingIn | null>
module.exports.getUserByEmail = (email: string): QueryResult => {
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

module.exports.updateProfileImage = (
    userId: number,
    url: string
): QueryResult => {
    const q = ` UPDATE users
            SET photourl = $2
            WHERE id = $1
            RETURNING photourl;`;
    const param = [userId, url];
    return db.query(q, param);
};

exports.getUserDataById = (userId: number): QueryResult => {
    const q = ` SELECT * FROM users
            WHERE id = $1`;
    const param = [userId];
    return db.query(q, param);
};

exports.upDateBioByUserId = (userId: number, newBio: string): QueryResult => {
    const q = ` UPDATE users
            SET bio = $2
            WHERE id = $1
            RETURNING bio`;
    const param = [userId, newBio];
    return db.query(q, param);
};

exports.getMatchingFriends = (val: string, userId: number): QueryResult => {
    return db.query(
        `SELECT id, name, surname, photoUrl FROM users 
        WHERE  id!=$2
        AND name ILIKE $1
        OR surname ILIKE $1
        AND id!=$2
       ;`,
        [val + "%", userId]
    );
};
// WHERE id!=userId
exports.getNewestUsers = (userId: number): QueryResult => {
    return db.query(
        `SELECT id, name, surname, photoUrl FROM users 
        WHERE id!=$1
        ORDER BY id DESC
        LIMIT 15;`,
        [userId]
    );
};

exports.searchProfileByUserId = (id: number): QueryResult => {
    return db.query(
        `SELECT id, name, surname, photoUrl, bio FROM users 
        WHERE id=$1;`,
        [id]
    );
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
    WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' 
    AND email = $1
    ORDER BY id DESC
    LIMIT 1 
    `;

    const param = [email];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                   Friendship TABLE
----------------------------------------------------------------*/

exports.getFriendship = (userId: number, viewId: number): QueryResult => {
    const q = `SELECT * FROM friendships
    WHERE (sender_id = $1 AND recipient_id=$2) OR
    (sender_id = $2 AND recipient_id=$1)     `;

    const param = [userId, viewId];
    return db.query(q, param);
};

exports.deleteFriendshipById = (
    userId: number,
    viewId: number
): QueryResult => {
    const q = `DELETE FROM friendships
    WHERE (sender_id = $1 AND recipient_id=$2) OR
    (sender_id = $2 AND recipient_id=$1) `;
    const param = [userId, viewId];
    return db.query(q, param);
};

exports.updateFriendshipById = (
    userId: number,
    viewId: number
): QueryResult => {
    const q = `UPDATE friendships *
    SET accepted = true
    WHERE (sender_id = $1 AND recipient_id=$2) OR
    (sender_id = $2 AND recipient_id=$1)       
    RETURNING id `;

    const param = [userId, viewId];
    return db.query(q, param);
};

exports.addFriendship = (userId: number, viewId: number): QueryResult => {
    const q = `INSERT INTO friendships (sender_id, recipient_id, accepted)
    VALUES ($1,$2, false)   
    RETURNING id `;

    const param = [userId, viewId];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                  JOIN  USER & FRIENDSHIP TABLE
----------------------------------------------------------------*/

exports.searchFriendshipByUserId = (userId: number): QueryResult => {
    const q = `SELECT users.id, name, surname, photourl, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND recipient_id = users.id) `;

    const param = [userId];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                    message TABLE
----------------------------------------------------------------*/

module.exports.newGeneralMsg = (
    senderId: number,
    message: string
): QueryResult<UserBasicInfo> => {
    const q = `INSERT INTO message_general (sender, message)
    VALUES ($1, $2 ) RETURNING * `;

    const param = [senderId, message];
    return db.query(q, param);
};

module.exports.getLastMsgGeneralMsg = (
    senderId: number,
    message: string
): QueryResult<UserBasicInfo> => {
    const q = `SELECT * FROM message_general
    ORDER DEC BY  send_at
    LIMIT 5`;

    const param = [senderId, message];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                  WALL POST TABLE
----------------------------------------------------------------*/
exports.addPost = (
    walluser_id: number,
    writer_id: number,
    post: string
): QueryResult => {
    const q = `INSERT INTO wall_posts (walluser_id, writer_id, post)
    VALUES ($1,$2, $3)   
    RETURNING * `;

    const param = [walluser_id, writer_id, post];
    return db.query(q, param);
};

exports.searchPostByUserId = (userId: number): QueryResult => {
    const q = `SELECT id FROM wall_posts
        WHERE walluser_id = $1 OR
        writer_id = $1
        ORDER BY wall_posts.created_at DESC
        LIMIT 5 `;

    const param = [userId];
    return db.query(q, param);
};

// exports.searchPostByPostId = (userId: number): QueryResult => {
//     const q = `SELECT walluser.name AS walluser_name , walluser.surname AS walluser_surname,wallwriter.name AS wallwriter_name, wallwriter.surname AS wallwriter_surname, wall_posts.walluser_id, wall_posts.writer_id, wall_posts.id, wall_posts.post, wall_posts.created_at
//                 FROM wall_posts
//                 INNER JOIN users AS walluser
//                 ON walluser_id=walluser.id
//                 INNER JOIN users AS wallwriter
//                 ON wall_posts.writer_id=wallwriter.id
//                 WHERE wall_posts.id = $1
//                 ORDER BY wall_posts.created_at DESC
//                 LIMIT 5`;

//     const param = [userId];
//     return db.query(q, param);
// };

exports.getPostByPostId = (userId: number): QueryResult => {
    const q = `SELECT walluser.name AS walluser_name , walluser.surname AS walluser_surname,wallwriter.name AS wallwriter_name, wallwriter.surname AS wallwriter_surname, wall_posts.walluser_id, wall_posts.writer_id, wall_posts.id, wall_posts.post, wall_posts.created_at 
                FROM wall_posts
                INNER JOIN users AS walluser 
                ON walluser_id=walluser.id 
                INNER JOIN users AS wallwriter 
                ON wall_posts.writer_id=wallwriter.id 
                WHERE wall_posts.id = $1
                `;

    const param = [userId];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                  COMMENTS POST TABLE
----------------------------------------------------------------*/
exports.addComment = (
    post_id: number,
    writer_id: number,
    comment: string
): QueryResult => {
    const q = `INSERT INTO wall_posts (post_id, writer_id, comment)
    VALUES ($1,$2, $3)   
    RETURNING * `;

    const param = [post_id, writer_id, comment];
    return db.query(q, param);
};

// exports.searchPostByPostId = (userId: number): QueryResult => {
//     const q = `SELECT walluser.name AS walluser_name , walluser.surname AS walluser_surname,wallwriter.name AS wallwriter_name, wallwriter.surname AS wallwriter_surname, wall_posts.walluser_id, wall_posts.writer_id, wall_posts.id, wall_posts.post, wall_posts.created_at
//                 FROM wall_posts
//                 INNER JOIN users AS walluser
//                 ON walluser_id=walluser.id
//                 INNER JOIN users AS wallwriter
//                 ON wall_posts.writer_id=wallwriter.id
//                 WHERE wall_posts.id = $1
//                 ORDER BY wall_posts.created_at DESC
//                 LIMIT 5`;

//     const param = [userId];
//     return db.query(q, param);
// };

/* For maintain a list of online Users
interface UserSockets {
    [key: number]: Array<string>;
}

const userSocket: UserSockets;
const onlineUsers = Object.keys(users);

Query:
SELECT * FROM WHERE id=ANY($1)
$1 being an array of ids */
