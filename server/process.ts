const bcrypt = require("./encryption");
const { registerUser } = require("./db");
import { QueryResult } from "pg"; //This bc I need the type there.

interface NewUserRegistration {
    name: string;
    surname: string;
    email: string;
    password: string;
}

function capitalizeFirstLetter(string: string): string {
    string = string.replace(/\s\s+/g, " ").trim();
    console.log("string.trim() in process:", string);
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/* 
FIXME. see the types. I want any type of input but to be an object
*/
exports.cleanEmptySpaces = (obj: {}): {} => {
    const returnObj = {};
    for (let key in obj) {
        returnObj[key] = obj[key].replace(/\s\s+/g, " ").trim();
    }
    return returnObj;
};

// false -> input with stuff.
// true -> input empty.
exports.verifyingEmptyInputs = (obj: {}): boolean => {
    for (let key in obj) {
        if (obj[key].trim().length !== 0) {
            console.log("verifyingEmptyInputs: \nFound sth", obj[key].trim());
            return false;
        }
    }
    return true;
};

/* 
FIXME. see the types. I return an : QueryResult or the rows[]
*/
exports.registerNewUser = (newUser: NewUserRegistration) => {
    // First hash the pass.
    // then write in db.
    return bcrypt
        .hash(newUser.password)
        .then((hashPass: string) => {
            // Saved input in the db.
            console.log("hashPass", hashPass);
            return registerUser(
                capitalizeFirstLetter(newUser.name),
                capitalizeFirstLetter(newUser.surname),
                newUser.email.toLowerCase(),
                hashPass
            )
                .then((dbResult: QueryResult) => dbResult.rows[0])
                .catch((err: QueryResult) => err);
        })
        .catch((hashErr: QueryResult) => hashErr);
};
