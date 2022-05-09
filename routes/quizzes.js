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

  router.get("/", (req, res) => {
    // .redirect()
    const user_name = req.session.user_name
    // const user = 
    getUserByName(user_name)
    .then((user) => {
      // res.cookie('user_id', user.id);
      getAllPublicQuiz()
      .then((quizzes) => { // quiz == res.rows
        const templateVars = {
          user,
          quizzes
        };
        console.log('temp user is ', templateVars.user)
        res.render('quizzes', templateVars)
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
    });
    
    // getAllPublicQuiz()
    //   .then((quizzes) => { // quiz == res.rows
    //     const user = {}
    //     const templateVars = {
    //       user,
    //       quizzes
    //     };
    //     res.render("quizzes", templateVars);
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //     res.send(e);
    //   });


  });

  router.get("/private", (req, res) => {
    getAllPrivateQuiz()
      .then((obj) => { // quizzes == res.rows [{quiz}, {quiz}, {quiz}, {} ] arr[0]
        const user = {};
        const templateVars = {
          user,
          obj
        };
        res.render("quiz_private", templateVars);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });

  });

  router.get("/create", (req, res) => {
    const user = {};
    const templateVars = {
      user
    };
    res.render("quiz_create", templateVars);
    // .redirect(`/result`)

  });

  router.get("/quizzes/:quizURL", (req, res) => {
    const quizURL = req.params.shortURL;

    const templateVars = {
      quizURL: quizURL,
    };

    res.render("quiz_show", templateVars);
  });

  router.get("/result", (req, res) => {
    console.log('ROUTER/GET/RESULT');
    const user = {};
    const templateVars = {
      user
    };
    res.render("quiz_result", templateVars);
  });

  // handling individual quiz page
  router.get("/show", (req, res) => {
    console.log('ROUTER/GET/SHOW')

    const quizURL = req.params.shortURL;
    const userID = req.session.user_id;
  });

  router.get("/create", (req, res) => {
    res.render("quiz_create");
  });

  // ================== POST ==================== //

  router.post("/create", (req, res) => {
    // const quizURL = generateRandomString(); //abcde.
    console.log(req.body);
    const question = req.body.questionInput;
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
