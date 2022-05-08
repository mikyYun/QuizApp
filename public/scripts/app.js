// Client facing scripts here
//jQuery
//ajax.
//$

$(() => {

  $("#btn").on("click", () => {

    $.get("/api/test")
      .then((data) => {
        $("#belowbtn").html(data.text);

      });
  });
});
