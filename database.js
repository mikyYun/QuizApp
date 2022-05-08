// MOON IS WORKING ON THIS

const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "template1",
});

const addPrivateQuiz = function (quiz) {
  return pool
    // HOW DO I GRAB THE USER INPUT FROM THE SITE AND USE THAT IN THE SQL?
    .query(
      `INSERT INTO quizzes (user_id, quiz, answer, is_public DEFAULT false;)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,
      [quiz.user_id, quiz.question, quiz.answer, quiz.is_public]
    )
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addPrivateQuiz = addPrivateQuiz;


const getAllPrivateQuiz = function (options, limit) {

  let queryString = `
  SELECT quizzes.*,
  FROM quizzes
  WHERE is_public IS false;
  `;
  return pool.query(queryString).then((res) => res.rows);
};

exports.getAllPrivateQuiz = getAllPrivateQuiz
