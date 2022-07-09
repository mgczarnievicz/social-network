"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encryption = require("./encryption");
var _a = require("./db"), registerUser = _a.registerUser, getUserByEmail = _a.getUserByEmail;
// REVIEW : if working delete.
// interface NewUserRegistration {
//     name: string;
//     surname: string;
//     email: string;
//     password: string;
// }
// interface LogInUser {
//     email: string;
//     password: string;
// }
function capitalizeFirstLetter(string) {
    string = string.replace(/\s\s+/g, " ").trim();
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// function cleanEmptySpaces<T extends NewUserRegistration | LogInUser>(obj: T) {
//     let returnObj: T;
//     for (let key in obj) {
//         // I need to say that the key is a typeof key from the obj.
//         returnObj[key as keyof typeof obj] = obj[key as keyof typeof obj]
//             .replace(/\s\s+/g, " ")
//             .trim();
//     }
//     return returnObj;
// } <T extends NewUserRegistration | LogInUser>
function cleanEmptySpaces(obj) {
    var returnObj;
    for (var key in obj) {
        // I need to say that the key is a typeof key from the obj
        obj[key] = obj[key]
            .replace(/\s\s+/g, " ")
            .trim();
    }
    return obj;
}
//
/*
If there is an empty input, that an ERROR!

 */
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
exports.verifyingIfThereIsInputs = function (obj) {
    var returnObj = cleanEmptySpaces(obj);
    for (var key in returnObj) {
        if (returnObj[key].length !== 0) {
            console.log("verifyingEmptyInputs: \nFound sth", returnObj[key].trim());
            return false;
        }
    }
    return true;
};
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
        // const cleanNewUser = cleanEmptySpaces(newUser);
        //  cleanNewUser = cleanEmptySpaces(newUser);
        return registerUser(capitalizeFirstLetter(newUser.name), capitalizeFirstLetter(newUser.surname), newUser.email.toLowerCase(), hashPass)
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
        // See what we recived and if there is a result, then se
        // if its empty or not.
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
