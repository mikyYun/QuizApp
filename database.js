/* eslint-disable camelcase */
// MOON IS WORKING ON THIS

const res = require("express/lib/response");
const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "template1",
});

const getUserByName = (user_name) => {
  return pool.query( //IT RETURNS A PROMISE
    `SELECT id, user_name
   FROM USERS
   WHERE user_name = $1;`
    , [user_name])
    // , [user.login_name])
    // WHERE user_name = $1;`
    // , [user.username])
    // , [user.username])
    .then((result) => {
<<<<<<< HEAD
      console.log('database getUserByName', result.rows);
=======
      // console.log('database getUserByName',result.rows);
>>>>>>> 7651073346e38c23b597c1c73607f38a33cef2c1
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
      [quiz.user_id, quiz.question, quiz.answer, false]
    )
    .then((result) => {
      // console.log('addPrivateQuiz', result.rows);
      // console.log('result', result)
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getPublicQuizID = (quizID) => {
  return pool.query(`
  SELECT *
  FROM quizzes
  WHERE is_public IS true AND quizzes.id = $1
  `, [quizID]).then((res) => {
<<<<<<< HEAD
    res.rows;
  });

=======
    console.log('database_getPublicQID', res.rows);
    return res.rows});
>>>>>>> 7651073346e38c23b597c1c73607f38a33cef2c1
};

const getAllPublicQuiz = (options) => {
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS true;
  `).then((res) => res.rows); //res.rows === quizzes in users.js
};

const getPrivateQuizID = (quizID) => {
  return pool.query(`
  SELECT *
  FROM quizzes
  WHERE is_public IS false AND quizzes.id = $1
  `, [quizID]).then((res) => res.rows);
};

const getAllPrivateQuiz = (user_id) => {
<<<<<<< HEAD
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS false;
=======
  console.log('test:::', user_id)
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS false
  AND user_id = $1;
>>>>>>> 7651073346e38c23b597c1c73607f38a33cef2c1
  `, [user_id]).then((res) => res.rows); //res.rows === quizzes in users.js
};
// from line 64 in the where clause: AND user_id = $1
// from line 65, [payload.user_id]

const addUserAnswer = (answer) => {
  // console.log('answer', answer);
  return pool
    // HOW DO I GRAB THE USER INPUT FROM THE SITE AND USE THAT IN THE SQL?
    .query(
      `INSERT INTO results(user_id, quiz_id, user_answer)
      VALUES($1, $2, $3)
      RETURNING *;
  `,
      [answer.user_id, answer.quiz_id, answer.user_answer]
    )
    .then((result) => {
      // console.log('addPrivateQuiz', result.rows);
      // console.log('result', result)
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}


module.exports = { getPublicQuizID, getAllPublicQuiz, getPrivateQuizID, getAllPrivateQuiz, addPrivateQuiz, getUserByName, addUserAnswer };
