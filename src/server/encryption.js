var bcrypt = require("bcryptjs");
exports.hash = function (password) {
    return bcrypt.genSalt().then(function (salt) {
        return bcrypt.hash(password, salt);
    });
};
exports.compare = bcrypt.compare;
