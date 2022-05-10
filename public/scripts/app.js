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

  $("#public-quiz-submit-form").submit((e) => {
    e.preventDefault();
    const quizID = $("#public-quiz-submit-form").attr("data-id");
    const userAnswer = $(".public-input-answer").val().toLowerCase();
    console.log('this is quiz id:', quizID);
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
      .then((boolean) => {
        console.log("app.js TTTTTTTTTTT")
        let message;
        if (boolean) {
          message = "you got it right!";
        } else {
          message = "you got it wrong!";
        }
        const $quizResult = $(`<p>${message}</p>`);
        $(".public-quiz-result").append($quizResult);
        
        })
      .catch((error) => {
        console.log(error);
      });
  });

});
