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
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
      user_id = 1
    }
    const user = { user_name, user_id };
  /**
   * if every user use the same name,
   * 
   */


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
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',// randomStr()
      user_id
    }
    console.log('user_id', user_id)
    console.log('user_name', user_name)

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
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
      user_id = 1
    }
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

  // get/quizzes/:quizID <- this is our RESTful route
  //  post/quizzes/:quizID/results
  // handling individual quiz page
  router.get("/:quizID", (req, res) => {
    const quizID = req.params.quizID;
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
      user_id = 1
    }
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
    const { quizID, private } = req.body;
    console.log("REQ.BODY", req.body);
    const userAnswer = req.body.userAnswer; //it's a string.
    // console.log('check-quiz why is this undefined?', quizID);// ok
    // const quizID = req.params.quizID;
    // console.log("TEST", quizID); // ok
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    if (user_id === undefined) {
      user_name = 'visitor',
      user_id = 1
    }
    // const user = { user_name, user_id };
    // want to return the value of getPublicQuizID(quizID) to the second then
    if (private === 'true') { //all private quiz
      getPrivateQuizID(quizID) // return res.rows [{}]
        .then((quiz) => {
          console.log("USER ID ", user_id);
          console.log("quiz0", quiz[0]);
          console.log("UA", userAnswer);
          addUserAnswer(user_id, quiz[0], userAnswer)
            .then(() => {
              const nextUUID = quiz[0].randomString;
              const oneAnswer = quiz[0].answer;
              const currentQuizID = quiz[0].id;// 16
              const trueOrFalseResult = oneAnswer.toLowerCase() === userAnswer.toLowerCase(); // true
              return { trueOrFalseResult, currentQuizID };
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
          // console.log("QUIZ ID", quizID);
          // console.log("QUIZ", quiz);

          addUserAnswer(quiz[0], userAnswer, user_id)
            .then(() => {

              // quiz [  { id: question: answer } ]

              const oneAnswer = quiz[0].answer;
              if (quiz[0].id <= 17) { //public quizzes
                const currentQuizID = quiz[0].id;// 16
                const trueOrFalseResult = oneAnswer.toLowerCase() === userAnswer.toLowerCase(); // true
                // if (quiz[0].id !== 17) {
                  return { trueOrFalseResult, currentQuizID };
                // }
                // console.log('171717171717')
                // return 
              } 
              // else if (quiz[0].id === 17) {
              //   console.log('QUIZZES.JS - This is the 17th');
              //   res.redirect('/quizzes')
              // }
            })
            .then((trueOrFalse) => {
              // send trueOrFalse to app.js
              // ajax .....then((here))
              res.send(trueOrFalse);
            })
            .catch((err) => {
              console.log(err);
              res.send('error addUserAnswer', err);
            });
        }).catch((err) => {
          console.log("err ", err);
          res.send('this is an error for getPublicQuiz', err);
        });
    }
  });
  return router;
};
