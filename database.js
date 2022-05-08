const addQuiz = function (quizzes) {
  return pool
    .query(
      `INSERT INTO quizzes (user_id, quiz, answer, is_public)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,
      //USED FOR ADDING, UPDATING ^
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
exports.addUser = addQuiz;
