const bcrypt = require("./encryption");
const { registerUser } = require("./db");
import { QueryResult } from "pg"; //This bc I need the type there.

interface NewUserRegistration {
    name: string;
    surname: string;
    email: string;
    password: string;
}

interface LogInUser {
    email: string;
    password: string;
}

function capitalizeFirstLetter(string: string): string {
    string = string.replace(/\s\s+/g, " ").trim();
    console.log("string.trim() in process:", string);
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const cleanEmptySpaces = (
    obj: NewUserRegistration | LogInUser
): NewUserRegistration | LogInUser => {
    for (let key in obj) {
        // I need to say that the key is a typeof key from the obj.
        obj[key as keyof typeof obj] = obj[key as keyof typeof obj]
            .replace(/\s\s+/g, " ")
            .trim();
    }
    return obj;
};

// false -> input with stuff.
// true -> input empty.
exports.verifyingEmptyInputs = (
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
