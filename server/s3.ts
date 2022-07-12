import express, { Express, Response, NextFunction } from "express";

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;

if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

/*  Create an instance of an AWS user. (is just an object)
That give us a bunch of methods to communication 
and interact with our s3 cloud storage that amazon calls buckets
*/

// export {};

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

// @ts-ignore
module.exports.upload = (req, res: Response, next: NextFunction) => {
    // We valid that we have a file.
    // console.log("in S3 req", req);
    console.log("inside s3,ts");
    if (!req.file) {
        console.log("no file on request");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    // Bucket: 'spicedling',
    // Bucket: "imageboard-cy"
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("yay it worked our image is in the ☁️");

            next();

            // To delete the image form the temporal file
            fs.unlink(path, () => {});
        })
        .catch((err: {}) => {
            console.log("Ups, sth went wrong!");
            return res.sendStatus(500);
        });
};
