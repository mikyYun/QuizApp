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
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};

const addPrivateQuiz = (quiz) => {
  console.log('HELLO', quiz);
  return pool
    // HOW DO I GRAB THE USER INPUT FROM THE SITE AND USE THAT IN THE SQL?
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
  `).then((res) => res.rows); //res.rows === quizzes in users.js
  // [{ quizid, question, answer.. } {} {}]
};

const getPrivateQuizID = (uuid) => {
  console.log('UUID', uuid);
  const sqlQuery = `
  SELECT *
  FROM quizzes
  WHERE is_public IS false
  AND quizzes.random_string = $1;
  `;
  console.log("SQL", sqlQuery);

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
  console.log('answer is "WHY IS THIS UNDEFINDED', user_answer);
  return pool
    .query(
      `INSERT INTO results(user_id, quiz_id, user_answer)
      VALUES($1, $2, $3)
      RETURNING *;
  `,
      [user_id, quiz.id, user_answer]
      //answer.id refers to quiz.id
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
      // console.log('correct answer number: ', res.rows[0].result_users);
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
      // console.log('wrong answer number: ', res.rows[0].result_users);
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
      // console.log('total attmept number: ', res.rows[0].result_users);
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
      LIMIT 10;
      `, [user]
    ).then((res) => {
      return res.rows;
    });
};

const findSubmitedAnswer = (user) => {
  return pool
    .query('', [user]
    ).then((res) => res.rows)
}


module.exports = { getPublicQuizID, getAllPublicQuiz, getPrivateQuizID, getAllPrivateQuiz, addPrivateQuiz, getUserByName, addUserAnswer, correctAnswer, totalAttempts, wrongAnswer, getLatestHistory };
