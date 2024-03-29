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

exports.getInfoOnlineUsers = (ids: Array<number>): QueryResult => {
    return db.query(
        `SELECT id, name, surname, photoUrl FROM users 
        WHERE id=ANY($1);`,
        [ids]
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
    const q = `INSERT INTO message_general (sender_id, message)
    VALUES ($1, $2 ) RETURNING id `;

    const param = [senderId, message];
    return db.query(q, param);
};

module.exports.getLastMsgGeneralMsg = (): QueryResult<UserBasicInfo> => {
    const q = `SELECT users.id AS user_id, users.name, users.surname, users.photourl, message_general.id ,message_general.message, message_general.send_at
                FROM message_general
                INNER JOIN users  
                ON users.id=message_general.sender_id
                ORDER BY message_general.send_at DESC
                LIMIT 5`;

    return db.query(q, []);
};

module.exports.getMessageGeneralMsgById = (
    msgId: number
): QueryResult<UserBasicInfo> => {
    const q = `SELECT users.id AS user_id, users.name, users.surname, users.photourl, message_general.id ,message_general.message, message_general.send_at
                FROM message_general
                INNER JOIN users  
                ON users.id=message_general.sender_id
                WHERE message_general.id=$1`;

    return db.query(q, [msgId]);
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
    RETURNING id AS post_id `;

    const param = [walluser_id, writer_id, post];
    return db.query(q, param);
};

exports.searchPostByUserId = (userId: number): QueryResult => {
    const q = `SELECT id AS post_id FROM wall_posts
        WHERE walluser_id = $1 OR
        writer_id = $1
        ORDER BY wall_posts.created_at DESC
        LIMIT 5 `;

    const param = [userId];
    return db.query(q, param);
};

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
    const q = `INSERT INTO wall_comments (post_id, writer_id, comment)
    VALUES ($1,$2, $3)   
    RETURNING  wall_comments.id AS comment_id, wall_comments.post_id `;

    const param = [post_id, writer_id, comment];
    return db.query(q, param);
};

exports.searchCommentsByPostId = (postId: number): QueryResult => {
    const q = `SELECT id AS comment_id,  post_id  FROM wall_comments
        WHERE post_id = $1 
        ORDER BY wall_comments.created_at DESC
        LIMIT 3 `;

    const param = [postId];
    return db.query(q, param);
};

exports.getCommentById = (commentId: number): QueryResult => {
    const q = `SELECT users.name, users.surname, wall_comments.id AS comment_id, wall_comments.post_id,  wall_comments.comment, wall_comments.created_at 
    FROM wall_comments
    INNER JOIN users
    ON wall_comments.writer_id = users.id
    WHERE wall_comments.id = $1 `;

    const param = [commentId];
    return db.query(q, param);
};

/* ---------------------------------------------------------------
                  PRIVATE MESSAGE TABLE
----------------------------------------------------------------*/

exports.getPrivateMsgByUsersId = (sender_id: number, receiver_id: number) => {
    const q = `SELECT senderUser.name AS name, senderUser.surname AS surname, senderUser.photourl,
	 senderUser.id AS sender_id, message_private.receiver_id,message_private.id, message_private.message, message_private.send_at
                FROM message_private
                INNER JOIN users AS senderUser
                ON message_private.sender_id=senderUser.id
                WHERE (message_private.sender_id = $1 AND message_private.receiver_id = $2)
				OR (message_private.sender_id = $2 AND message_private.receiver_id = $1)
                ORDER BY message_private. send_at DESC
                LIMIT 5`;
    const param = [sender_id, receiver_id];
    return db.query(q, param);
};

exports.newPrivateMsg = (
    sender_id: number,
    receiver_id: number,
    message: string
): QueryResult => {
    const q = `INSERT INTO message_private(sender_id, receiver_id,message)
    VALUES ($1, $2, $3 )
    RETURNING id`;

    const param = [sender_id, receiver_id, message];
    return db.query(q, param);
};

exports.getPrivateMsgById = (id: number) => {
    const q = `SELECT senderUser.name AS name, senderUser.surname AS surname, senderUser.photourl,
	 senderUser.id AS sender_id, message_private.receiver_id, message_private.id, message_private.message, message_private.send_at
                FROM message_private
                INNER JOIN users AS senderUser
                ON message_private.sender_id=senderUser.id
                WHERE message_private.id = $1 `;
    const param = [id];
    return db.query(q, param);
};

/* 
SELECT users.name, users.surname, wall_comments.comment, wall_comments.created_at 
                FROM wall_comments
                INNER JOIN users  
                ON users_id=writer_id
               WHERE wall_posts.id = $1
                ORDER BY wall_posts.created_at DESC
                LIMIT 5`



                INSERT INTO message_private(sender_id, receiver_id,message)
    VALUES (152, 1,'Como anda este chat no?' );

*/

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
