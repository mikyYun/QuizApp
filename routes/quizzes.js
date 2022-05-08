/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

//answers route too


module.exports = (db) => {


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


  // ================== GET ==================== //

  // handling main/home page
  router.get("/", (req, res) => {

    res
      .render("quizzes",);
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

  router.get("/show", (req, res) => {
    const quizURL = req.params.shortURL;
    // const userID = req.session.user_id;

    // if (!userID) {
    //   return res.status(401).send("Please login first.");
    // }
    // const currentUser = users[userID];
    // const currentUserID = currentUser["id"];
    // const userURLs = urlsForUser(currentUserID, urlDB);

    const templateVars = {
      //need to be below if statement.
      shortURL: shortURL,
      longURL: urlDB[shortURL].longURL,
      user: currentUser,
      urls: userURLs,
    };

    if (userID !== urlDB[shortURL]["userID"]) {
      res.status(401).send("This page does not belong to you.");
    }
    res.render("urls_show", templateVars);
  });

  // ================== POST ==================== //

  app.post("/urls", (req, res) => {
    const longURL = req.body.longURL; //body inside the post request, pull the 'longURL' info.
    const shortURL = generateRandomString(); //abcde.
    const userID = req.session.user_id;
    const currentUser = users[userID];
    urlDB[shortURL] = { longURL: longURL, userID: userID };

    const templateVars = {
      //we need to pass it to 69.
      shortURL: shortURL,
      longURL: urlDB[shortURL].longURL, //saving it to the DB.
      user: currentUser,
    };

    if (!userExistsByID(userID, users)) {
      res.send("You have to login first to acces this page.");
    }
    //JC did redirect.
    res.render("urls_show", templateVars); //after mathching keys are found in the .ejs file, then it shows the values. (Rendering)
    //rendering means getting the page displayed with the values.
    // alligator: interpretes dynamic values.
  });


  router.post(  const shortURL = generateRandomString(); //abcde.
)
  return router;

};

