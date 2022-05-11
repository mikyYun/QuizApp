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
  urlsForUser,
} = require("../helpers.js");
const { correctAnswer, getPublicQuizID, getAllPublicQuiz, getPrivateQuizID, getAllPrivateQuiz, getUserByName, addPrivateQuiz, addUserAnswer, wrongAnswer, totalAttempts, getLatestHistory } = require("../database.js");
const { Pool } = require('pg/lib');

module.exports = (db) => {

  // ================== GET ==================== //

  router.get("/", (req, res) => {
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    const user = { user_name, user_id };

    getAllPublicQuiz()
      .then((quizzes) => { // quizzes == res.rows
        const templateVars = {
          user,
          quizzes
        };
        res.render('quizzes', templateVars);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.get("/private", (req, res) => {
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    const user = { user_name, user_id };
    getAllPrivateQuiz(user_id)
      .then((obj) => { // quizzes == res.rows [{quiz}, {quiz}, {quiz}, {} ] arr[0]
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
    // });
  });

  router.get("/create", (req, res) => {
    console.log("ROUTER/GET/CREATE");
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    const user = { user_name, user_id };
    const templateVars = {
      user
    };
    res.render("quiz_create", templateVars);
    // })
    // .catch((e) => {
    //   console.error(e);
    //   res.send(e);
    // });
  });


  router.get("/result", (req, res) => {
    console.log('ROUTER/GET/RESULT');
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    const user = { user_name, user_id };

    Promise.all([
      correctAnswer(user_id), wrongAnswer(user_id), totalAttempts(user_id), getLatestHistory(user_id)
    ])
      .then((nums) => {

        console.log("nums", nums);
        const templateVars = {
          nums,
          user
        };
        res.render("quiz_result", templateVars);
      });
  });

  router.get("/quizzes/:randomString", (req, res) => {
    const randomString = req.params.randomString;
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    const user = { user_name, user_id };

    getPrivateQuizID(randomString) // a1b2c3
      .then((quiz) => {
        const oneQuiz = quiz[0];
        const oneQuestion = quiz[0].question;
        const oneAnswer = quiz[0].answer;
        const oneString = quiz[0].random_string;

        const templateVars = {
          user,
          oneQuiz: oneQuiz,
          oneQuestion: oneQuestion,
          oneAnswer: oneAnswer,
          oneString: oneString
        };
        res.render("quiz_show_private", templateVars);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  // handling individual quiz page
  router.get("/:quizID", (req, res) => {
    const quizID = req.params.quizID;
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    const user = { user_name, user_id };
    console.log("req.params", req.params);
    console.log("is_quizID", quizID); //WHY IS THIS UNDEFINED?
    getPublicQuizID(quizID)
      .then((quiz) => {
        const oneQuiz = quiz[0];
        const oneQuestion = quiz[0].question;
        const oneAnswer = quiz[0].answer;

        const templateVars = {
          user,
          oneQuiz: oneQuiz,
          oneQuestion: oneQuestion,
          oneAnswer: oneAnswer,
        };
        res.render("quiz_show", templateVars);
      })
      .catch((error) => {
        console.log(error);
      });
    // };
  });


  // ================== POST ==================== //

  router.post("/create", (req, res) => { //LOGED IN USER ONLY.
    console.log(req.body, req.session.user_id);
    const question = req.body.questionInput;
    const answer = req.body.answerInput;
    const user_id = req.session.user_id;
    // console.log('body is', question, answer)
    const random_string = generateRandomString(); //returns string 'x1y2z3'
    addPrivateQuiz({ question, answer, user_id, random_string }) // finish inserting
      .then(() => {
        res.redirect('/quizzes/private'); // list of private quizzes
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post("/check", (req, res) => {
    const { userAnswer, quizID } = req.body;
    console.log('check-quiz', quizID);// ok
    // const quizID = req.params.quizID;
    // console.log("TEST", quizID); // ok
    const user_name = req.session.user_name;
    const user_id = req.session.user_id;
    // const user = { user_name, user_id };
    // want to return the value of getPublicQuizID(quizID) to the second then
    if (quizID >= 17) { //all private quiz
      console.log('quizID is larger than 17');
      getPrivateQuizID(quizID) // return res.rows [{}]
        // getPrivateQuizID(quizID) // return res.rows [{}]
        .then((quiz) => {
          console.log('QUIZ', quiz);
          addUserAnswer(quiz[0], userAnswer, user_id)
            .then(() => {
              console.log('userAnswer: ', userAnswer);
              const oneAnswer = quiz[0].answer;

            })
            .then((trueOrFalse) => {
              res.send(trueOrFalse); //returns object { t/f, nextQuizID }
            })
            .catch((err) => {
              console.log(err);
              res.send('error addUserAnswer', err);
            });
        }).catch((err) => {
          console.log("err ", err);
          res.send('error getPublicQuiz', err);
        });

    } else {
      getPublicQuizID(quizID) // return res.rows [{}]
        .then((quiz) => {
          addUserAnswer(quiz[0], userAnswer, user_id)
            .then(() => {
              console.log('userAnswer: ', userAnswer);
              console.log('quiz[0] is', quiz[0]);
              const oneAnswer = quiz[0].answer;
              if (quiz[0].id < 17) { //public quizzes
                const currentQuizID = quiz[0].id;// 16
                const trueOrFalseResult = oneAnswer.toLowerCase() === userAnswer.toLowerCase(); // true
                console.log('currentQuizID', currentQuizID);
                return { trueOrFalseResult, currentQuizID };
              } else if (quiz[0].id === 17) {
                console.log('QUIZZES.JS - This is the 17th');
              }
            })
            .then((trueOrFalse) => {
              res.send(trueOrFalse);
            })
            .catch((err) => {
              console.log(err);
              res.send('error addUserAnswer', err);
            });
        }).catch((err) => {
          console.log("err ", err);
          res.send('error getPublicQuiz', err);
        });
    }
  });
  return router;
};
