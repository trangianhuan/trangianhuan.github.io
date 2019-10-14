var app = firebase.initializeApp(firebaseConfig);

$('body').on('click', '.submit', function(){
    var email = $('input[type=email]').val()
    var password = $('input[type=password]').val()

    signInWithEmailAndPassword(email, password)
})

function signInWithEmailAndPassword(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(e){
            console.log('login sss')
            log('aa', e)
        })
        .catch(function(error) {
          // Handle Errors here.
          $('.err-lg').show()
          var errorCode = error.code;
          var errorMessage = error.message;
          log(errorCode, errorMessage)
        });
}

firebase.auth().onAuthStateChanged(function(userLogin) {
  if (userLogin) {
    window.location.href = '/note';
  }
});
