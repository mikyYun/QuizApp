/* eslint-disable camelcase */
// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express(); //HAS NOTHING TO DO WITH app.js
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

// app.use(
//   "/styles",
//   sassMiddleware({
//     source: __dirname + "/styles",
//     destination: __dirname + "/public/styles",
//     isSass: false, // false => scss, true => sass
//   })
// );

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
// app.use("/api/hello", userRouter); //prefix for userRouter

app.use("/quizzes", quizzesRoutes(db));
app.use("/private", quizzesRoutes(db));

// Note: mount other resources here, using the same pattern above
// app.use("/user", userRouter);
app.use("/users", userRouter);


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// THIS WORKS
app.get("/", (req, res) => {
  res.redirect("/quizzes");
});

// THIS WORKS
// app.get("/create", (req, res) => {
//   res.render("quiz_create");
//   // res.redirect();
// });

// app.get("/private", (req, res) => {
//   res.render("quiz_private");
//   // res.redirect();
// });

// app.get("/result", (req, res) => {
//   res.render("quiz_result");
//   // res.redirect();
// });

app.get("/create", (req, res) => {
  res.render("quiz_create");
  // res.redirect();
});

app.get("/result", (req, res) => {
  console.log("APP/GET/RESULT")
  res.render("quiz_result");
  // res.redirect();
});


// GET /login
app.get('/login', (req, res) => {

  console.log("APP/GET/LOGIN")
  res.render('login');
});

app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
  req.session = null;
  res.redirect("/login"); // just redirecting WITHOUT data
});

// dinamic url must be last on the list
// otherwise it will ignore all other url request below..
app.get("/:quizURL", (req, res) => {
  console.log("url");
  console.log("APP/GET/:quizURL")
  const quizURL = req.params.quizURL;
  const templateVars = {
    //need to be below if statement.
    quizURL: quizURL,
  };

  res.render("quiz_show", templateVars);
});

// GET /login
app.get('/login', (req, res) => {
  res.render('login');
});
// app.get("/result", (req, res) => {
//   res.render("quiz_result");
//   // res.redirect();
// });


// // GET /login
// app.get('/login', (req, res) => {
//   res.render('login');
// });

app.get("/login/:user_id", (req, res) => {
  // // set encrypted cookie
  // req.session.user_id = req.pararms.user_id; // if we use cookies.
  // set plain - text cookie
  res.cookie('user_id', req.params.user_id);
  res.redirect("/");
});

app.get("/login/:user_id", (req, res) => {
  console.log("APP/GET/:USER_ID");

  // // set encrypted cookie
  // req.session.user_id = req.pararms.user_id; // if we use cookies.
  // set plain - text cookie
  res.cookie('user_id', req.params.user_id);
  res.redirect("/");
});

app.get("/api/test", (req, res) => {
  console.log("APP/GET/API/TEST")

  res.json({ text: "hello from server" });
});

//THIS IS THE ENTRY POINT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//submit

// app.post() <- will check if the answer is correct or not.
// store users answers.
// only if you want to refer to the users' answer.
