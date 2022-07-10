"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var path_1 = __importDefault(require("path"));
var _a = require("./process"), verifyingEmptyInputs = _a.verifyingEmptyInputs, registerNewUser = _a.registerNewUser, logInVerify = _a.logInVerify, noEmptyInputsValid = _a.noEmptyInputsValid, foundEmail = _a.foundEmail, setNewPassword = _a.setNewPassword;
// @ts-ignore
// export const app: Express = express();
var app = (0, express_1.default)();
// Bc we are deploying we need to define where to get the value.
var COOKIE_SECRET = process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;
app.use((0, compression_1.default)());
app.use((0, cookie_session_1.default)({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    sameSite: true,
}));
// For Protection propose
app.use(function (req, res, next) {
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "client", "public")));
app.use(function (req, res, next) {
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
app.get("/logout", function (req, res) {
    console.log("I am in Logout, we clear the cookies");
    req.session = null;
    res.redirect("/");
});
/* -----------------------------------------------------------------------------------------------------
                            POST
------------------------------------------------------------------------------------------------------*/
app.post("/registration.json", function (req, res) {
    // here the responds
    console.log("\tGetting Registration info");
    console.log("req.body", req.body);
    // Verify the empty Strings!   Empty inputs are not valid"
    if (!noEmptyInputsValid(req.body)) {
        console.log("/registration.json found empty string!");
        res.json({
            status: "Error",
        });
    }
    else {
        /* FIXME! see why when I already have a user the error enter in the then.
        Response:
            - db Error
            - UserBasicInfo when success
        */
        registerNewUser(req.body)
            .then(function (currentUser) {
            console.log("currentUser:", currentUser);
            if (req.session)
                req.session.userId = currentUser.id;
            res.json({
                status: "Success",
            });
        })
            .catch(function (err) {
            res.json({
                status: "Error",
            });
        });
    }
});
app.post("/login", function (req, res) {
    console.log("\tGetting Log In info");
    console.log("req.body", req.body);
    if (!noEmptyInputsValid(req.body)) {
        console.log("/login found empty string!");
        res.json({
            status: "Error",
        });
    }
    else {
        logInVerify(req.body)
            .then(function (userLogIn) {
            console.log("logInVerify Response, userLogIn:", userLogIn);
            if (typeof userLogIn === "string") {
                res.json({
                    status: "Error",
                });
            }
            else {
                console.log("userLogIn not a string");
                if (req.session)
                    req.session.userId = userLogIn.id;
                res.json({
                    status: "Success",
                });
            }
        })
            .catch(function (err) {
            console.log("Error in log In", err);
            res.json({
                status: "Error",
            });
        });
    }
});
app.post("/resetPassword/sendEmail.json", function (req, res) {
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
        .then(function (result) {
        console.log("found email result", result);
        if (result) {
            console.log("found email is true?!");
            res.json({
                status: "Success",
            });
        }
        else {
            res.json({
                status: "Error",
            });
        }
    })
        .catch(function (err) {
        console.log("Error in log In", err);
        res.json({
            status: "Error",
        });
    });
});
app.post("/resetPassword/setNewPassword.json", function (req, res) {
    console.log("\tGetting Set New Password info");
    console.log("req.body", req.body);
    /*
    search in the db if the code is still valid and compare, if its the same update the password.
     */
    // FIXME! must validate the code and pass is not empty! see error in the functions already made.
    setNewPassword(req.body)
        .then(function (result) {
        console.log("Result in setNewPassword", result);
        if (result) {
            res.json({
                status: "Success",
            });
        }
        else {
            res.json({
                status: "Error",
            });
        }
    })
        .catch(function () {
        return res.json({
            status: "Error",
        });
    });
});
/* ---------------------------------------------------------------------------------------
                                        THE END
-------------------------------------------------------------------------------------------*/
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "..", "client", "index.html"));
});
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
