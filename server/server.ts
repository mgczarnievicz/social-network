import express, { Express } from "express";
import compression from "compression";
import cookieSession from "cookie-session";
import path from "path";

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

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("---------------------");
    next();
});

// app.use(bodyParser.json());
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

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
                    req.session.userId = userLogIn.id;
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

/* ---------------------------------------------------------------------------------------
                                        THE END
-------------------------------------------------------------------------------------------*/

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
