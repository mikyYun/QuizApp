// Client facing scripts here
//jQuery
//ajax.
//$

// ========== GARY ==========//
$(() => {

  $("#btn").on("click", () => {

    $.get("/api/test")
      .then((data) => {
        $("#belowbtn").html(data.text);

      });
  });
});
// ========== GARY ==========//


//1. create
const createQuiz= function (data) {
  const { user, content, createdAt } = data; //destructuring //
  // we don't have to constantly write data.user.name;
  const tweetsDOM = $(`
    <article class="tweet">
      <div class="tweet-header">
        <div class="header-left">
          <img class="tweet-avatar" src=${user.avatars} alt="avatar" />
          <label class="name-label">${user.name}</label>

        </div>

        <div class="header-right">
          <label class="handle-label">${user.handle}</label>
        </div>
      </div>

      <p class="tweet-body">${escape(content.text)}</p>

      <hr class="tweet-line" />

      <div class="tweet-footer">
        <output class="created-at">${timeago.format(createdAt)}</output>
        <div class="article-footer-icons">
          <i class="fa-solid fa-flag fa-xs"></i>
          <i class="fa-solid fa-retweet fa-xs"></i>
          <i class="fa-solid fa-heart fa-xs"></i>
        </div>
      </div>
    </article>
  `);
  // $(".tweets-container").prepend(tweetsDOM);
  return tweetsDOM;
};

// 컨테이너에 붙이겠다
//2. render (displaying html but also adding in the data being looped through to the html)
const renderTweets = function (data) {
  $(".tweets-container").empty();
  for (const el of data) {
    //3개 (데카르트+)
    //array - each item is an object that contains user, content, createdAt
    $(".tweets-container").prepend(createTweetElement(el)); //el is an object that has 3 contents.
  }
};

// 만들어진 것을 보여주겠다 띄우겠다
//3. load
const loadTweets = function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:8081/tweets",
    // success: (response) => {
    //   renderTweets(response);
  }).then((result) => {
    //  $(".tweets-container").empty();
    renderTweets(result);
  });
};

$(document).ready(function () {
  // loadTweets(); // load up the existing ones before posting a new tweet.
  $(".error").hide();
  // renderTweets(data); //hardcoded object, testing.
  $("#tweet-form").submit(function (e) {
    e.preventDefault(); //preventing res.status(201).send()
    $(".error").hide();
    if (Number($("#tweet-form").find(".counter").text()) < 0) {
      // return alert("too many characters");
      $("#error-1").slideDown();
    } else if (Number($("#tweet-form").find(".counter").text()) >= 140) {
      // return alert("type something!");
      $("#error-2").slideDown();
    } else {
      const result = $("#tweet-text").serialize(); //textarea=whatever&xyz
      $.ajax({
        type: "POST",
        url: "http://localhost:8081/tweets",
        data: result,
      }).then(() => {
        $("#tweet-text").val("");
        $(".counter").text(140);
        loadTweets(); //데카르트 + 새로운 트윗들 (섭밋눌렀을때)
      });
    }
    // have to reset inside .submit because evertime we trigger 'submit' we want this to be cleared. if I do it outside submit, it won't run.
  });
  loadTweets(); // 하얀화면 트위터박스밑에
