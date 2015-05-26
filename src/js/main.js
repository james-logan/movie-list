var searchButton = document.querySelector(".movie-search");
var FIREBASE_USER = 'https://movie-todo-list.firebaseio.com'
var fb = new Firebase(FIREBASE_USER +'/?page=Auth')
var FIREBASE_URL;
var dataObject;


/********************************

LOADING TABLE ROWS FROM FIREBASE

*******************************/

window.onload = function () {
     var authStatus = fb.getAuth();
     if (authStatus){
          hello(authStatus);
          FIREBASE_URL = 'https://movie-todo-list.firebaseio.com/users/' + authStatus.uid + '/movies.json?auth=';
          $.get(FIREBASE_URL + authStatus.token, function (data) {
               _.forEach(data, function (row, key) {
                    rowMaker(row, key);});
               $(".movie-list").addClass("unhide")
          }, 'jsonp');
     } else {
          window.location.pathname = "/login/"
     }
};

/*Builds and inserts the header greeting*/
function hello (data) {
     $("h5.greeting").append("Hello " + data.password.email + "!");
}


/********************************
     LOGOUT BUTTON
**********************************/

$("button.log-out").click(function(){
     fb.unauth();
     window.location.pathname = "/login/"
})

/**************************************

	STOCK LOOKUP FUNCTION

  ***********************************/

searchButton.onclick = function () {
  var inputVal = document.querySelector("input").value;
  var API_URL = "http://www.omdbapi.com/?t=" + inputVal + "&y=&plot=short&r=json";
  getJSONP(API_URL, 'previewBuilder');
};

function previewBuilder (data) {
  dataObject = data;
  var $prevBox = $(".movie-preview")
   if (dataObject.Response === "True") {
      $prevBox.replaceWith("<div class= 'movie-preview'><div class='row'><div class='four columns'><img class='big' src='" + data.Poster
         + "'></div><div class='eight columns'><h4>" + data.Title + "</h4><h6>" + data.Year + "</h6><p>" + data.Plot
         + "</p><button class='add'>Add to Watchlist</button><button class='trailer'>Watch Trailer</button></div></div></div>")

      var addButton = document.querySelector(".add");
      addButton.onclick = function () {
         var table = document.querySelector(".movie-list");
         table.style.display = "block";
         rowMaker(dataObject);};

     $("button.trailer").click(function () {
          $(".overlay").css("display", "block");
          $(".modal").css("display", "block");

          var trailerUrl = 'http://crossorigin.me/http://api.traileraddict.com/?film=' + $("input").val().split(" ").join('-') + '&count=5&width=000';

          $.get(trailerUrl, function (dataXML) {
               var trailer = $.parseXML(dataXML);
               var $embed = $($(trailer).find('embed'));
               debugger;
               var $iFrame = $embed.text();
               $(".video-box").prepend($iFrame)
          })

          $(".modal button").click(function () {
               $(".overlay").css("display", "none");
               $(".modal").html('<button class="button-primary">Close</button>')
               $(".modal").css("display", "none");
          })
     })
   } else {
      $prevBox.replaceWith("<div class= 'movie-preview'><h4>We're sorry. We couldn't find the movie you were looking for.</h4></div>")
    }
}



/****************************
 DATA REQUEST GET JSONP FUNCTION

 ****************************/

function getJSONP(url, cb) {
  var script = document.createElement('script');
  script.src = url + '&callback=' + cb;

  document.body.appendChild(script);
}



/*************************

GET XML

***************************/

// $.get()
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
    $.post(FIREBASE_URL  + fb.getAuth().token, JSON.stringify(storage), function (res) {
    $("tr:last-child").attr("data-id", res.name);
		});} else {$("tr:last-child").attr("data-id", id);}
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
  var id = $(this).closest('tr').attr('data-id');
  $(this).closest('tr').remove();
  var deleteURL = FIREBASE_URL.slice(0, - 11) + "/" + id + ".json?auth=" + fb.getAuth().token;
  $.ajax({url: deleteURL, type: 'DELETE', success: function(result)
         {alert('boom!');}});
});








