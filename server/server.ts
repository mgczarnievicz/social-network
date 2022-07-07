const express = require("express");
const app = express();

const compression = require("compression");
const path = require("path");

// Bc we are deploying we need to define where to get the value.
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets").COOKIE_SECRET;

const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

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
RUTAS
------------------------------------------------------------------------------------------------------*/

app.get("/registration", (req, res) => {
    // here the responds
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
