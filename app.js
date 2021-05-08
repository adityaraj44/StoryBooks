const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
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

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ejs helper
const { formatDate } = require("./helper/ejs");

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

// set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// static folder
app.use(express.static(`${__dirname}/public`));

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const port = process.env.PORT || 3000;

app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${port}`)
);
