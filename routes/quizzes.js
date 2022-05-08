/* eslint-disable camelcase */
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

const { addPrivateQuiz, getAllPrivateQuiz, getAllPublicQuiz, getUserByName } = require("../database.js");
const { Pool } = require('pg/lib');

//=============GLOBAL OBJECTS================//

// const quizDB = res.rows
// const userDB =


module.exports = (db) => {

  // ================== GET ==================== //

  // handling main/home page
  router.get("/", (req, res) => {
    // .redirect()
    getAllPublicQuiz()
      .then((quizzes) => { // quiz == res.rows
        const templateVars = {
          quizzes
        };
        res.render("quizzes", templateVars);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  // handling create quiz page
  router.get("/create", (req, res) => {
    res.render("quiz_create");
    // .redirect(`/result`)
  });

  router.get("/result", (req, res) => {
    res.render("quiz_result");
  });

  // handling individual quiz page
  router.get("/show", (req, res) => {
    const quizURL = req.params.shortURL;
    const userID = req.session.user_id;

  });

  // use app.get instead router.get (in server.js)
  // router.get("/login", (req, res) => {
  //   res.render('login')
  // })

  // ================== POST ==================== //

  router.post("/create", (req, res) => {
    // const userId = req.session.userId;
    // if (!userId) {
    //   res.redirect("/urls");
    //   return; //END
    // }
    console.log(req.body);
    const question = req.body.quizInput;
    const answer = req.body.answerInput;
    addPrivateQuiz({ question, answer, user_id: 1 })
      .then((quiz) => {
        res.send(quiz);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post('/quizzes', (req, res) => {
    console.log('quizzes test');
  });

  router.post('/login', (req, res) => {
    console.log(req.body);
  });



  //  ================== DO NOT TOUCH BELOW  ==================//

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
  return router;

};

