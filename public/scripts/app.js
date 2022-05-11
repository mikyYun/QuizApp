/* eslint-disable no-undef */
// Client facing scripts here
// ========== GARY ==========//
// $(() => {


// const { addUserAnswer } = require("../../database");

//   $("#btn").on("click", () => {

//     $.get("/api/test")
//       .then((data) => {
//         $("#belowbtn").html(data.text);

//       });
//   });
// });
// ========== GARY ==========//


$(document).ready(function () {
  // $("#create-quiz-form").submit((e) => {
  //   e.preventDefault();
  //   const question = $(".question-input").val();
  //   const answer = $(".answer-input").val();
  //   //sending data in an object format to this route
  //   $.ajax({
  //     url: 'http://localhost:8080/quizzes/create',
  //     type: 'POST',
  //     data: {
  //       question, answer
  //     },
  //     dataType: 'json',
  //   })
  //     .then((data) => {
  //       const answerContainer = $(".quiz-answers");
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  $(".alert-message").hide();

  $("#public-quiz-submit-form").submit((e) => {
    $(".alert-message").hide();

    e.preventDefault();
    const quizID = $("#public-quiz-submit-form").attr("data-id");
    const userAnswer = $(".public-input-answer").val().toLowerCase();
    console.log('this is quiz id:', quizID);
    console.log('this is user answer:', userAnswer);
    //sending data in an object format to this route

    $.ajax({ //ajax goes into the backend(quizzes.js)
      url: 'http://localhost:8080/quizzes/check',
      type: 'POST',
      data: {
        userAnswer,
        quizID
      },
      dataType: 'json',
    })
      .then((trueOrFalse) => {
        let message;
        if (trueOrFalse) {
          $("#alert-correct").slideDown();
        } else {
          $("#alert-wrong").slideDown();
        }
      })
      .then(() => {

      })
      .catch((error) => {
        console.log(error);
      });
  });

});
