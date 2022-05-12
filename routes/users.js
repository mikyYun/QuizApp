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
  router.post("/login", (req, res) => {
    console.log("ROUTER/POST/LOGIN");
    // console.log(req.body)
    // const { username, password } = req.body;
    const user = req.body.login_name;
    // console.log('postlogin', user);
    // console.log('req.body is ',req.body)
    getUserByName(user)
      .then((user) => {
        console.log('this is user', user);
        req.session['user_name'] = user.user_name;
        req.session['user_id'] = user.id;
        // res.cookie('user_id', user.id);
        getAllPublicQuiz()
          .then((quizzes) => { // quiz == res.rows
            const templateVars = {
              user,
              quizzes
            };
            // console.log('temp user is ', templateVars.user)
            res.render('quizzes', templateVars)
          });
      });
  })
  return router;
};
