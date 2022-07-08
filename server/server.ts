import express, { Express } from "express";
import compression from "compression";
import cookieSession from "cookie-session";
import path from "path";

import bodyParser from "body-parser";

// @ts-ignore
// export const app: Express = express();
const app = express();

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

const { verifyingEmptyInputs, registerNewUser } = require("./process");

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

// app.use(bodyparser.json());
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

app.post("/registration.json", (req, res) => {
    // here the responds

    console.log("req.body", req.body);
    const { name, surname, email, password } = req.body;
    if (name === "" || surname === "" || email === "" || password === "") {
        res.json({
            Status: "Error",
        });
    } else {
        // All file has some input.
        registerNewUser(req.body);
    }
    res.json({
        Status: "Success",
    });

    console.log("Getting Home info");
    console.log("req.body", req.body);
    // Verify the empty Strings!   Empty inputs are not valid"
    if (verifyingEmptyInputs(req.body)) {
        res.json({
            Status: "Error",
        });
    } else {
        registerNewUser(req.body)
            .then((currentUser: { id: number }) => {
                console.log("currentUser", currentUser);

                if (req.session) req.session.userId = currentUser.id;

                res.json({
                    Status: "Error",
                });
            })
            .catch(() => {
                res.json({
                    Status: "Error",
                });
            });
    }
});

app.get("/logout", (req, res) => {
    console.log("I am in Logout, we clear the cookies");
    req.session = null;
    // res.redirect("/login");
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session && req.session.userId,
    });
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
