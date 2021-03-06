/* eslint-disable camelcase */

// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express(); //HAS NOTHING TO DO WITH app.js
const morgan = require("morgan");
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); // SHOWS STYLING IN EJS

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

// MODULARIZE
const createUserRouter = require("./routes/users");
const { port } = require("pg/lib/defaults");
const quizzesRoutes = require("./routes/quizzes"); // IMPORTING ROUTES
const userRouter = createUserRouter(db);

// Mount all resource routes

// Note: Feel free to replace the example routes below with your own

app.use("/quizzes", quizzesRoutes(db));

// Note: mount other resources here, using the same pattern above
app.use("/users", userRouter);


// Home page

// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.redirect("/quizzes");
});

app.get('/login', (req, res) => {

  const templateVars = {
    user: ''
  };
  res.render('login', templateVars);
});

app.post("/logout", (req, res) => {
  console.log(req.session);
  req.session = null;
  console.log(req.session);
  res.redirect("/quizzes"); // just redirecting WITHOUT data
});


// dinamic url must be last on the list
// otherwise it will ignore all other url request below..
// localhost/something

app.get("/:quizURL", (req, res) => {
  const user_name = req.session.user_name;
  const user_id = req.session.user_id;
  const user = { user_name, user_id };
  const quizURL = req.params.quizURL;
  const templateVars = {
    quizURL: quizURL,
    user
  };

  res.render("quiz_show", templateVars);
});

app.get("/login/:user_id", (req, res) => {
  console.log("APP/GET/:USER_ID");
  res.cookie('user_id', req.params.user_id);
  res.redirect("/");
});

app.get("/api/test", (req, res) => {

  res.json({ text: "hello from server" });
});

//THIS IS THE ENTRY POINT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
