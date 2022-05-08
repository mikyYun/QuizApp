const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "template1",
});

const addPrivateQuiz = function (quizzes) {
  return pool
    .query(
      `INSERT INTO quizzes (user_id, quiz, answer, is_public)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,
      [quizzes.user_id, quizzes.quiz, quizzes.answer, quizzes.is_public]
    )
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
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
  return pool.query(queryStrings).then((res) => res.rows);
};

exports.getAllPrivateQuiz = getAllPrivateQuiz
