const express = require("express");
const app = express();
// const app: Express.Application = express();

const compression = require("compression");
const path = require("path");

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const {
    cleanEmptySpaces,
    verifyingEmptyInputs,
    registerNewUser,
} = require("./process");

app.use(compression());

app.use(
    cookieSession({
        /* This is use to generate the signature of the encryption. 
        When we recived the cookie, if the signature is not the same that we generate,
        we assume that the cookie was tempted and we distro it. */
        secret: COOKIE_SECRET,
        // How much the cookie is going to live.
        maxAge: 1000 * 60 * 60 * 24 * 14,

        // So that the cookies can only use in the same page, can not be modify form another
        sameSite: true,
    })
);

// For Protection propose
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});

// If we deploy.
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

app.use((req, res, next) => {
    console.log("---------------------");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    console.log("req.session:", req.session);
    console.log("---------------------");
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

/* -----------------------------------------------------------------------------------------------------
                    GET
------------------------------------------------------------------------------------------------------*/

app.get("/registration", (req, res) => {
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
        const userInfo = cleanEmptySpaces(req.body);
        console.log("userInfo clean", userInfo);
        registerNewUser(userInfo)
            .then((currentUser: { id: number }) => {
                console.log("currentUser", currentUser);

                req.session.userId = currentUser.id;

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
        userId: req.session.userId,
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
