/* eslint-disable camelcase */
// MOON IS WORKING ON THIS

const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "template1",
});

const getUserByName = (user_name) => {
  return pool.query(
    `SELECT user_name
   FROM USERS
   WHERE user_name = $1;`
    , [user_name])
    // , [user.login_name])
    // WHERE user_name = $1;`
    // , [user.username])
    // , [user.username])
    .then((result) => {
      console.log('database getUserByName',result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};

const addPrivateQuiz = (quiz) => {
  console.log(quiz);
  return pool
    // HOW DO I GRAB THE USER INPUT FROM THE SITE AND USE THAT IN THE SQL?
    .query(
      `INSERT INTO quizzes(user_id, question, answer, is_public)
      VALUES($1, $2, $3, $4)
      RETURNING *;
  `,
      [1, quiz.question, quiz.answer, false]
    )
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getAllPublicQuiz = (options) => {
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS true;
  `).then((res) => res.rows); //res.rows === quizzes in users.js
};

const getAllPrivateQuiz = (options) => {
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS false;
  `).then((res) => res.rows); //res.rows === quizzes in users.js
};
// from line 64 in the where clause: AND user_id = $1
// from line 65, [payload.user_id]
module.exports = { getAllPrivateQuiz, getAllPublicQuiz, addPrivateQuiz, getUserByName };
