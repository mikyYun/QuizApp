/* eslint-disable camelcase */
// MOON IS WORKING ON THIS

const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "template1",
});

const getUserByName = (user) => {
  return pool.query(
    `SELECT user_name
   FROM USERS
   WHERE user_name = $1;`
    , [user.login_name])
    // WHERE user_name = $1;`
    // , [user.username])
    // , [user.username])
    .then((result) => {
      console.log(result.rows[0]);
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
      `INSERT INTO quizzes(user_id, quiz, answer, is_public)
      VALUES($1, $2, $3, $4)
      RETURNING *;
  `,
      [quiz.user_id, quiz.question, quiz.answer, true]
    )
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getAllPrivateQuiz = (payload) => {

  return pool.query(`
  SELECT quizzes.*
    FROM quizzes
  WHERE is_public IS false AND user_id = $1;
  `, [payload.user_id]
  )
    .then((res) => res.rows);
};

const getAllPublicQuiz = (options) => {
  let queryString = `
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS true;
  `;
  return pool.query(queryString).then((res) => res.rows);
};


module.exports = { getAllPrivateQuiz, getAllPublicQuiz, addPrivateQuiz, getUserByName };
