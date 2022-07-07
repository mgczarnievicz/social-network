const bcrypt = require("bcryptjs");

exports.hash = (password: string): string => {
    return bcrypt.genSalt().then((salt: string) => {
        return bcrypt.hash(password, salt);
    });
};

exports.compare = bcrypt.compare;
