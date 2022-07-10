"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
}
else {
    secrets = require("./secrets.json");
}
// For spiced credentials.
// for my credential i have to use eu-west-2
var ses = new aws_sdk_1.default.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});
exports.sendEmail = function (recipient, message, subject) {
    return ses
        .sendEmail({
        // Put here the mail that was provided by spiced or my own
        Source: "Server Email. <celestial.cart@spicedling.email>",
        Destination: {
            ToAddresses: ["celestial.cart+destimation@spicedling.email"],
            // ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Data: message,
                },
            },
            Subject: {
                Data: subject,
            },
        },
    })
        .promise()
        .then(function () {
        console.log("it worked!");
        return true;
    })
        .catch(function (err) {
        console.log("Something went wrong sending the email", err);
        return false;
    });
};
