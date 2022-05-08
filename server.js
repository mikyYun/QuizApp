// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
// const cookieSession = require("cookie-session");
// const bodyParser = require("body-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

// MODULARIZE
const createUserRouter = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const userRouter = createUserRouter(db);
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/hello", userRouter); //prefix for userRouter
// app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

// GET /login/2

app.get("/login/:user_id", (req, res) => {
  // set encrypted cookie
  // req.session.user_id = req.pararms.user_id; // if we use cookies.
  // set plain-text cookie
  //res.cookie('user_id', req.params.user_id)
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//submit

// app.post() <- will check if the answer is correct or not.
// store users answers.
// only if you want to refer to the users' answer.
