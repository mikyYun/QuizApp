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
      console.log('database getUserByName', result.rows);
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
    console.log('database_getPublicQID', res.rows);
    return res.rows;
  });
};

const getAllPublicQuiz = () => {
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
  console.log('test:::', user_id);
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS false
  AND user_id = $1;
  `, [user_id]).then((res) => res.rows); //res.rows === quizzes in users.js
};
// from line 64 in the where clause: AND user_id = $1
// from line 65, [payload.user_id]

const addUserAnswer = (answer, user_answer) => {
  console.log('answer is', answer);
  return pool
    .query(
      `INSERT INTO results(user_id, quiz_id, user_answer)
      VALUES($1, $2, $3)
      RETURNING *;
  `,
      [answer.user_id, answer.id, user_answer]
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


// SELECT COUNT(quizzes.) AS result_users
// FROM quizzes
// JOIN results ON quizzes.id = results.quiz_id
// WHERE results.user_id = $1
// AND results.user_answer = quizzes.answer;

const correctAnswer = (user) => {
  return pool
    .query(
      `SELECT COUNT(quizzes.*) AS result_users
      FROM quizzes
      JOIN results ON quizzes.id = results.quiz_id
      WHERE results.user_id = $1
      AND results.user_answer = quizzes.answer;
      `, [user])
    .then((res) => {
      console.log('correct answer number: ', res.rows[0].result_users);
      return res.rows[0].result_users; // number
    }
    );
};
const wrongAnswer = (user) => {
  return pool
    .query(
      `SELECT COUNT(quizzes.*) AS result_users
      FROM quizzes
      JOIN results ON quizzes.id = results.quiz_id
      WHERE results.user_id = $1
      AND results.user_answer != quizzes.answer;
      `, [user])
    .then((res) => {
      console.log('wrong answer number: ', res.rows[0].result_users);
      return res.rows[0].result_users; // number
    });
};

const totalAttempts = (user) => {
  return pool
    .query(
      `SELECT COUNT(quizzes.*) AS result_users
      FROM quizzes
      JOIN results ON quizzes.id = results.quiz_id
      WHERE results.user_id = $1;
        `, [user])
    .then((res) => {
      console.log('total attmept number: ', res.rows[0].result_users);
      return res.rows[0].result_users; // number
    });
};

module.exports = { getPublicQuizID, getAllPublicQuiz, getPrivateQuizID, getAllPrivateQuiz, addPrivateQuiz, getUserByName, addUserAnswer, correctAnswer, totalAttempts, wrongAnswer };
