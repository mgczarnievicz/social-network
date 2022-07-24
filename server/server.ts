import express, { Express, Request, NextFunction, Response } from "express";
import compression from "compression";
import cookieSession from "cookie-session";
import path from "path";

// This is a hack to make Multer available in the Express namespace
import multer, { FileFilterCallback, Multer } from "multer";

import { QueryResult } from "pg"; //This bc I need the type there.
import { read } from "fs";

// import uidSafe from "uid-safe";
const uidSafe = require("uid-safe");
const s3 = require("./s3");

// Importing the Type of data
import {
    NewUserRegistration,
    LogInUser,
    UserBasicInfo,
    FriendShipResponds,
} from "./typesServer";

const {
    verifyingEmptyInputs,
    registerNewUser,
    logInVerify,
    noEmptyInputsValid,
    foundEmail,
    setNewPassword,
    saveProfileImage,
    getUserInfo,
    upDateBio,
    searchForFiends,
    searchForProfile,
    searchFriendshipStatus,
    setFriendshipStatus,
    addWallPost,
    searchForTheNewestPosts,
    getPostInfo,
    getFriends,
    getNewestChatMsg,
    addNewMessageGeneralChat,
    searchCommentsId,
    getCommentInfo,
    addCommentToPost,
} = require("./process");

import { createServer } from "http";
import { Server, Socket } from "socket.io";
// @ts-ignore
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req: Request, callback: Function) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
});

/* Explanation of types:
Because the libraries are incompatible (the types) we need to tell them that the type is as the other.
We do this with precaution, is not recommended to do it if you are not 100% sure that they work together.
 */
io.use((socket: Socket, next: NextFunction) => {
    cookieSessionMiddleware(
        socket.request as Request,
        (socket.request as Request).res,
        next
    );
});

app.use(cookieSessionMiddleware);

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const storage = multer.diskStorage({
    destination(req, file: Express.Multer.File, callback: DestinationCallback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file: Express.Multer.File, callback: FileNameCallback) {
        uidSafe(24).then((randomString: string) => {
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097155,
    },
});

// For Protection propose
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

// If we deploy. FIXME startWith gives error "lib": ["es2015"]
// if (process.env.NODE_ENV == "production") {
//     app.use((req, res, next) => {
//         if (req.headers["x-forwarded-proto"].startsWith("https")) {
//             return next();
//         }
//         res.redirect(`https://${req.hostname}${req.url}`);
//     });
// }

// app.use(bodyParser.json());
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("req.body:", req.body);
    console.log("---------------------");
    next();
});

/* -----------------------------------------------------------------------------------------------------
                    GET
------------------------------------------------------------------------------------------------------*/

app.get("/user/id.json", function (req, res) {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get User Id`
    );
    res.json({
        userId: req.session && req.session.userId,
    });
});

app.get("/logout.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Log out`
    );
    req.session = null;
    res.json({
        status: "Success",
    });
});

app.get("/getUserInfo.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get User Info`
    );
    getUserInfo(req.session.userId).then((data: {}) => {
        console.log("Data from getUserInfo", data);
        res.json({
            status: "Success",
            payload: data,
        });
    });
});

app.get("/getFriends/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get Friends`,
        req.query
    );
    getFriends(req.query.from)
        .then((data: []) => {
            res.json({
                status: "Success",
                payload: data,
            });
        })
        .catch((err: QueryResult) => {
            console.log("Error in /getFriends.json:", err);
            res.json({
                status: "Error",
            });
        });
});

app.get("/searchFriend/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Search Friend:`,
        req.query
    );

    searchForFiends(req.query.search, req.session.userId)
        .then((friends: []) => {
            res.json({
                status: "Success",
                friends,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

app.get("/api/profile/:id", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Profile id:`,
        req.params.id
    );

    if (req.params.id == req.session.userId) {
        console.log("I am Equal, I am calling myself");
        res.json({
            status: "Equal",
        });
    } else {
        // I search in my db and send it back.
        searchForProfile(req.params.id)
            .then((result: {}) => {
                res.json(result);
            })
            .catch((err: QueryResult) =>
                res.json({
                    status: "Error",
                })
            );
    }
});

app.get("/api/friendshipStatus/:viewUser", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Friendship Status viewUser:`,
        req.params.viewUser
    );
    searchFriendshipStatus(req.session.userId, req.params.viewUser)
        .then((data: FriendShipResponds) => {
            console.log("data from process", data);
            res.json({
                status: "Success",
                data,
            });
        })
        .catch((err: QueryResult) =>
            res.json({
                status: "Error",
            })
        );
});

app.get("/getWallPost/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get WALL Post:`,
        req.query
    );

    // I Just need the post Id
    searchForTheNewestPosts(req.query.from, req.session.userId)
        .then((posts: []) => {
            // console.log(
            //     "searchForTheNewestPosts: In server what I am going to send to client:",
            //     posts
            // );
            res.json({
                status: "Success",
                posts,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

app.get("/getPost/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get Post:`,
        req.query
    );
    // I need all the post Info, the likes, comments all.
    getPostInfo(req.query.postId, req.session.userId)
        .then((post: {}) => {
            // console.log("In server what I am going to send to client", post);
            res.json({
                status: "Success",
                post,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

app.get("/getCommentsByPostId/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get Comments:`,
        req.query
    );
    // I need all the post Info, the likes, comments all.
    searchCommentsId(req.query.postId)
        .then((commentsId: []) => {
            console.log(
                "In server what I am going to send to client",
                commentsId
            );
            res.json({
                status: "Success",
                commentsId,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

app.get("/getCommentInfo/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get Comment Info:`,
        req.query
    );
    // I need all the post Info, the likes, comments all.
    getCommentInfo(req.query.commentId)
        .then((commentInfo: {}) => {
            console.log(
                "In server what I am going to send to client",
                commentInfo
            );
            res.json({
                status: "Success",
                commentInfo,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

/* -----------------------------------------------------------------------------------------------------
                            POST
------------------------------------------------------------------------------------------------------*/
app.post("/registration.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Registration:`,
        req.body
    );
    // Verify the empty Strings!   Empty inputs are not valid"
    if (!noEmptyInputsValid(req.body)) {
        console.log("/registration.json found empty string!");
        res.json({
            status: "Error",
        });
    } else {
        /* FIXME! see why when I already have a user the error enter in the then. 
        Response: 
            - db Error
            - UserBasicInfo when success
        */
        registerNewUser(req.body)
            .then((currentUser: UserBasicInfo) => {
                console.log("currentUser:", currentUser);
                if (req.session) req.session.userId = currentUser.id;
                res.json({
                    status: "Success",
                });
            })
            .catch((err: QueryResult) => {
                res.json({
                    status: "Error",
                });
            });
    }
});

app.post("/login.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Log In:`,
        req.body
    );

    if (!noEmptyInputsValid(req.body)) {
        console.log("/login found empty string!");
        res.json({
            status: "Error",
        });
    } else {
        logInVerify(req.body)
            .then((userLogIn: string | UserBasicInfo) => {
                console.log("logInVerify Response, userLogIn:", userLogIn);
                if (typeof userLogIn === "string") {
                    res.json({
                        status: "Error",
                    });
                } else {
                    console.log("userLogIn not a string");
                    if (req.session) req.session.userId = userLogIn.id;
                    res.json({
                        status: "Success",
                    });
                }
            })
            .catch((err: QueryResult) => {
                console.log("Error in log In", err);
                res.json({
                    status: "Error",
                });
            });
    }
});

app.post("/resetPassword/sendEmail.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Res Pass: Send Email:`,
        req.body
    );

    if (req.body.email.trim().length === 0) {
        console.log("No email was enter");
        res.json({
            status: "Error",
        });
    }

    foundEmail(req.body.email.trim())
        .then((result: boolean) => {
            console.log("found email result", result);
            if (result) {
                console.log("found email is true?!");
                res.json({
                    status: "Success",
                });
            } else {
                res.json({
                    status: "Error",
                });
            }
        })
        .catch((err: QueryResult) => {
            console.log("Error in log In", err);
            res.json({
                status: "Error",
            });
        });
});

app.post("/resetPassword/setNewPassword.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Reset Pass: Set New Pass:`,
        req.body
    );

    /*
    search in the db if the code is still valid and compare, if its the same update the password.
     */
    // FIXME! must validate the code and pass is not empty! see error in the functions already made.

    if (!noEmptyInputsValid(req.body)) {
        console.log("/reset found empty string!");
        res.json({
            status: "Error",
        });
    } else {
        setNewPassword(req.body)
            .then((result: boolean) => {
                console.log("Result in setNewPassword", result);
                if (result) {
                    res.json({
                        status: "Success",
                    });
                } else {
                    res.json({
                        status: "Error",
                    });
                }
            })
            .catch(() =>
                res.json({
                    status: "Error",
                })
            );
    }
});

// uploader.single("image") image is the name of the input filed.
app.post("/upload.json", uploader.single("image"), s3.upload, (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t UpLoading Image`
    );

    /* NOTE: 
    Upload the image in AWS and then, ones we know that is uploaded we save it in our date base
     with the url to be able to display it later. */

    // If I use the other credentials
    const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
    // const url = `https://imageboard-cy.s3.eu-central-1.amazonaws.com/${req.file.filename}`;

    // we need to generate the url of the image.
    // https://s3.amazonaws.com/:yourBucketName/:filename
    // https://:yourBucketName.s3.eu-central-1.amazonaws.com/:filename.

    console.log(`\t url: ${url}`);
    const userId = req.session.userId;
    saveProfileImage(userId, url)
        .then((result: string) => {
            console.log("result form database", result);
            res.json({
                status: "Success",
                photourl: result,
            });
        })
        .catch((err: boolean) =>
            res.json({
                status: "Error",
            })
        );
});

app.post("/setBioInfo.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Set Bio Info:`,
        req.body
    );

    upDateBio(req.session.userId, req.body.data)
        .then((bio: Array<string>) => {
            console.log("Respond from process:", bio);

            res.json({
                status: "Success",
                bio,
            });
        })
        .catch(() =>
            res.json({
                status: "Error",
            })
        );
});

app.post("/api/setFriendshipStatus", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Set FriendShip Status:`,
        req.body
    );
    setFriendshipStatus(req.session.userId, req.body)
        .then((data: FriendShipResponds | string) => {
            console.log("data from process", data);
            if (data == "Error") {
                res.json({
                    status: "Error",
                });
            } else {
                res.json({
                    status: "Success",
                    data,
                });
            }
        })
        .catch((err: QueryResult) =>
            res.json({
                status: "Error",
            })
        );
});

app.post("/newPost.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t New Post Status:`,
        req.body
    );
    /* Req.body:
        - wallUserId
        - post
    */

    addWallPost(req.session.userId, req.body)
        .then((result: QueryResult) => {
            console.log("result in wallPost.json", result);
            res.json({
                status: "Success",
                payload: result,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

app.post("/newComment.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t New Comment Status:`,
        req.body
    );
    addCommentToPost(req.session.userId, req.body)
        .then((result: {}) => {
            console.log("result in wallPost.json", result);
            res.json({
                status: "Success",
                payload: result,
            });
        })
        .catch((err: QueryResult) => {
            res.json({
                status: "Error",
            });
        });
});

/* ---------------------------------------------------------------------------------------
                                        THE END
-------------------------------------------------------------------------------------------*/

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// app.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });
// bc socket can't use an express server we need to have the listening to be done
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

/* -------------------------------------------------------------------------------
                                    SOCKET 
---------------------------------------------------------------------------------*/

/*  Explanation of the types:
because our middleware we know that the socket have a request, and this request knows from above that it will have a 
cookie session, so we need to tell that the request from socket is the type of Request (Express) (SocketWithSession)
*/
interface SocketWithSession extends Socket {
    request: Request;
}

/* For maintain a list of online Users */
interface UserSockets {
    [key: number]: Array<string>;
}

const userSocket: UserSockets = {};
const onlineUsers = Object.keys(userSocket);

io.on("connection", function (socket: SocketWithSession) {
    if (!socket.request.session.userId) {
        // Here I have to go through my userSocket and delete the connection.
        // userSocket[];
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    console.log(
        `User with the id: ${userId} and socket id ${socket.id} just connected.`
    );
    console.log("Mi list of connection", userSocket);

    if (userSocket[userId]) {
        // There is already the key.
        userSocket[userId].push(socket.id);
    } else {
        // Fist Time connecting.
        userSocket[userId] = [socket.id];
    }

    /* ----------------------------------------------------
                    General Chat
    -------------------------------------------------------*/

    socket.on("newest-generalMsg-chat", (mes: string) => {
        getNewestChatMsg().then((result: Array<{}> | boolean) => {
            console.log("IN newest-generalMsg-chat", result);
            if (result != false) {
                socket.emit("newest-generalMsg-chat", result);
            }
        });
    });

    socket.on("generalMsg-new-message", (newMsg: string) => {
        console.log("New Message", newMsg);
        addNewMessageGeneralChat(userId, newMsg).then(
            (result: {} | boolean) => {
                console.log("IN generalMsg-new-message", result);
                if (result != false) {
                    io.emit("generalMsg-new-message", result);
                }
            }
        );

        /*
        1. we want to know who send the message
        2. we need to add this msg to the chats table.
        3. we want to retrieved user information about the author.
        4. compose a message object that contains user info and message
        5. send back to all connect socket, that there is a new message
        */
    });
});
