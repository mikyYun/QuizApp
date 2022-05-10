/* eslint-disable no-undef */
// Client facing scripts here
//jQuery
//ajax.
//$

// ========== GARY ==========//
// $(() => {

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
  //   //sending datat in an object format to this route
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
    const answer = $(".public-input-answer").val();
    const quizID = $("#public-quiz-submit-form").attr("data-id");
    console.log(quizID);
    //sending datat in an object format to this route
    $.ajax({
      url: 'http://localhost:8080/quizzes/check',
      type: 'POST',
      data: {
        answer,
        quizID
      },
      dataType: 'json',
    })
      .then((data) => {
        const answerContainer = $(".public-answers");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

});
