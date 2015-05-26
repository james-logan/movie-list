var FIREBASE_URL = 'https://movie-todo-list.firebaseio.com/'
var fb = new Firebase(FIREBASE_URL +'/?page=Auth')




/********************************

 RESETTING PASSWORD

*******************************/

$("button.reset").click(function () {

   event.preventDefault();
   var email = $("input[type='email']").val();
   console.log("cats")
   fb.resetPassword(
     {
          email: email
     },
     function (err) {
          if (err) {
               alert("Something when wrong. Make sure to enter an email to reset\n" + err.toString())
          } else {
               alert("A reset email was sent to your account. Follow the instructions there to reset your password.")
          };
     }
   )
})


/********************************

 REgister new account

*******************************/


$("button.register").click(function (evt) {
     var email = $("input[type='email']").val();
     var password = $("input[type='password']").val();
     fb.createUser({
          email: email,
          password: password
     }, function (err) {
          if (err) {
               console.log("Error creating new user", error)
          } else {
               loginplz();
          }
     })
     evt.preventDefault();
});

$("form").submit(function () {
     loginplz();
})

function loginplz () {
     var email = $("input[type='email']");
     var password = $("input[type='password']");
     fb.authWithPassword({email: email.val(), password: password.val()}, function (err, authData) {
         if (err) {alert("That password appears to be incorrect!")}
         else {
           email.val('');
           password.val('');
           $.ajax({
             method: 'PUT',
             url: FIREBASE_URL + 'users/' + authData.uid + '/profile.json?auth=' + authData.token,
             data: JSON.stringify(authData),
             success: function () {
               console.log('It works!');
               window.location.pathname = "/";
             }
           });
         };
})
       event.preventDefault();
}
