"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var path_1 = __importDefault(require("path"));
// import {
//     CookieSessionRequest,
//     CookieSessionObject,
// } from "@types/cookie-session";
// import http from "http";
// This is a hack to make Multer available in the Express namespace
var multer_1 = __importDefault(require("multer"));
// import uidSafe from "uid-safe";
var uidSafe = require("uid-safe");
var s3 = require("./s3");
var _a = require("./process"), verifyingEmptyInputs = _a.verifyingEmptyInputs, registerNewUser = _a.registerNewUser, logInVerify = _a.logInVerify, noEmptyInputsValid = _a.noEmptyInputsValid, foundEmail = _a.foundEmail, setNewPassword = _a.setNewPassword, saveProfileImage = _a.saveProfileImage, getUserInfo = _a.getUserInfo, upDateBio = _a.upDateBio, searchForFiends = _a.searchForFiends, searchForProfile = _a.searchForProfile, searchFriendshipStatus = _a.searchFriendshipStatus, setFriendshipStatus = _a.setFriendshipStatus, addWallPost = _a.addWallPost, searchForTheNewestPosts = _a.searchForTheNewestPosts, getPostInfo = _a.getPostInfo, getFriends = _a.getFriends;
// @ts-ignore
var app = (0, express_1.default)();
// REVIEW: this! I can only have import!
// const server = http.Server(app);
// const io = require ("socket.io")(server, {allowRequest:(req, callback)=>callback(null, req.header.refer.startsWith("http://localhost:300"))})
var server = require("http").Server(app);
var io = require("socket.io")(server, {
    allowRequest: function (req, callback) {
        return callback(null, req.headers.referer.startsWith("http://localhost:3000"));
    },
});
// import { Request } from "aws-sdk";
// const httpServer = createServer();
// const io = new Server(httpServer, {
//  allowRequest: (req, callback) =>
//     callback(null, req.headers.referer.startsWith("http://localhost:3000")),
// });
// Bc we are deploying we need to define where to get the value.
var COOKIE_SECRET = process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;
app.use((0, compression_1.default)());
var cookieSessionMiddleware = (0, cookie_session_1.default)({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
});
// io.use((socket: Socket, next: NextFunction) => {
//     cookieSessionMiddleware(socket.request, socket.request.res, next);
// });
app.use(cookieSessionMiddleware);
var storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path_1.default.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (randomString) {
            callback(null, "".concat(randomString).concat(path_1.default.extname(file.originalname)));
        });
    },
});
var uploader = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 2097155,
    },
});
// For Protection propose
app.use(function (req, res, next) {
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "client", "public")));
app.use(function (req, res, next) {
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
    console.log("-----------------------------------------------------------------------------\n\t Get User Id");
    res.json({
        userId: req.session && req.session.userId,
    });
});
app.get("/logout.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Log out");
    req.session = null;
    res.json({
        status: "Success",
    });
});
app.get("/getUserInfo.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get User Info");
    getUserInfo(req.session.userId).then(function (data) {
        console.log("Data from getUserInfo", data);
        res.json({
            status: "Success",
            payload: data,
        });
    });
});
app.get("/getFriends.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get Friends");
    getFriends(req.session.userId)
        .then(function (data) {
        res.json({
            status: "Success",
            payload: data,
        });
    })
        .catch(function (err) {
        console.log("Error in /getFriends.json:", err);
        res.json({
            status: "Error",
        });
    });
});
app.get("/searchFriend/", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Search Friend:", req.query);
    searchForFiends(req.query.search, req.session.userId)
        .then(function (friends) {
        res.json({
            status: "Success",
            friends: friends,
        });
    })
        .catch(function (err) {
        res.json({
            status: "Error",
        });
    });
});
app.get("/api/profile/:id", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Profile id:", req.params.id);
    if (req.params.id == req.session.userId) {
        console.log("I am Equal, I am calling myself");
        res.json({
            status: "Equal",
        });
    }
    else {
        // I search in my db and send it back.
        searchForProfile(req.params.id)
            .then(function (result) {
            res.json(result);
        })
            .catch(function (err) {
            return res.json({
                status: "Error",
            });
        });
    }
});
app.get("/api/friendshipStatus/:viewUser", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Friendship Status viewUser:", req.params.viewUser);
    searchFriendshipStatus(req.session.userId, req.params.viewUser)
        .then(function (data) {
        console.log("data from process", data);
        res.json({
            status: "Success",
            data: data,
        });
    })
        .catch(function (err) {
        return res.json({
            status: "Error",
        });
    });
});
app.get("/getWallPost/", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get WALL Post:", req.query);
    // I Just need the post Id
    searchForTheNewestPosts(req.query.from, req.session.userId)
        .then(function (posts) {
        console.log("searchForTheNewestPosts: In server what I am going to send to client:", posts);
        res.json({
            status: "Success",
            posts: posts,
        });
    })
        .catch(function (err) {
        res.json({
            status: "Error",
        });
    });
});
app.get("/getPost/", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get Post:", req.query);
    // I need all the post Info, the likes, comments all.
    getPostInfo(req.query.postId, req.session.userId)
        .then(function (post) {
        console.log("In server what I am going to send to client", post);
        res.json({
            status: "Success",
            post: post,
        });
    })
        .catch(function (err) {
        res.json({
            status: "Error",
        });
    });
});
/* -----------------------------------------------------------------------------------------------------
                            POST
------------------------------------------------------------------------------------------------------*/
app.post("/registration.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Registration:", req.body);
    // Verify the empty Strings!   Empty inputs are not valid"
    if (!noEmptyInputsValid(req.body)) {
        console.log("/registration.json found empty string!");
        res.json({
            status: "Error",
        });
    }
    else {
        /* FIXME! see why when I already have a user the error enter in the then.
        Response:
            - db Error
            - UserBasicInfo when success
        */
        registerNewUser(req.body)
            .then(function (currentUser) {
            console.log("currentUser:", currentUser);
            if (req.session)
                req.session.userId = currentUser.id;
            res.json({
                status: "Success",
            });
        })
            .catch(function (err) {
            res.json({
                status: "Error",
            });
        });
    }
});
app.post("/login.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Log In:", req.body);
    if (!noEmptyInputsValid(req.body)) {
        console.log("/login found empty string!");
        res.json({
            status: "Error",
        });
    }
    else {
        logInVerify(req.body)
            .then(function (userLogIn) {
            console.log("logInVerify Response, userLogIn:", userLogIn);
            if (typeof userLogIn === "string") {
                res.json({
                    status: "Error",
                });
            }
            else {
                console.log("userLogIn not a string");
                if (req.session)
                    req.session.userId = userLogIn.id;
                res.json({
                    status: "Success",
                });
            }
        })
            .catch(function (err) {
            console.log("Error in log In", err);
            res.json({
                status: "Error",
            });
        });
    }
});
app.post("/resetPassword/sendEmail.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Res Pass: Send Email:", req.body);
    if (req.body.email.trim().length === 0) {
        console.log("No email was enter");
        res.json({
            status: "Error",
        });
    }
    foundEmail(req.body.email.trim())
        .then(function (result) {
        console.log("found email result", result);
        if (result) {
            console.log("found email is true?!");
            res.json({
                status: "Success",
            });
        }
        else {
            res.json({
                status: "Error",
            });
        }
    })
        .catch(function (err) {
        console.log("Error in log In", err);
        res.json({
            status: "Error",
        });
    });
});
app.post("/resetPassword/setNewPassword.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Reset Pass: Set New Pass:", req.body);
    /*
    search in the db if the code is still valid and compare, if its the same update the password.
     */
    // FIXME! must validate the code and pass is not empty! see error in the functions already made.
    if (!noEmptyInputsValid(req.body)) {
        console.log("/reset found empty string!");
        res.json({
            status: "Error",
        });
    }
    else {
        setNewPassword(req.body)
            .then(function (result) {
            console.log("Result in setNewPassword", result);
            if (result) {
                res.json({
                    status: "Success",
                });
            }
            else {
                res.json({
                    status: "Error",
                });
            }
        })
            .catch(function () {
            return res.json({
                status: "Error",
            });
        });
    }
});
// uploader.single("image") image is the name of the input filed.
app.post("/upload.json", uploader.single("image"), s3.upload, function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t UpLoading Image");
    /* NOTE:
    Upload the image in AWS and then, ones we know that is uploaded we save it in our date base
     with the url to be able to display it later. */
    // If I use the other credentials
    var url = "https://s3.amazonaws.com/spicedling/".concat(req.file.filename);
    // const url = `https://imageboard-cy.s3.eu-central-1.amazonaws.com/${req.file.filename}`;
    // we need to generate the url of the image.
    // https://s3.amazonaws.com/:yourBucketName/:filename
    // https://:yourBucketName.s3.eu-central-1.amazonaws.com/:filename.
    console.log("\t url: ".concat(url));
    var userId = req.session.userId;
    saveProfileImage(userId, url)
        .then(function (result) {
        console.log("result form database", result);
        res.json({
            status: "Success",
            photourl: result,
        });
    })
        .catch(function (err) {
        return res.json({
            status: "Error",
        });
    });
});
app.post("/setBioInfo.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Set Bio Info:", req.body);
    upDateBio(req.session.userId, req.body.data)
        .then(function (bio) {
        console.log("Respond from process:", bio);
        res.json({
            status: "Success",
            bio: bio,
        });
    })
        .catch(function () {
        return res.json({
            status: "Error",
        });
    });
});
app.post("/api/setFriendshipStatus", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Set FriendShip Status:", req.body);
    setFriendshipStatus(req.session.userId, req.body)
        .then(function (data) {
        console.log("data from process", data);
        if (data == "Error") {
            res.json({
                status: "Error",
            });
        }
        else {
            res.json({
                status: "Success",
                data: data,
            });
        }
    })
        .catch(function (err) {
        return res.json({
            status: "Error",
        });
    });
});
app.post("/wallPost.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Wall Post Status:", req.body);
    /* Req.body:
        - wallUserId
        - post
    */
    addWallPost(req.session.userId, req.body)
        .then(function (result) {
        console.log("result in wallPost.json", result);
        res.json({
            status: "Success",
        });
    })
        .catch(function (err) {
        res.json({
            status: "Error",
        });
    });
});
/* ---------------------------------------------------------------------------------------
                                        THE END
-------------------------------------------------------------------------------------------*/
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "..", "client", "index.html"));
});
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
// bc socket can't use an express server we need to have the listening to be done
// server.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });
/* -------------------------------------------------------------------------------
                                    SOCKET
---------------------------------------------------------------------------------*/
io.on("connection", function (socket) {
    var cookieString = socket.request.headers.cookie;
    // type SessionType = CookieSessionObject | null | undefined;
    var req = {
        connection: { encrypted: false },
        headers: { cookie: cookieString },
        session: {},
    };
    var res = { getHeader: function () { }, setHeader: function () { } };
    //
    // cookieSessionMiddleware(req, res, () => {
    //     console.log(req.session);
    // });
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
    socket.on("new-message", function (newMsg) {
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
