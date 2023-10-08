import aws from "aws-sdk";

let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

// For spiced credentials.
// for my credential i have to use eu-west-2
const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

exports.sendEmail = (recipient: string, message: string, subject: string) => {
    return ses
        .sendEmail({
            // Put here the mail that was provided by spiced or my own
            //vintage.coach@spicedling.email
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
        .then(() => {
            console.log("it worked!");
            return true;
        })
        .catch((err) => {
            console.log("Something went wrong sending the email", err);
            return false;
        });
};
