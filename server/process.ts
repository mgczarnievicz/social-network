const encryption = require("./encryption");
const cryptoRandomString = require("crypto-random-string");
// import cryptoRandomString from 'crypto-random-string';
const {
    registerUser,
    getUserByEmail,
    searchUserByEmail,
    updatePassword,
    registerCode,
    searchCode,
} = require("./db");

const { sendEmail } = require("./ses");

import { String } from "aws-sdk/clients/apigateway";
import { QueryResult } from "pg"; //This bc I need the type there.
import {
    NewUserRegistration,
    LogInUser,
    ProcessSingleRes,
    ProcessMultiRes,
    LogInResponse,
    RegisterResponse,
    UserResetPassword,
    StringObject,
} from "./typesServer";

function capitalizeFirstLetter(string: string): string {
    string = string.replace(/\s\s+/g, " ").trim();
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

type T = NewUserRegistration | LogInUser;
function cleanEmptySpaces<T>(obj: T): T {
    let result: T = { ...obj };
    Object.entries(obj).forEach(([key, value]) => {
        result[key as keyof typeof obj] = value.replace(/\s\s+/g, " ").trim();
    });

    return result;
}

// REVIEW: if function above work, delete this.
// function cleanEmptySpaces(obj: NewUserRegistration | LogInUser) {
//     let returnObj;
//     for (let key in obj) {
//         // I need to say that the key is a typeof key from the obj
//         obj[key as keyof typeof obj] = obj[key as keyof typeof obj]
//             .replace(/\s\s+/g, " ")
//             .trim();
//     }
//     return obj;
// }

//
/* 
If there is an empty input, that an ERROR!
REVIEW : HOW TO MAKE IT ACCEPT ANY OBJECT WITH STRING AS KEY PROP. 
 */
exports.noEmptyInputsValid = (
    obj: NewUserRegistration | LogInUser
): boolean => {
    const returnObj = cleanEmptySpaces(obj);
    for (let key in returnObj) {
        if (returnObj[key as keyof typeof returnObj].length === 0) {
            console.log("Found empty input!:");
            return false;
        }
    }
    return true;
};

// function cleanEmptySpaces<T>(obj: T): T { FIXME!
// type M = NewUserRegistration | LogInUser | UserResetPassword;
// exports.noEmptyInputsValid = <M>(obj: M): boolean => {
//     const returnObj = cleanEmptySpaces(obj);

//     for (let key in returnObj) {
//         if (returnObj[key as keyof typeof returnObj].length === 0) {
//             console.log("Found empty input!:");
//             return false;
//         }
//     }
//     return true;
// };

/* 
Verifying if there is something, it could have empty inputs
    false -> input with stuff.
    true -> input empty.
*/
exports.verifyingIfThereIsInputs = (
    obj: NewUserRegistration | LogInUser
): boolean => {
    const returnObj = cleanEmptySpaces(obj);
    for (let key in returnObj) {
        if (returnObj[key as keyof typeof returnObj].length !== 0) {
            console.log(
                "verifyingEmptyInputs: \nFound sth",
                returnObj[key as keyof typeof returnObj].trim()
            );
            return false;
        }
    }
    return true;
};

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
    // newUser = cleanEmptySpaces(newUser);

    return encryption
        .hash(newUser.password)
        .then((hashPass: string) => {
            // Saved input in the db.
            // FIXME! ERROR WITH TYPES!
            // i don't clean the input the extra spaces!!!
            const cleanNewUser: NewUserRegistration =
                cleanEmptySpaces<NewUserRegistration>(newUser);
            //  cleanNewUser = cleanEmptySpaces(newUser);

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
    userLogIn = cleanEmptySpaces(userLogIn);
    return getUserByEmail(userLogIn.email.toLowerCase())
        .catch((err: QueryResult) => err)
        .then((result: QueryResult) => {
            // See what we recived and if there is a result, then se ?if its empty or not.
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
    console.log("userInput", userInput);
    // Search for email in dataBase in reset Password.
    // Compare code.
    // if codes are the same then hash the new password and save it in db.
    return searchCode(userInput.email)
        .then((result: QueryResult) => {
            console.log("search code result", result.rows);
            if (result.rows[0].code === userInput.code) {
                console.log(
                    "The codes are the same. I can has and save the new Pass."
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
