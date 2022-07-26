"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var encryption = require("./encryption");
var crypto_random_string_1 = __importDefault(require("crypto-random-string"));
var _a = require("./db"), registerUser = _a.registerUser, getUserByEmail = _a.getUserByEmail, searchUserByEmail = _a.searchUserByEmail, updatePassword = _a.updatePassword, registerCode = _a.registerCode, searchCode = _a.searchCode, updateProfileImage = _a.updateProfileImage, getUserDataById = _a.getUserDataById, upDateBioByUserId = _a.upDateBioByUserId, getNewestUsers = _a.getNewestUsers, getMatchingFriends = _a.getMatchingFriends, searchProfileByUserId = _a.searchProfileByUserId, getFriendship = _a.getFriendship, updateFriendshipById = _a.updateFriendshipById, deleteFriendshipById = _a.deleteFriendshipById, addFriendship = _a.addFriendship, addPost = _a.addPost, searchFriendshipByUserId = _a.searchFriendshipByUserId, searchPostByUserId = _a.searchPostByUserId, getPostByPostId = _a.getPostByPostId, getLastMsgGeneralMsg = _a.getLastMsgGeneralMsg, newGeneralMsg = _a.newGeneralMsg, getMessageGeneralMsgById = _a.getMessageGeneralMsgById, searchCommentsByPostId = _a.searchCommentsByPostId, getCommentById = _a.getCommentById, addComment = _a.addComment, getPrivateMsgByUsersId = _a.getPrivateMsgByUsersId, newPrivateMsg = _a.newPrivateMsg, getPrivateMsgById = _a.getPrivateMsgById;
var sendEmail = require("./ses").sendEmail;
var DATE_OPTION = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};
/* -----------------------------------------------------------------------
                               GENERAL USE
-------------------------------------------------------------------------*/
function capitalizeFirstLetter(string) {
    string = string.replace(/\s\s+/g, " ").trim();
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function cleanEmptySpaces(obj) {
    var result = __assign({}, obj);
    Object.entries(obj).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        result[key] = value.replace(/\s\s+/g, " ").trim();
    });
    return result;
}
exports.noEmptyInputsValid = function (obj) {
    var returnObj = cleanEmptySpaces(obj);
    for (var key in returnObj) {
        if (returnObj[key].length === 0) {
            console.log("Found empty input!:");
            return false;
        }
    }
    return true;
};
/*
Verifying if there is something, it could have empty inputs
    false -> input with stuff.
    true -> input empty.
*/
// exports.verifyingIfThereIsInputs = (
//     obj: NewUserRegistration | LogInUser
// ): boolean => {
//     const returnObj = cleanEmptySpaces(obj);
//     for (let key in returnObj) {
//         if (returnObj[key as keyof typeof returnObj].length !== 0) {
//             console.log(
//                 "verifyingEmptyInputs: \nFound sth",
//                 returnObj[key as keyof typeof returnObj].trim()
//             );
//             return false;
//         }
//     }
//     return true;
// };
/* -----------------------------------------------------------------------
                       REGISTRATION & LOG IN SECTION
-------------------------------------------------------------------------*/
function encryptPassword(password) {
    return encryption
        .hash(password)
        .then(function (hashPass) { return hashPass; })
        .catch(function (hashErr) { return hashErr; });
}
/*
FIXME. see the types. I return an : QueryResult or the rows[]
Response:
    - db Error
    - UserBasicInfo when success
*/
exports.registerNewUser = function (newUser) {
    // First hash the pass.
    // then write in db.
    return encryption
        .hash(newUser.password)
        .then(function (hashPass) {
        var cleanNewUser = cleanEmptySpaces(newUser);
        return registerUser(capitalizeFirstLetter(cleanNewUser.name), capitalizeFirstLetter(cleanNewUser.surname), newUser.email.toLowerCase(), hashPass)
            .then(function (dbResult) { return dbResult.rows[0]; })
            .catch(function (err) {
            console.log("Error in registerUser", err);
            return false;
        });
    })
        .catch(function (hashErr) {
        console.log("Error in registerNewUser", hashErr);
        return false;
    });
};
/*
Response:
    - db Error
    - String: Error
    - UserBasicInfo when success
*/
exports.logInVerify = function (userLogIn) {
    userLogIn = cleanEmptySpaces(userLogIn);
    return getUserByEmail(userLogIn.email.toLowerCase())
        .catch(function (err) { return err; })
        .then(function (result) {
        // See what we recived and if there is a result, then se if its empty or not.
        if (result.rows.length === 0) {
            console.log("Email not register");
            return "Error";
        }
        return encryption
            .compare(userLogIn.password, result.rows[0].password)
            .catch(function (err) { return err; })
            .then(function (isCorrect) {
            if (isCorrect) {
                console.log("You Are In!");
                return result.rows[0];
            }
            else {
                return "Error";
            }
        });
    });
};
/* -----------------------------------------------------------------------
                        RESET PASSWORD SECTION
-------------------------------------------------------------------------*/
var RESET_PASS_SUBJECT = "HorseMan Reset Password";
var RESET_PASS_MESSAGE_GREETING = "Dear Costumer, \nWe send you the code, to be able to reset your password. Remember this is only valid for the next 8 minutes. After this you will need to require a new one.\n\t";
var RESET_PASS_MESSAGE = "\nThank you for using our services.\nHorseMan group.";
function setCodeAndSendEmail(email) {
    var secretCode = (0, crypto_random_string_1.default)({
        length: 10,
        type: "base64",
    });
    return registerCode(email, secretCode)
        .then(function () {
        // (recipient: string, message: string, subject: string)
        return sendEmail(email, RESET_PASS_MESSAGE_GREETING + secretCode + RESET_PASS_MESSAGE, RESET_PASS_SUBJECT).then(function (mailResult) {
            console.log("mailResult", mailResult);
            return true;
        });
    })
        .catch(function () { return false; });
}
exports.foundEmail = function (email) {
    return searchUserByEmail(email)
        .then(function (result) {
        console.log("result.rows", result.rows);
        if (result.rows[0].id) {
            console.log("result.rows[0].id", result.rows[0].id);
            return setCodeAndSendEmail(email);
        }
        return false;
    })
        .catch(function (err) { return false; });
};
exports.setNewPassword = function (userInput) {
    // Search for email in dataBase in reset Password.
    // Compare code.
    // if codes are the same then hash the new password and save it in db.
    return searchCode(userInput.email)
        .then(function (result) {
        console.log("search code result", result.rows);
        if (result.rows[0].code === userInput.code) {
            console.log("The codes are the same. I can hash and save the new Pass.");
            return encryptPassword(userInput.newPassword).then(function (hash) {
                console.log("encryptPassword result:", hash);
                return updatePassword(userInput.email, hash)
                    .then(function () { return true; })
                    .catch(function () { return false; });
            });
        }
        return false;
    })
        .catch(function (err) { return false; });
};
/* -----------------------------------------------------------------------
                     PROFILE EDIT & UPDATE SECTION
-------------------------------------------------------------------------*/
exports.saveProfileImage = function (userId, url) {
    return updateProfileImage(userId, url)
        .then(function (result) {
        console.log("Save img result.rows[0]", result.rows[0]);
        return result.rows[0].photourl;
    })
        .catch(function (err) {
        console.log("Error Updating the url", err);
        return false;
    });
};
exports.getUserInfo = function (userId) {
    console.log("Process GetUser Info id", userId);
    return getUserDataById(userId)
        .then(function (result) {
        var _a = result.rows[0], password = _a.password, email = _a.email, userInfo = __rest(_a, ["password", "email"]);
        userInfo.bio = userInfo.bio.split("\n");
        return userInfo;
    })
        .catch(function (err) {
        console.log("Error in getUserInfo", err);
        return false;
    });
};
exports.upDateBio = function (userId, newBio) {
    /*  We want to save the array of bios, each element is separate by the enter of the user   */
    return upDateBioByUserId(userId, newBio)
        .then(function (result) {
        console.log("Query result", result.rows[0]);
        var bioArray = result.rows[0].bio.split("\n");
        console.log("bioArray", bioArray);
        return bioArray;
    })
        .catch(function (err) { return err; });
};
/* -----------------------------------------------------------------------
                                FRIEND SECTION
-------------------------------------------------------------------------*/
function searchForFiendsThatStartWith(nameToSearch, userId) {
    console.log("nameToSearch in searchForFriend", nameToSearch);
    return getMatchingFriends(nameToSearch, userId)
        .then(function (result) {
        console.log("result.rows", result.rows);
        return result.rows;
    })
        .catch(function (err) {
        err;
    });
}
function searchNewestFiends(userId) {
    return getNewestUsers(userId)
        .then(function (result) {
        console.log("result.rows", result.rows);
        return result.rows;
    })
        .catch(function (err) {
        err;
    });
}
exports.searchForFiends = function (nameToSearch, userId) {
    console.log("nameToSearch in searchForFriend", nameToSearch);
    if (nameToSearch !== "") {
        // Here search in db the value of input
        return searchForFiendsThatStartWith(nameToSearch, userId);
    }
    else {
        // Send the last 15 friends.
        return searchNewestFiends(userId);
    }
};
exports.searchForProfile = function (id) {
    return searchProfileByUserId(id)
        .then(function (result) {
        console.log("result.rows", result.rows);
        if (result.rows.length === 0) {
            // No match found
            return { status: "Not Found" };
        }
        else {
            console.log("Found Profile.");
            return { status: "Success", profile: result.rows[0] };
        }
    })
        .catch(function (err) { return err; });
};
exports.searchFriendshipStatus = function (userId, viewId) {
    console.log("searchFriendshipStatus: userId: ".concat(userId, ", viewId ").concat(viewId));
    return getFriendship(userId, viewId)
        .then(function (result) {
        console.log("DB response getFriendship:", result.rows);
        if (result.rows.length === 0) {
            // They are not Friends!
            return {
                button: "Add Friend",
                viewUserId: viewId,
            };
        }
        else {
            var friendship = result.rows[0];
            if (friendship.accepted) {
                // We are fiends!
                return {
                    button: "Unfriend",
                    viewUserId: viewId,
                };
            }
            else {
                // We are in the pending state!
                if (friendship.sender_id == userId) {
                    // I am the sender of the request. So I can cancel the request.
                    return {
                        button: "Cancel Request",
                        viewUserId: viewId,
                    };
                }
                else {
                    // If I am the recipient, I can only Accept Friend.
                    return {
                        button: "Accept Friend",
                        viewUserId: viewId,
                    };
                }
            }
        }
    })
        .catch(function (err) {
        err;
    });
};
function deleteFriendship(userId, viewId) {
    return deleteFriendshipById(userId, viewId)
        .then(function (res) {
        return {
            button: "Add Friend",
            viewUserId: viewId,
        };
    })
        .catch(function (err) {
        console.log("Error Delete Friendship", err);
        return "Error";
    });
}
function acceptFriendship(userId, viewId) {
    return updateFriendshipById(userId, viewId)
        .then(function (result) {
        console.log("result from updateFriendship", result.rows);
        return { button: "Unfriend", viewUserId: viewId };
    })
        .catch(function (err) {
        console.log("Error acceptFriendShip", err);
        return "Error";
    });
}
function newFriendship(userId, viewId) {
    console.log("NewFriendshipValues");
    console.log("userId:", userId, "viewId:", viewId);
    return addFriendship(userId, viewId)
        .then(function (result) {
        console.log("add Friendship result:", result.rows);
        return {
            button: "Cancel Request",
            viewUserId: viewId,
        };
    })
        .catch(function (err) {
        console.log("Error newFriendship", err);
        return "Error";
    });
}
exports.setFriendshipStatus = function (userId, actualStatus) {
    console.log("actualStatus", actualStatus);
    switch (actualStatus.button) {
        case "Add Friend":
            // Add to DB.
            return newFriendship(userId, actualStatus.viewUserId);
            break;
        case "Unfriend":
        case "Delete Request":
        case "Cancel Request":
            // Delete from DB.
            return deleteFriendship(userId, actualStatus.viewUserId);
            break;
        case "Accept Friend":
            // Update DB.
            return acceptFriendship(userId, actualStatus.viewUserId);
            break;
        default:
            return "Error";
            break;
    }
};
exports.getFriends = function (userId) {
    console.log("getFriends userId to search", userId);
    return searchFriendshipByUserId(userId)
        .then(function (result) {
        console.log("SearchFriendshipBy Id result", result.rows);
        return result.rows;
    })
        .catch(function (err) {
        console.log("Error in search Friendship By User ID", err);
        return [];
    });
};
/* -----------------------------------------------------------------------------
                        SOCKET SECTION
-------------------------------------------------------------------------------*/
var getNewestChatGeneral = function () {
    return getLastMsgGeneralMsg()
        .then(function (result) {
        console.log("getLastMsgGeneralMsg result", result.rows);
        result.rows.map(function (each) {
            return (each.send_at = each.send_at.toLocaleString("en-GB", DATE_OPTION));
        });
        return result.rows;
    })
        .catch(function (err) { return false; });
};
var getPrivateMessage = function (userId, userIdToChat) {
    console.log("in getPrivateMessage ", userId, userIdToChat);
    return getPrivateMsgByUsersId(userId, userIdToChat)
        .then(function (result) {
        console.log("getPrivateMessage result", result.rows);
        result.rows.map(function (each) {
            return (each.send_at = each.send_at.toLocaleString("en-GB", DATE_OPTION));
        });
        return result.rows;
    })
        .catch(function (err) {
        console.log("Error in DB getPrivateMessage", err);
        return false;
    });
};
exports.getMessage = function (userId, userIdToChat) {
    if (userIdToChat) {
        // Private Messages
        console.log("Private Message", userIdToChat);
        return getPrivateMessage(userId, userIdToChat);
    }
    else {
        //General Messages
        console.log("General Message");
        return getNewestChatGeneral();
    }
};
var addNewMessageGeneralChat = function (senderId, message) {
    return newGeneralMsg(senderId, message)
        .then(function (result) {
        console.log("newGeneralMsg row:", result.rows);
        return getMessageGeneralMsgById(result.rows[0].id).then(function (resp) {
            console.log("getLastMsgGeneralMsg result", resp.rows[0]);
            resp.rows[0].send_at = resp.rows[0].send_at.toLocaleString("en-GB", DATE_OPTION);
            return resp.rows[0];
        });
    })
        .catch(function (err) { return false; });
};
// getPrivateMsgById
var addNewMessagePrivateChat = function (senderId, newMsg) {
    return newPrivateMsg(senderId, newMsg.receiver_id, newMsg.message)
        .then(function (result) {
        console.log("new Private Msg row:", result.rows);
        return getPrivateMsgById(result.rows[0].id).then(function (resp) {
            console.log("getLastMsgGeneralMsg result", resp.rows[0]);
            resp.rows[0].send_at = resp.rows[0].send_at.toLocaleString("en-GB", DATE_OPTION);
            return resp.rows[0];
        });
    })
        .catch(function (err) {
        console.log("Error in newPrivateMsg", err);
        return false;
    });
};
exports.addNewMessage = function (userId, newMsg) {
    if (newMsg.receiver_id) {
        // Private Messages
        console.log("New Private Message", newMsg);
        return addNewMessagePrivateChat(userId, newMsg);
    }
    else {
        //General Messages
        console.log("New General Message", newMsg);
        return addNewMessageGeneralChat(userId, newMsg.message);
    }
};
/* -----------------------------------------------------------------------
                                WALL SECTION
-------------------------------------------------------------------------*/
exports.addWallPost = function (userId, postInfo) {
    console.log("In addWallPost, in process", userId, postInfo);
    return addPost(postInfo.wallUserId, userId, postInfo.post)
        .then(function (result) {
        console.log("Result from addWallPost:", result.rows[0]);
        return result.rows[0];
    })
        .catch(function (err) {
        err;
    });
};
exports.getPostInfo = function (portId, myUserId) {
    // search Post of the wall that I am in. The wallUserId can be the one writing the Post in his own Wall or in a friend Wall.
    return getPostByPostId(portId)
        .then(function (result) {
        result.rows.map(function (each) {
            return (each.created_at = each.created_at.toLocaleString("en-GB", DATE_OPTION));
        });
        return result.rows[0];
        // Here I have to map to put nice the date.
    })
        .catch(function (err) { return err; });
};
exports.searchForTheNewestPosts = function (wallUserId, myUserId) {
    // search Post of the wall that I am in. The wallUserId can be the one writing the Post in his own Wall or in a friend Wall.
    return searchPostByUserId(wallUserId)
        .then(function (result) {
        // console.log("searchPostByUser: result: ", result.rows);
        return result.rows;
        // Here I have to map to put nice the date.
    })
        .catch(function (err) { return err; });
};
/* -----------------------------------------------------------------------
                                COMMENTS SECTION
-------------------------------------------------------------------------*/
exports.searchCommentsId = function (postId) {
    return searchCommentsByPostId(postId)
        .then(function (result) {
        console.log("Search Comments by COMMENT Id", result.rows);
        // const arrayCommentsId: Array<string> = [];
        // result.rows.map((each) => {
        //     arrayCommentsId.push(each.comment_id);
        // });
        return result.rows;
    })
        .catch(function (err) { return err; });
};
exports.getCommentInfo = function (commentId) {
    return getCommentById(commentId)
        .then(function (result) {
        // console.log("Result from Db get comment", result.rows);
        result.rows[0].created_at =
            result.rows[0].created_at.toLocaleString("en-GB", DATE_OPTION);
        return result.rows[0];
    })
        .catch(function (err) { return err; });
};
exports.addCommentToPost = function (writer_id, newComment) {
    return addComment(newComment.post_id, writer_id, newComment.comment)
        .then(function (result) {
        console.log("Result from Db get comment", result.rows);
        // result.rows[0].created_at =
        //     result.rows[0].created_at.toLocaleString("en-GB", DATE_OPTION);
        return result.rows[0];
    })
        .catch(function (err) { return err; });
};
