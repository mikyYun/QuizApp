/* eslint-disable no-undef */
// Client facing scripts here

$(document).ready(function () {
  //============= INDIVIDUAL PUBLIC QUIZ PAGE ==================//
  $(".alert-message").hide();

  $("#public-quiz-submit-form").submit((e) => {
    $(".alert-message").hide();

    e.preventDefault();
    const quizID = $("#public-quiz-submit-form").attr("data-id");
    const userAnswer = $(".public-input-answer").val().toLowerCase();
    console.log('this is PUBLIC quiz id:', quizID);
    console.log('this is PUBLIC user answer:', userAnswer);
    //sending data in an object format to this route

    $.ajax({ //ajax goes into the backend(quizzes.js)
      url: 'http://localhost:8080/quizzes/check',
      type: 'POST',
      data: {
        userAnswer, //ok
        quizID, //ok
        private: false
      },
      dataType: 'json',
    })
      .then((resultAndID) => {
        if (resultAndID.trueOrFalseResult) { //true
          if (resultAndID.currentQuizID <= 17) {
            let currentQuizID = resultAndID.currentQuizID; //16
            currentQuizID = currentQuizID + 1; //17

            $("#alert-correct").slideDown(); //correct or wrong
            // if (resultAndID.currentQuizID !== 17) {
            if (resultAndID.currentQuizID === 17) {
              setTimeout(() => {
                window.location.href = '/quizzes';
              }, 1000)
            } else {
              setTimeout(() => {
                window.location.href = `/quizzes/${currentQuizID}`;
                //send them to the next page
              }, 1000);
            }
            // }
          }
          // else if (resultAndID.currentQuizID === 17) {
          //   console.log('APP.JS -this is the last quiz');
          // }
        } else {
          $("#alert-wrong").slideDown(); //correct or wrong
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //============= INDIVIDUAL PRIVATE QUIZ PAGE ==================//

  $(".alert-message").hide();

  $("#private-quiz-submit-form").submit((e) => {
    $(".alert-message").hide();

    e.preventDefault();
    const quizID = $("#private-quiz-submit-form").attr("data-id");
    const userAnswer = $(".private-input-answer").val().toLowerCase();
    console.log('this is PRIVATE quiz id:', quizID);
    console.log('this is PRIVATE user answer:', userAnswer);
    //sending data in an object format to this route

    $.ajax({ //ajax goes into the backend(quizzes.js)
      url: 'http://localhost:8080/quizzes/check',
      type: 'POST',
      data: {
        userAnswer,
        quizID,
        private: true
      },
      dataType: 'json',
    })
      .then((resultAndID) => {
        if (resultAndID.trueOrFalseResult) { //true
          $("#alert-correct").slideDown(); //correct or wrong
          setTimeout(() => {
          }, 1000);
        } else {
          $("#alert-wrong").slideDown(); //correct or wrong
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //================== RESULT PAGE ===================//
  $('.rank').on('click', () => {
    $('.history_box_title').slideToggle('slow');
    $('.history').slideToggle('slow');
  });

  //================== SESSION END ===================//
  $(window).on("unload", function (e) {
    console.log(e);
    alert(e);
  });
});
