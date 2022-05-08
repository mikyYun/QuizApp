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
  router.get("/", (req, res) => {
    res.render("quizzes", {}); //templateVars

    // let query = `SELECT * FROM quizzets`;
    // console.log(query);
    // db.query(query)
    //   .then(data => {
    //     const quizzes = data.rows;
    //     ///template vars and render instead of res.render
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  });
  return router;
};
