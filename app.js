const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// load config
dotenv.config({
  path: "./config/config.env",
});

// passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// view engine
app.use(expressEjsLayouts);
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");

// express session
app.use(
  session({
    secret: "dog",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// static folder
app.use(express.static(`${__dirname}/public`));

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 3000;

app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${port}`)
);