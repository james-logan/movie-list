var button = document.querySelector(".movie-search");
var FIREBASE_URL = 'https://movie-todo-list.firebaseio.com/movies.json';
var dataObject;

/********************************

LOADING TABLE ROWS FROM FIREBASE

*******************************/

window.onload = function () {
  $.get(FIREBASE_URL, function (data) {
    _.forEach(data, function (row) { rowMaker(row, row);});
    $(".movie-list").addClass("unhide")
    }, 'jsonp');
    //Object.keys(data).forEach(function (row) { rowMaker(data[row], row);});
    //$(".movie-list").addClass("unhide")
    //}, 'jsonp');
};


/**************************************

	STOCK LOOKUP FUNCTION

  ***********************************/

button.onclick = function () {
  //var oldResult = document.querySelector(".movie-preview");
  //if (oldResult) {oldResult.parentNode.removeChild(oldResult);}
  var inputVal = document.querySelector("input").value;
  var API_URL = "http://www.omdbapi.com/?t=" + inputVal + "&y=&plot=short&r=json";
  getJSONP(API_URL, 'previewBuilder');
};

function previewBuilder (data) {
  dataObject = data;


  var $prevBox = $(".movie-preview")
  console.log("cats")
  $prevBox.replaceWith("<div class= 'movie-preview'><div class='row'><div class='four columns'><img class='big' src='" + data.Poster
    + "'></div><div class='eight columns'><h4>" + data.Title + "</h4><h6>" + data.Year + "</h6><p>" + data.Plot
    + "</p><button class='add'>Add to Watchlist</button></div></div></div>")

  var addButton = document.querySelector(".add");
  addButton.onclick = function () {
    var table = document.querySelector(".movie-list");
    table.style.display = "block";
    rowMaker(dataObject);};
}

/****************************
 DATA REQUEST GET JSONP FUNCTION

 ****************************/

function getJSONP(url, cb) {
  var script = document.createElement('script');
  script.src = url + '&callback=' + cb;

  document.body.appendChild(script);
}

/****************************************

	TABLE BUILDING FUNCTIONS

  ***************************************/

var rowMaker = function (received, id) {
  $("tbody").append("<tr><td> <img class='small' src='" + received.Poster + "'></td><td>"
                + received.Title + "</td><td>"
                + received.Year + "</td><td>"
                + received.Rated + "</td><td><button class='button-primary'>Watched</button></td></tr>");


  if (id === undefined) {
    var storage = {Poster: dataObject.Poster, Title: dataObject.Title, Year: dataObject.Year, Rated: dataObject.Rated};
    $.post(FIREBASE_URL, JSON.stringify(storage), function (res) {
    $("tr:last-child").attr("data-id", res.name);
		});} else { $("tr:last-child").attr("data-id", id);}
};

var tableBuilder = function () {
  rowMaker(dataObject);
};


/**************************

//Delete button function

**************************/

var $tbody = $('tbody');
//COMMON INTERVIEW QUESTION: HOW TO ADD AN ONCLICK EVENT TO A DYNAMIC ELEMENT. here we put the listener on the body and reset the 'this' with the second argument.
$tbody.on('click', '.button-primary', function () {
  $(this).closest('tr').remove();
  var id = $(this).closest('tr').attr('data-id');
  var deleteURL = FIREBASE_URL.slice(0, - 5) + "/" + id + ".json";
  $.ajax({url: deleteURL, type: 'DELETE', success: function(result)
         {alert('boom!');}});
});








