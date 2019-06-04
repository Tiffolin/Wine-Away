
$.getJSON("/wines", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#wines").append("<div class='item container-fluid'><p  class= 'title' data-id='" + data[i]._id + "'><img class='img-fluid pic'src=" + data[i].link + ">" + data[i].title + "</p><a href=" + data[i].link + " class='link'>Link to Wine</a></div>");
  }
});

$(document).on("click", "p", function() {

  $("#notes").empty();

  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/wines/" + thisId
  })

    .then(function(data) {
      console.log(data);
      $("#notes").append("<h5>" + data.title + "</h5>");
      $("#notes").append("<input id='titleinput' name='title' placeholder='Username' >");
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Share your thoughts about this bottle'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-dark'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/wines/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
