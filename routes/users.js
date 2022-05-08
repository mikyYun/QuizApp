/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { getUserByName } = require("../database.js");

module.exports = (db) => {
  // router.get("/ping", (req, res) => {
  //   res.send("pong!");
  // });
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    getUserByName(req.body)
      .then((user) => {
        res.cookie('user_id', user.id);
      });
  });
  return router;
};
