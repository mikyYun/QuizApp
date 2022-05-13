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
    const user = req.body.login_name;
    getUserByName(user)
      .then((user) => {
        req.session['user_name'] = user.user_name;
        req.session['user_id'] = user.id;
        res.redirect('/quizzes');
      });
  });
  return router;
};
