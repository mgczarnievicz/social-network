const encryption = require("./encryption");
import cryptoRandomString from "crypto-random-string";

const {
    registerUser,
    getUserByEmail,
    searchUserByEmail,
    updatePassword,
    registerCode,
    searchCode,
    updateProfileImage,
    getUserDataById,
    upDateBioByUserId,
    getNewestUsers,
    getMatchingFriends,
    searchProfileByUserId,
    getFriendship,
    updateFriendshipById,
    deleteFriendshipById,
    addFriendship,
    addPost,
    searchFriendshipByUserId,
    searchPostByUserId,
    getPostByPostId,
    getLastMsgGeneralMsg,
    newGeneralMsg,
    getMessageGeneralMsgById,
    searchCommentsByPostId,
    getCommentById,
} = require("./db");

const { sendEmail } = require("./ses");

import { String } from "aws-sdk/clients/apigateway";
import { Query, QueryResult } from "pg"; //This bc I need the type there.
import {
    NewUserRegistration,
    LogInUser,
    LogInResponse,
    RegisterResponse,
    UserResetPassword,
    UserInfo,
    FriendShipResponds,
} from "./typesServer";
import { DataBrew } from "aws-sdk";

const DATE_OPTION = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};
/* -----------------------------------------------------------------------
                               GENERAL USE
-------------------------------------------------------------------------*/

function capitalizeFirstLetter(string: string): string {
    string = string.replace(/\s\s+/g, " ").trim();
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

type T = NewUserRegistration | LogInUser | UserResetPassword;

function cleanEmptySpaces<T>(obj: T): T {
    let result: T = { ...obj };
    Object.entries(obj).forEach(([key, value]) => {
        result[key as keyof typeof obj] = value.replace(/\s\s+/g, " ").trim();
    });

    return result;
}

exports.noEmptyInputsValid = (obj: T): boolean => {
    const returnObj = cleanEmptySpaces(obj);
    for (let key in returnObj) {
        if (returnObj[key as keyof typeof obj].length === 0) {
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

function encryptPassword(password: string) {
    return encryption
        .hash(password)
        .then((hashPass: string) => hashPass)
        .catch((hashErr: QueryResult) => hashErr);
}

/* 
FIXME. see the types. I return an : QueryResult or the rows[]
Response: 
    - db Error
    - UserBasicInfo when success
*/
exports.registerNewUser = (newUser: NewUserRegistration): RegisterResponse => {
    // First hash the pass.
    // then write in db.

    return encryption
        .hash(newUser.password)
        .then((hashPass: string) => {
            const cleanNewUser: NewUserRegistration =
                cleanEmptySpaces<NewUserRegistration>(newUser);

            return registerUser(
                capitalizeFirstLetter(cleanNewUser.name),
                capitalizeFirstLetter(cleanNewUser.surname),
                newUser.email.toLowerCase(),
                hashPass
            )
                .then((dbResult: QueryResult) => dbResult.rows[0])
                .catch((err: QueryResult) => err);
        })
        .catch((hashErr: QueryResult) => hashErr);
};

/* 
Response: 
    - db Error
    - String: Error
    - UserBasicInfo when success
*/
exports.logInVerify = (userLogIn: LogInUser): LogInResponse => {
    userLogIn = cleanEmptySpaces<LogInUser>(userLogIn);
    return getUserByEmail(userLogIn.email.toLowerCase())
        .catch((err: QueryResult) => err)
        .then((result: QueryResult) => {
            // See what we recived and if there is a result, then se if its empty or not.
            if (result.rows.length === 0) {
                console.log("Email not register");
                return "Error";
            }
            return encryption
                .compare(userLogIn.password, result.rows[0].password)
                .catch((err: QueryResult) => err)
                .then((isCorrect: boolean) => {
                    if (isCorrect) {
                        console.log("You Are In!");
                        return result.rows[0];
                    } else {
                        return "Error";
                    }
                });
        });
};

/* -----------------------------------------------------------------------
                        RESET PASSWORD SECTION
-------------------------------------------------------------------------*/
const RESET_PASS_SUBJECT = "HorseMan Reset Password";
const RESET_PASS_MESSAGE_GREETING =
    "Dear Costumer, \nWe send you the code, to be able to reset your password. Remember this is only valid for the next 8 minutes. After this you will need to require a new one.\n\t";
const RESET_PASS_MESSAGE =
    "\nThank you for using our services.\nHorseMan group.";

function setCodeAndSendEmail(email: string) {
    const secretCode = cryptoRandomString({
        length: 10,
        type: "base64",
    });
    return registerCode(email, secretCode)
        .then(() => {
            // (recipient: string, message: string, subject: string)
            return sendEmail(
                email,
                RESET_PASS_MESSAGE_GREETING + secretCode + RESET_PASS_MESSAGE,
                RESET_PASS_SUBJECT
            ).then((mailResult: boolean) => {
                console.log("mailResult", mailResult);
                return true;
            });
        })
        .catch(() => false);
}

exports.foundEmail = (email: string): boolean => {
    return searchUserByEmail(email)
        .then((result: QueryResult) => {
            console.log("result.rows", result.rows);
            if (result.rows[0].id) {
                console.log("result.rows[0].id", result.rows[0].id);
                return setCodeAndSendEmail(email);
            }
            return false;
        })
        .catch((err: QueryResult) => false);
};

exports.setNewPassword = (userInput: UserResetPassword) => {
    // Search for email in dataBase in reset Password.
    // Compare code.
    // if codes are the same then hash the new password and save it in db.
    return searchCode(userInput.email)
        .then((result: QueryResult) => {
            console.log("search code result", result.rows);
            if (result.rows[0].code === userInput.code) {
                console.log(
                    "The codes are the same. I can hash and save the new Pass."
                );
                return encryptPassword(userInput.newPassword).then(
                    (hash: string) => {
                        console.log("encryptPassword result:", hash);
                        return updatePassword(userInput.email, hash)
                            .then(() => true)
                            .catch(() => false);
                    }
                );
            }
            return false;
        })
        .catch((err: QueryResult) => false);
};

/* -----------------------------------------------------------------------
                     PROFILE EDIT & UPDATE SECTION
-------------------------------------------------------------------------*/
exports.saveProfileImage = (userId: number, url: string) => {
    return updateProfileImage(userId, url)
        .then((result: QueryResult) => {
            console.log("Save img result.rows[0]", result.rows[0]);
            return result.rows[0].photourl;
        })
        .catch((err: QueryResult) => {
            console.log("Error Updating the url", err);
            return false;
        });
};

exports.getUserInfo = (userId: number) => {
    console.log("Process GetUser Info id", userId);
    return getUserDataById(userId)
        .then((result: QueryResult) => {
            const { password, email, ...userInfo } = result.rows[0];
            userInfo.bio = userInfo.bio.split("\n");
            return userInfo;
        })
        .catch((err: QueryResult) => err);
};

exports.upDateBio = (userId: number, newBio: string) => {
    /*  We want to save the array of bios, each element is separate by the enter of the user   */

    return upDateBioByUserId(userId, newBio)
        .then((result: QueryResult) => {
            console.log("Query result", result.rows[0]);

            const bioArray = result.rows[0].bio.split("\n");
            console.log("bioArray", bioArray);

            return bioArray;
        })
        .catch((err: QueryResult) => err);
};

/* -----------------------------------------------------------------------
                                FRIEND SECTION
-------------------------------------------------------------------------*/
function searchForFiendsThatStartWith(nameToSearch: string, userId: number) {
    console.log("nameToSearch in searchForFriend", nameToSearch);
    return getMatchingFriends(nameToSearch, userId)
        .then((result: QueryResult) => {
            console.log("result.rows", result.rows);
            return result.rows;
        })
        .catch((err: QueryResult) => {
            err;
        });
}

function searchNewestFiends(userId: number) {
    return getNewestUsers(userId)
        .then((result: QueryResult) => {
            console.log("result.rows", result.rows);
            return result.rows;
        })
        .catch((err: QueryResult) => {
            err;
        });
}

exports.searchForFiends = (nameToSearch: string, userId: number) => {
    console.log("nameToSearch in searchForFriend", nameToSearch);
    if (nameToSearch !== "") {
        // Here search in db the value of input
        return searchForFiendsThatStartWith(nameToSearch, userId);
    } else {
        // Send the last 15 friends.
        return searchNewestFiends(userId);
    }
};

exports.searchForProfile = (id: number) => {
    return searchProfileByUserId(id)
        .then((result: QueryResult) => {
            console.log("result.rows", result.rows);
            if (result.rows.length === 0) {
                // No match found
                return { status: "Not Found" };
            } else {
                console.log("Found Profile.");
                return { status: "Success", profile: result.rows[0] };
            }
        })
        .catch((err: QueryResult) => err);
};

exports.searchFriendshipStatus = (userId: number, viewId: number) => {
    console.log(`searchFriendshipStatus: userId: ${userId}, viewId ${viewId}`);
    return getFriendship(userId, viewId)
        .then((result: QueryResult) => {
            console.log("DB response getFriendship:", result.rows);

            if (result.rows.length === 0) {
                // They are not Friends!
                return {
                    button: "Add Friend",
                    viewUserId: viewId,
                };
            } else {
                const friendship = result.rows[0];

                if (friendship.accepted) {
                    // We are fiends!
                    return {
                        button: "Unfriend",
                        viewUserId: viewId,
                    };
                } else {
                    // We are in the pending state!
                    if (friendship.sender_id == userId) {
                        // I am the sender of the request. So I can cancel the request.
                        return {
                            button: "Cancel Request",
                            viewUserId: viewId,
                        };
                    } else {
                        // If I am the recipient, I can only Accept Friend.
                        return {
                            button: "Accept Friend",
                            viewUserId: viewId,
                        };
                    }
                }
            }
        })
        .catch((err: QueryResult) => {
            err;
        });
};

function deleteFriendship(userId: number, viewId: number) {
    return deleteFriendshipById(userId, viewId)
        .then((res: QueryResult) => {
            return {
                button: "Add Friend",
                viewUserId: viewId,
            };
        })
        .catch((err: QueryResult) => {
            console.log("Error Delete Friendship", err);
            return "Error";
        });
}

function acceptFriendship(userId: number, viewId: number) {
    return updateFriendshipById(userId, viewId)
        .then((result: QueryResult) => {
            console.log("result from updateFriendship", result.rows);
            return { button: "Unfriend", viewUserId: viewId };
        })
        .catch((err: QueryResult) => {
            console.log("Error acceptFriendShip", err);
            return "Error";
        });
}

function newFriendship(userId: number, viewId: number) {
    console.log("NewFriendshipValues");
    console.log("userId:", userId, "viewId:", viewId);
    return addFriendship(userId, viewId)
        .then((result: QueryResult) => {
            console.log("add Friendship result:", result.rows);
            return {
                button: "Cancel Request",
                viewUserId: viewId,
            };
        })
        .catch((err: QueryResult) => {
            console.log("Error newFriendship", err);
            return "Error";
        });
}

exports.setFriendshipStatus = (
    userId: number,
    actualStatus: FriendShipResponds
) => {
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

exports.getFriends = (userId: number) => {
    return searchFriendshipByUserId(userId)
        .then((result: QueryResult) => {
            console.log("SearchFriendshipBy Id result", result.rows);
            return result.rows;
        })
        .catch((err: QueryResult) => err);
};

/* -----------------------------------------------------------------------------
                        SOCKET SECTION
-------------------------------------------------------------------------------*/
exports.getNewestChatMsg = () => {
    return getLastMsgGeneralMsg()
        .then((result: QueryResult) => {
            console.log("getLastMsgGeneralMsg result", result.rows);
            result.rows.map(
                (each) =>
                    (each.send_at = each.send_at.toLocaleString(
                        "en-GB",
                        DATE_OPTION
                    ))
            );
            return result.rows;
        })
        .catch((err: QueryResult) => false);
};

exports.addNewMessageGeneralChat = (senderId: number, message: string) => {
    return newGeneralMsg(senderId, message)
        .then((result: QueryResult) => {
            console.log("newGeneralMsg row:", result.rows);
            return getMessageGeneralMsgById(result.rows[0].id).then(
                (resp: QueryResult) => {
                    console.log("getLastMsgGeneralMsg result", resp.rows[0]);
                    resp.rows[0].send_at = resp.rows[0].send_at.toLocaleString(
                        "en-GB",
                        DATE_OPTION
                    );

                    return resp.rows[0];
                }
            );
        })
        .catch((err: QueryResult) => false);
};

/* -----------------------------------------------------------------------
                                WALL SECTION
-------------------------------------------------------------------------*/
exports.addWallPost = (
    userId: number,
    postInfo: { wallUserId: number; post: string }
) => {
    console.log("In addWallPost, in process", userId, postInfo);
    return addPost(postInfo.wallUserId, userId, postInfo.post)
        .then((result: QueryResult) => {
            console.log("Result from addWallPost:", result.rows[0]);
            return result.rows[0];
        })
        .catch((err: QueryResult) => {
            err;
        });
};

exports.getPostInfo = (portId: number, myUserId: number) => {
    // search Post of the wall that I am in. The wallUserId can be the one writing the Post in his own Wall or in a friend Wall.
    return getPostByPostId(portId)
        .then((result: QueryResult) => {
            result.rows.map(
                (each) =>
                    (each.created_at = each.created_at.toLocaleString(
                        "en-GB",
                        DATE_OPTION
                    ))
            );
            return result.rows[0];
            // Here I have to map to put nice the date.
        })
        .catch((err: QueryResult) => err);
};

exports.searchForTheNewestPosts = (wallUserId: number, myUserId: number) => {
    // search Post of the wall that I am in. The wallUserId can be the one writing the Post in his own Wall or in a friend Wall.
    return searchPostByUserId(wallUserId)
        .then((result: QueryResult) => {
            // console.log("searchPostByUser: result: ", result.rows);
            return result.rows;
            // Here I have to map to put nice the date.
        })
        .catch((err: QueryResult) => err);
};

/* -----------------------------------------------------------------------
                                COMMENTS SECTION
-------------------------------------------------------------------------*/

exports.searchCommentsId = (postId: number) => {
    return searchCommentsByPostId(postId)
        .then((result: QueryResult) => {
            console.log("Search Comments by COMMENT Id", result.rows);
            const arrayCommentsId: Array<string> = [];
            result.rows.map((each) => {
                arrayCommentsId.push(each.comment_id);
            });
            return result.rows;
        })
        .catch((err: QueryResult) => err);
};

exports.getCommentInfo = (commentId: number) => {
    return getCommentById(commentId)
        .then((result: QueryResult) => {
            // console.log("Result from Db get comment", result.rows);
            result.rows[0].created_at =
                result.rows[0].created_at.toLocaleString("en-GB", DATE_OPTION);
            return result.rows[0];
        })
        .catch((err: QueryResult) => err);
};

exports.addNewComment = (writer_id: number) => {
    // return addComment(post_id, writer_id, comment)
    //     .then((result: QueryResult) => {
    //         // console.log("Result from Db get comment", result.rows);
    //         result.rows[0].created_at =
    //             result.rows[0].created_at.toLocaleString("en-GB", DATE_OPTION);
    //         return result.rows[0];
    //     })
    //     .catch((err: QueryResult) => err);
};
