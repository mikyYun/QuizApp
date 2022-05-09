/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { getUserByName, getAllPublicQuiz } = require("../database.js");

const { Pool } = require('pg/lib');

module.exports = (db) => {
  // router.get("/ping", (req, res) => {
  //   res.send("pong!");
  // });
  // router.get("/", (req, res) => {
  //   // .redirect()
  //   getAllPublicQuiz()
  //     .then((quizzes) => { // quiz == res.rows
  //       const templateVars = {
  //         quizzes
  //       };
  //       res.render("users", templateVars);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       res.send(e);
  //     });
  // });

  router.post("/login", (req, res) => {
    console.log("ROUTER/POST/LOGIN")
    // console.log(req.body)
    // const { username, password } = req.body;
    const user = req.body
    console.log('req.body is ',req.body)
    getUserByName(user)
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
      });
    });
  });
  return router;
};
