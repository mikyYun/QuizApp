/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

//answers route too

const {
  generateRandomString,
  userExistsByID,
  urlsForUser,
} = require("../helpers.js");

//=============GLOBAL OBJECTS================//

const quizDB = res.rows
const userDB = 
module.exports = (db) => {

  // ================== GET ==================== //

  // handling main/home page
  router.get("/", (req, res) => {
    res.render("quizzes",);
    // .redirect()
  });

  // handling create quiz page
  router.get("/create", (req, res) => {
    res.render("quiz_create",);
    // .redirect(`/result`)
  });

  router.get("/result", (req, res) => {
    res.render("quiz_result");
  });

  // handling individual quiz page
  router.get("/show", (req, res) => {
    const quizURL = req.params.shortURL;
    const userID = req.session.user_id;

    if (!userID) {
      return res.status(401).send("Please login first.");
    }
    const currentUser = users[userID];
    // const currentUserID = currentUser["id"];
    const userURLs = urlsForUser(currentUserID, urlDB);

    const templateVars = {
      //need to be below if statement.
      shortURL: shortURL,
      longURL: urlDB[shortURL].longURL,
      user: currentUser,
      urls: userURLs,
    };

    if (userID !== urlDB[quizURL]["userID"]) {
      res.status(401).send("This page does not belong to you.");
    }
    res.render("quiz_show", templateVars);
  });

  // ================== POST ==================== //

  router.post("/create", (req, res) => {
    const userID = req.session.user_id;
    const quizURL = generateRandomString(); //abcde.
    if (!userExistsByID(userID, users)) {
      res.send("You have to login first to shorten URLS.");
    }
    urlDB[quizURL] = { userID: userID };
    //how do i grab the data from the database?

    const currentUser = users[userID];
    const currentUserID = currentUser["id"];
    const userURLs = urlsForUser(currentUserID, urlDB);

    const templateVars = {
      //need to be below if statement.
      shortURL: shortURL,
      longURL: urlDB[shortURL].longURL,
      user: currentUser,
      urls: userURLs,
    };
    //****** adding the short url, long url, and user id to the data base
    res.render("urls_show", templateVars);
  });






  //  ================== DO NOT TOUCH BELOW  ==================//
  return router;

  // ================== GARY ==================== //
  /*
  router.get("/", (req, res) => {
    res.render("quizzes");


  res.render("quizzes", {}); //templateVars

  let query = `SELECT * FROM quizzes`;
  console.log(query);
  db.query(query)
    .then(data => {
      const quizzes = data.rows;
      ///template vars and render instead of res.render
      // res.render("", {res.row})
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });


  });
  */

};

