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
Object.defineProperty(exports, "__esModule", { value: true });
var encryption = require("./encryption");
var cryptoRandomString = require("crypto-random-string");
// import cryptoRandomString from 'crypto-random-string';
var _a = require("./db"), registerUser = _a.registerUser, getUserByEmail = _a.getUserByEmail, searchUserByEmail = _a.searchUserByEmail, updatePassword = _a.updatePassword, registerCode = _a.registerCode, searchCode = _a.searchCode, updateProfileImage = _a.updateProfileImage, getUserDataById = _a.getUserDataById, upDateBioByUserId = _a.upDateBioByUserId;
var sendEmail = require("./ses").sendEmail;
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
    // newUser = cleanEmptySpaces(newUser);
    return encryption
        .hash(newUser.password)
        .then(function (hashPass) {
        // Saved input in the db.
        // FIXME! ERROR WITH TYPES!
        // i don't clean the input the extra spaces!!!
        var cleanNewUser = cleanEmptySpaces(newUser);
        //  cleanNewUser = cleanEmptySpaces(newUser);
        return registerUser(capitalizeFirstLetter(cleanNewUser.name), capitalizeFirstLetter(cleanNewUser.surname), newUser.email.toLowerCase(), hashPass)
            .then(function (dbResult) { return dbResult.rows[0]; })
            .catch(function (err) { return err; });
    })
        .catch(function (hashErr) { return hashErr; });
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
        // See what we recived and if there is a result, then se ?if its empty or not.
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
var RESET_PASS_SUBJECT = "HorseMan Reset Password";
var RESET_PASS_MESSAGE_GREETING = "Dear Costumer, \nWe send you the code, to be able to reset your password. Remember this is only valid for the next 8 minutes. After this you will need to require a new one.\n\t";
var RESET_PASS_MESSAGE = "\nThank you for using our services.\nHorseMan group.";
function setCodeAndSendEmail(email) {
    var secretCode = cryptoRandomString({
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
    console.log("userInput", userInput);
    // Search for email in dataBase in reset Password.
    // Compare code.
    // if codes are the same then hash the new password and save it in db.
    return searchCode(userInput.email)
        .then(function (result) {
        console.log("search code result", result.rows);
        if (result.rows[0].code === userInput.code) {
            console.log("The codes are the same. I can has and save the new Pass.");
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
        console.log("User Data:", result.rows[0]);
        var _a = result.rows[0], password = _a.password, userInfo = __rest(_a, ["password"]);
        console.log("userInfo", userInfo);
        return userInfo;
    })
        .catch(function (err) { return err; });
};
exports.upDateBio = function (userId, newBio) {
    return upDateBioByUserId(userId, newBio)
        .then(function (result) {
        console.log("Query result", result.rows);
        return result.rows[0].bio;
    })
        .catch(function (err) { return err; });
};
