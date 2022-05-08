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

  // router.get("/", (req, res) => {
  //   res.render("quizzes");


  // res.render("quizzes", {}); //templateVars

  // let query = `SELECT * FROM quizzes`;
  // console.log(query);
  // db.query(query)
  //   .then(data => {
  //     const quizzes = data.rows;
  //     ///template vars and render instead of res.render
  //     // res.render("", {res.row})
  //   })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //   });


  // });

  // handling main/home page
  router.get("/", (req, res) => {

    res
      .render("quizzes",);
    // .redirect()
  });

  // handling create quiz page
  router.get("/create", (req, res) => {

    res.render("quiz_create",);
    // .redirect(`/result`)
  });

  router.get("/result", (req, res) => {

    res.render("quiz_result");

  });
  return router;
};
