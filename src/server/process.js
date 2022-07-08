var bcrypt = require("./encryption");
var registerUser = require("./db").registerUser;
function capitalizeFirstLetter(string) {
    string = string.replace(/\s\s+/g, " ").trim();
    console.log("string.trim() in process:", string);
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
var cleanEmptySpaces = function (obj) {
    for (var key in obj) {
        // I need to say that the key is a typeof key from the obj.
        obj[key] = obj[key]
            .replace(/\s\s+/g, " ")
            .trim();
    }
    return obj;
};
// false -> input with stuff.
// true -> input empty.
exports.verifyingEmptyInputs = function (obj) {
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
*/
exports.registerNewUser = function (newUser) {
    // First hash the pass.
    // then write in db.
    return bcrypt
        .hash(newUser.password)
        .then(function (hashPass) {
        // Saved input in the db.
        console.log("hashPass", hashPass);
        return registerUser(capitalizeFirstLetter(newUser.name), capitalizeFirstLetter(newUser.surname), newUser.email.toLowerCase(), hashPass)
            .then(function (dbResult) { return dbResult.rows[0]; })
            .catch(function (err) { return err; });
    })
        .catch(function (hashErr) { return hashErr; });
};
export {};
