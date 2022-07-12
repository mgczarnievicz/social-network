import express, { Express } from "express";
import compression from "compression";
import cookieSession from "cookie-session";
import path from "path";

// This is a hack to make Multer available in the Express namespace
import multer, { FileFilterCallback, Multer } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// import uidSafe from "uid-safe";
const uidSafe = require("uid-safe");
const s3 = require("./s3");

// import bodyParser from "body-parser";

// Importing the Type of data
import {
    NewUserRegistration,
    LogInUser,
    ProcessSingleRes,
    ProcessMultiRes,
    UserBasicInfo,
} from "./typesServer";
import { QueryResult } from "pg"; //This bc I need the type there.

const {
    verifyingEmptyInputs,
    registerNewUser,
    logInVerify,
    noEmptyInputsValid,
    foundEmail,
    setNewPassword,
    saveProfileImage,
    getUserInfo,
    upDateBio,
} = require("./process");

// @ts-ignore
// export const app: Express = express();
const app = express();

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

app.use(compression());

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 15,
        sameSite: true,
    })
);

const storage = multer.diskStorage({
    destination(req, file: Express.Multer.File, callback: DestinationCallback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file: Express.Multer.File, callback: FileNameCallback) {
        // const randomFileName =
        //  how to keep the extension
        uidSafe(24).then((randomString: string) => {
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097155,
    },
});

// For Protection propose
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

// If we deploy. FIXME startWith gives error "lib": ["es2015"]
// if (process.env.NODE_ENV == "production") {
//     app.use((req, res, next) => {
//         if (req.headers["x-forwarded-proto"].startsWith("https")) {
//             return next();
//         }
//         res.redirect(`https://${req.hostname}${req.url}`);
//     });
// }

// app.use(bodyParser.json());
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("req.body:", req.body);

    console.log("---------------------");
    next();
});

/* -----------------------------------------------------------------------------------------------------
                    GET
------------------------------------------------------------------------------------------------------*/

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session && req.session.userId,
    });
});

app.get("/logout", (req, res) => {
    console.log("I am in Logout, we clear the cookies");
    req.session = null;
    res.redirect("/");
});

app.get("/getUserInfo.json", (req, res) => {
    getUserInfo(req.session.userId).then((data: {}) => {
        res.json({
            status: "Success",
            data: data,
        });
    });
});
/* -----------------------------------------------------------------------------------------------------
                            POST
------------------------------------------------------------------------------------------------------*/
app.post("/registration.json", (req, res) => {
    // here the responds
    console.log("\tGetting Registration info");
    console.log("req.body", req.body);
    // Verify the empty Strings!   Empty inputs are not valid"
    if (!noEmptyInputsValid(req.body)) {
        console.log("/registration.json found empty string!");
        res.json({
            status: "Error",
        });
    } else {
        /* FIXME! see why when I already have a user the error enter in the then. 
        Response: 
            - db Error
            - UserBasicInfo when success
        */
        registerNewUser(req.body)
            .then((currentUser: UserBasicInfo) => {
                console.log("currentUser:", currentUser);
                if (req.session) req.session.userId = currentUser.id;
                res.json({
                    status: "Success",
                });
            })
            .catch((err: QueryResult) => {
                res.json({
                    status: "Error",
                });
            });
    }
});

app.post("/login", (req, res) => {
    console.log("\tGetting Log In info");
    console.log("req.body", req.body);

    if (!noEmptyInputsValid(req.body)) {
        console.log("/login found empty string!");
        res.json({
            status: "Error",
        });
    } else {
        logInVerify(req.body)
            .then((userLogIn: string | UserBasicInfo) => {
                console.log("logInVerify Response, userLogIn:", userLogIn);
                if (typeof userLogIn === "string") {
                    res.json({
                        status: "Error",
                    });
                } else {
                    console.log("userLogIn not a string");
                    if (req.session) req.session.userId = userLogIn.id;
                    res.json({
                        status: "Success",
                    });
                }
            })
            .catch((err: QueryResult) => {
                console.log("Error in log In", err);
                res.json({
                    status: "Error",
                });
            });
    }
});

app.post("/resetPassword/sendEmail.json", (req, res) => {
    console.log("\tGetting Send Email info");
    console.log("req.body", req.body);
    /*
    search email in db and generate and sen an email to the mail.
     */
    if (req.body.email.trim().length === 0) {
        console.log("No email was enter");
        res.json({
            status: "Error",
        });
    }

    foundEmail(req.body.email.trim())
        .then((result: boolean) => {
            console.log("found email result", result);
            if (result) {
                console.log("found email is true?!");
                res.json({
                    status: "Success",
                });
            } else {
                res.json({
                    status: "Error",
                });
            }
        })
        .catch((err: QueryResult) => {
            console.log("Error in log In", err);
            res.json({
                status: "Error",
            });
        });
});

app.post("/resetPassword/setNewPassword.json", (req, res) => {
    console.log("\tGetting Set New Password info");
    console.log("req.body", req.body);
    /*
    search in the db if the code is still valid and compare, if its the same update the password.
     */
    // FIXME! must validate the code and pass is not empty! see error in the functions already made.
    setNewPassword(req.body)
        .then((result: boolean) => {
            console.log("Result in setNewPassword", result);
            if (result) {
                res.json({
                    status: "Success",
                });
            } else {
                res.json({
                    status: "Error",
                });
            }
        })
        .catch(() =>
            res.json({
                status: "Error",
            })
        );
});

// uploader.single("image") image is the name of the input filed.
app.post("/upload.json", uploader.single("image"), s3.upload, (req, res) => {
    console.log(
        `-----------------------------------------------------------------------------\n\t UpLoading Image`
    );

    /* NOTE: 
    Upload the image in AWS and then, ones we know that is uploaded we save it in our date base
     with the url to be able to display it later. */

    // If I use the other credentials
    const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
    // const url = `https://imageboard-cy.s3.eu-central-1.amazonaws.com/${req.file.filename}`;

    // we need to generate the url of the image.
    // https://s3.amazonaws.com/:yourBucketName/:filename
    // https://:yourBucketName.s3.eu-central-1.amazonaws.com/:filename.

    console.log(`\t url: ${url}`);
    const userId = req.session.userId;
    saveProfileImage(userId, url)
        .then((result: string) => {
            console.log("result form database", result);
            res.json({
                status: "Success",
                photourl: result,
            });
        })
        .catch((err: boolean) =>
            res.json({
                status: "Error",
            })
        );
});

app.post("/setBioInfo.json", (req, res) => {
    console.log("Data received Set Bio", req.body);
    upDateBio(req.session.userId, req.body.data)
        .then((result: string) => {
            console.log("Respond from process:", result);

            res.json({
                status: "Success",
                result,
            });
        })
        .catch(() =>
            res.json({
                status: "Error",
            })
        );
});

/* ---------------------------------------------------------------------------------------
                                        THE END
-------------------------------------------------------------------------------------------*/

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
