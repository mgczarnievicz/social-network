import bcrypt from "bcryptjs";

exports.hash = (password: string) => {
    return bcrypt.genSalt().then((salt: string) => {
        return bcrypt.hash(password, salt);
    });
};

exports.compare = bcrypt.compare;
