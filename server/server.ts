import express, { Express, Request, NextFunction } from "express";
import compression from "compression";
import cookieSession from "cookie-session";
import path from "path";
import {
    CookieSessionRequest,
    CookieSessionObject,
} from "@types/cookie-session";
// import http from "http";

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
    searchForPost,
    getFriends,
} = require("./process");

// @ts-ignore
const app = express();
// REVIEW: this! I can only have import!
// const server = http.Server(app);
// const io = require ("socket.io")(server, {allowRequest:(req, callback)=>callback(null, req.header.refer.startsWith("http://localhost:300"))})
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req: Request, callback: Function) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
// REVIEW. Merle like this suggest doc
// import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Request } from "aws-sdk";

// const httpServer = createServer();
// const io = new Server(httpServer, {
//  allowRequest: (req, callback) =>
//     callback(null, req.headers.referer.startsWith("http://localhost:3000")),
// });

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
});

// io.use((socket: Socket, next: NextFunction) => {
//     cookieSessionMiddleware(socket.request, socket.request.res, next);
// });

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

app.get("/getFriends.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get Friends`
    );
    getFriends(req.session.userId)
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

app.get("/getPost/", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Get Post:`,
        req.query
    );

    searchForPost(req.query.search, req.session.userId)
        .then((posts: []) => {
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

app.post("/wallPost.json", (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t Wall Post Status:`,
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

// bc socket can't use an express server we need to have the listening to be done
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

/* -------------------------------------------------------------------------------
                                    SOCKET 
---------------------------------------------------------------------------------*/

io.on("connection", function (socket: Socket) {
    let cookieString = socket.request.headers.cookie;

    type SessionType = CookieSessionObject | null | undefined;
    let req = {
        connection: { encrypted: false },
        headers: { cookie: cookieString },
        session: {},
    };
    let res = { getHeader: () => {}, setHeader: () => {} };
    //
    cookieSessionMiddleware(req, res, () => {
        console.log(req.session);
    });

    // if (!socket.request.session.userId) {
    //     return socket.disconnect(true);
    // }
    // const userId = socket.request.session.userId;
    // console.log(
    //     `User with the id: ${userId} and socket id ${socket.id} just connected.`
    // );

    socket.emit("last-10-messages", {
        messages: ["some stuff", "Locket"],
    });
    socket.on("new-message", (newMsg: string) => {
        console.log("New Message", newMsg);
        /*
        1. we want to know who send the message
        2. we need to add this msg to the chats table.
        3. we want to retrieved user information about the author.
        4. compose a message object that contains user info and message
        5. send back to all connect socket, that there is a new message
        */
    });
});
