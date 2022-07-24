"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var path_1 = __importDefault(require("path"));
// This is a hack to make Multer available in the Express namespace
var multer_1 = __importDefault(require("multer"));
// import uidSafe from "uid-safe";
var uidSafe = require("uid-safe");
var s3 = require("./s3");
var _a = require("./process"), verifyingEmptyInputs = _a.verifyingEmptyInputs, registerNewUser = _a.registerNewUser, logInVerify = _a.logInVerify, noEmptyInputsValid = _a.noEmptyInputsValid, foundEmail = _a.foundEmail, setNewPassword = _a.setNewPassword, saveProfileImage = _a.saveProfileImage, getUserInfo = _a.getUserInfo, upDateBio = _a.upDateBio, searchForFiends = _a.searchForFiends, searchForProfile = _a.searchForProfile, searchFriendshipStatus = _a.searchFriendshipStatus, setFriendshipStatus = _a.setFriendshipStatus, addWallPost = _a.addWallPost, searchForTheNewestPosts = _a.searchForTheNewestPosts, getPostInfo = _a.getPostInfo, getFriends = _a.getFriends, getMessage = _a.getMessage, searchCommentsId = _a.searchCommentsId, getCommentInfo = _a.getCommentInfo, addCommentToPost = _a.addCommentToPost, addNewMessage = _a.addNewMessage;
var getInfoOnlineUsers = require("./db").getInfoOnlineUsers;
// @ts-ignore
var app = (0, express_1.default)();
var server = require("http").Server(app);
var io = require("socket.io")(server, {
    allowRequest: function (req, callback) {
        return callback(null, req.headers.referer.startsWith("http://localhost:3000"));
    },
});
// Bc we are deploying we need to define where to get the value.
var COOKIE_SECRET = process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;
app.use((0, compression_1.default)());
var cookieSessionMiddleware = (0, cookie_session_1.default)({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
});
/* Explanation of types:
Because the libraries are incompatible (the types) we need to tell them that the type is as the other.
We do this with precaution, is not recommended to do it if you are not 100% sure that they work together.
 */
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
app.get("/getFriends/", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get Friends", req.query);
    getFriends(req.query.from)
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
        // console.log(
        //     "searchForTheNewestPosts: In server what I am going to send to client:",
        //     posts
        // );
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
        // console.log("In server what I am going to send to client", post);
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
app.get("/getCommentsByPostId/", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get Comments:", req.query);
    // I need all the post Info, the likes, comments all.
    searchCommentsId(req.query.postId)
        .then(function (commentsId) {
        console.log("In server what I am going to send to client", commentsId);
        res.json({
            status: "Success",
            commentsId: commentsId,
        });
    })
        .catch(function (err) {
        res.json({
            status: "Error",
        });
    });
});
app.get("/getCommentInfo/", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t Get Comment Info:", req.query);
    // I need all the post Info, the likes, comments all.
    getCommentInfo(req.query.commentId)
        .then(function (commentInfo) {
        console.log("In server what I am going to send to client", commentInfo);
        res.json({
            status: "Success",
            commentInfo: commentInfo,
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
app.post("/newPost.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t New Post Status:", req.body);
    /* Req.body:
        - wallUserId
        - post
    */
    addWallPost(req.session.userId, req.body)
        .then(function (result) {
        console.log("result in wallPost.json", result);
        res.json({
            status: "Success",
            payload: result,
        });
    })
        .catch(function (err) {
        res.json({
            status: "Error",
        });
    });
});
app.post("/newComment.json", function (req, res) {
    console.log("-----------------------------------------------------------------------------\n\t New Comment Status:", req.body);
    addCommentToPost(req.session.userId, req.body)
        .then(function (result) {
        console.log("result in wallPost.json", result);
        res.json({
            status: "Success",
            payload: result,
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
// app.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });
// bc socket can't use an express server we need to have the listening to be done
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
// UsersOnlineInfo;
var userOnline = {};
io.on("connection", function (socket) {
    var _this = this;
    if (!socket.request.session.userId) {
        // Here I have to go through my userSocket and delete the connection.
        // userSocket[];
        return socket.disconnect(true);
    }
    var InfoOnlineUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var onlineUsers, resp, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onlineUsers = Object.keys(userOnline);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("listOnlineUsers", onlineUsers);
                    return [4 /*yield*/, getInfoOnlineUsers(onlineUsers)];
                case 2:
                    resp = _a.sent();
                    console.log("InfoOnlineUsers", resp.rows);
                    io.emit("online-users", resp.rows);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log("Error InfoOnlineUsers", err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var userId = socket.request.session.userId;
    console.log("User with the id: ".concat(userId, " and socket id ").concat(socket.id, " just connected."));
    /* ----------------------------------------------------
    Keeping Track Online Users
    -------------------------------------------------------*/
    socket.on("disconnect", function () {
        userOnline[userId].filter(function (eachSocket) {
            eachSocket != socket.id;
        });
        if (userOnline[userId]) {
            delete userOnline[userId];
        }
        // Notify the disconnection.
        InfoOnlineUsers();
    });
    if (userOnline[userId]) {
        // There is already the key.
        userOnline[userId].push(socket.id);
    }
    else {
        // Fist Time connecting.
        userOnline[userId] = [socket.id];
    }
    InfoOnlineUsers();
    console.log("Mi list of connection", userOnline);
    /* ----------------------------------------------------
                    Chat
    -------------------------------------------------------*/
    socket.on("chat-newest-message", function (userIdToChat) {
        console.log("BEFORE DB newest-privetMsg-chat", userIdToChat);
        getMessage(userId, userIdToChat).then(function (result) {
            console.log("IN newest-message-chat", result);
            if (result) {
                //I send it back to whom it asked.
                socket.emit("chat-newest-message", result);
            }
        });
    });
    socket.on("chat-new-message", function (newMsg) {
        console.log("New Message", newMsg);
        addNewMessage(userId, newMsg).then(function (result) {
            console.log("IN generalMsg-new-message", result);
            if (result) {
                // Here I have to see to whom send it.
                if (newMsg.receiver_id) {
                    //Send it to the specific one
                    userOnline[newMsg.receiver_id].map(function (eachSocket) {
                        io.to(eachSocket).emit("chat-new-message", result);
                    });
                    socket.emit("chat-new-message", result);
                }
                else {
                    //General to send
                    io.emit("chat-new-message", result);
                }
            }
        });
    });
});
