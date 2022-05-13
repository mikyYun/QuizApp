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
const { correctAnswer, getPublicQuizID, getAllPublicQuiz, getPrivateQuizID, getAllPrivateQuiz, getUserByName, addPrivateQuiz, addUserAnswer, wrongAnswer, totalAttempts, getLatestHistory, hadAttempted } = require("../database.js");
const { Pool } = require('pg/lib');

module.exports = (db) => {

  // ================== GET ==================== //

  router.get("/", (req, res) => {
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
        user_id = 1;
    }
    const user = { user_name, user_id };
    getAllPublicQuiz()
      .then((quizzes) => {
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
      .then((obj) => {
        const templateVars = {
          user,
          obj
        };
        res.render("quiz_private", templateVars);
      })
      .catch((e) => {
        console.error('err', e);
        res.send(e);
      });
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
  });


  router.get("/result/:userID", (req, res) => {
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
        user_id = 1;
    }

    const user = { user_name, user_id };

    Promise.all([
      correctAnswer(user_id), wrongAnswer(user_id), totalAttempts(user_id), getLatestHistory(user_id), getAllPublicQuiz()
    ])
      .then((nums) => {
        const numberOfPublicQuiz = nums[4].length;
        nums[4] = numberOfPublicQuiz;
        const templateVars = {
          nums,
          user,
        };
        res.render("quiz_result", templateVars);
      });
  });

  router.get("/p/:randomString", (req, res) => {
    const randomString = req.params.randomString;
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
        user_id = 1;
    }

    const user = { user_name, user_id };

    getPrivateQuizID(randomString)
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

  router.get("/:quizID", (req, res) => {
    const quizID = req.params.quizID;
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
        user_id = 1;
    }
    const user = { user_name, user_id };
    getPublicQuizID(quizID)
      .then((quiz) => {
        const oneQuiz = quiz[0];
        const oneQuestion = quiz[0].question;
        const oneAnswer = quiz[0].answer;
        getAllPublicQuiz()
          .then((allPublicQuiz) => {
            const numberOfPublicQuiz = allPublicQuiz.length;
            const templateVars = {
              user,
              oneQuiz: oneQuiz,
              oneQuestion: oneQuestion,
              oneAnswer: oneAnswer,
              numberOfPublicQuiz: numberOfPublicQuiz
            };
            res.render("quiz_show", templateVars);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // ================== POST ==================== //

  router.post("/create", (req, res) => {
    console.log(req.body, req.session.user_id);
    const question = req.body.questionInput;
    const answer = req.body.answerInput;
    const user_id = req.session.user_id;
    const random_string = generateRandomString();
    addPrivateQuiz({ question, answer, user_id, random_string })
      .then(() => {
        res.redirect('/quizzes/private');
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post("/check", (req, res) => {
    const { quizID, private } = req.body;
    const userAnswer = req.body.userAnswer;
    let user_name = req.session.user_name;
    console.log('user_name is', user_name);
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
        user_id = 1;
    }

    const user = { user_name, user_id };

    if (private === 'true') {
      getPrivateQuizID(quizID)
        .then((quiz) => {
          const oneAnswer = quiz[0].answer;
          const currentQuizID = quiz[0].id;// 16
          const trueOrFalseResult = oneAnswer.toLowerCase() === userAnswer.toLowerCase(); // true
          const trueOrFalse = { trueOrFalseResult, currentQuizID };
          hadAttempted(quiz[0], userAnswer) // check the user's history(first attempt) in our results table
            .then((hasHistory) => {
              if (hasHistory) {
                return res.send(trueOrFalse);
              } else if (hasHistory !== true) {
                addUserAnswer(user_id, quiz[0], userAnswer)
                  .then(() => res.send(trueOrFalse))
                  .catch((err) => {
                    console.log('private_addUserAnswer catch', err);
                  });
              }
            })
            .then((err) => {
              console.log('private_hadAttempted catch', err);
            });
        });
    } else {
      getPublicQuizID(quizID)
        .then((quiz) => {
          const oneAnswer = quiz[0].answer;
          const currentQuizID = quiz[0].id;
          const trueOrFalseResult = oneAnswer.toLowerCase() === userAnswer.toLowerCase();
          const trueOrFalse = { trueOrFalseResult, currentQuizID };
          hadAttempted(quiz[0], userAnswer)
            .then((hasHistory) => {
              if (hasHistory) {
                console.log(currentQuizID);
                return res.send(trueOrFalse);
              } else if (hasHistory !== true) {
                console.log("WHEREWHERE");
                addUserAnswer(user_id, quiz[0], userAnswer)
                  .then(() => res.send(trueOrFalse))
                  .catch((err) => {
                    console.log('public_addUserAnswer catch', err);
                  });
              }
            })
            .catch((err) => {
              console.log('public_hadAttempted catch', err);
            });
        });
    }
  });
  return router;
};
