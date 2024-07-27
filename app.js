if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Project = require("./models/project");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const initializePassport = require("./passport-config.js");

const projectRouter = require("./routes/project.js");
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");
const emailRouter = require("./routes/email.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("connection successfull");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

initializePassport(passport);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on('error', (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/", (req, res) => {
//     res.send("done");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.showNavbar = false;            //default value
    res.locals.showAdminNavbar = false;
    next();
});

app.use("/projects", projectRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/", emailRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    console.log(err);
    let { statusCode = 500, message = "something went wrong ig" } = err;
    res.status(statusCode).render("pages/Error.ejs", { err });
});

app.listen(8080, () => {
    console.log("listening to port");
});