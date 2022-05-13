/* eslint-disable camelcase */
const res = require("express/lib/response");
const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "template1",
});

const getUserByName = (user_name) => {
  return pool.query(
    `SELECT id, user_name
    FROM USERS
    WHERE user_name = $1;`
    , [user_name])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};

const addPrivateQuiz = (quiz) => {
  return pool
    .query(
      `INSERT INTO quizzes(user_id, question, answer, is_public, random_string)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
  `,
      [quiz.user_id, quiz.question, quiz.answer, false, quiz.random_string])
    .then((result) => {
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
    console.log('database_getPublicID', res.rows);
    return res.rows;
  }
  );
};

const getAllPublicQuiz = () => {
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS true;
  `).then((res) => res.rows); // res.rows === quizzes in users.js
  // [{ quizid, question, answer.. }, {}, {}]
};

const getPrivateQuizID = (uuid) => {
  const sqlQuery = `
  SELECT *
  FROM quizzes
  WHERE is_public IS false
  AND quizzes.random_string = $1;
  `;
  return pool.query(sqlQuery, [uuid]).then((res) => res.rows);
};

const getAllPrivateQuiz = (user_id) => {
  return pool.query(`
  SELECT quizzes.*
  FROM quizzes
  WHERE is_public IS false
  AND user_id = $1;
  `, [user_id]).then((res) => res.rows); //res.rows === obj in quiz_private.ejs
};

const addUserAnswer = (user_id, quiz, user_answer) => {
  return pool
    .query(
      `INSERT INTO results(user_id, quiz_id, user_answer)
      VALUES($1, $2, $3)
      RETURNING *;
  `,
      [user_id, quiz.id, user_answer]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

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
      return res.rows[0].result_users; // This returns a number
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
      return res.rows[0].result_users; // number
    });
};

const getLatestHistory = (user) => {
  return pool
    .query(
      `SELECT question, answer, user_answer FROM results
      JOIN quizzes
      ON quizzes.id = quiz_id
      WHERE results.user_id = $1
      ORDER BY results.id DESC
      LIMIT 1;
      `, [user]
    ).then((res) => {
      return res.rows;
    });
};
const hadAttempted = (quiz, user_answer) => { // a row of quiz
  return pool
    .query(
      `SELECT *
      FROM results
      WHERE user_id = $1
      AND quiz_id = $2;`, // number of quiz & current user's history
      [quiz.user_id, quiz.id])
    .then((res) => { //first attempt -> empty [ {obj} ]
      if (res.rows.length === 0) {
        return false;
      } else {
        return pool
          .query(
            `UPDATE results
            SET user_answer = $3
            WHERE user_id = $1
            AND quiz_id = $2;
            `, [quiz.user_id, quiz.id, user_answer])
          .then((res) => {
            console.log('res.rows', res.rows);
            return true;
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getPublicQuizID, getAllPublicQuiz, getPrivateQuizID, getAllPrivateQuiz, addPrivateQuiz, getUserByName, addUserAnswer, correctAnswer, totalAttempts, wrongAnswer, getLatestHistory, hadAttempted };
