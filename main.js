//getParameterByName: Get a parameter from the url
function getParameterByName(name, url) {
  if (!url) {
  url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC3HKA1lIaS637z1IvKDugMFMELWkFlpwQ",
  authDomain: "synchronozedtablets.firebaseapp.com",
  databaseURL: "https://synchronozedtablets.firebaseio.com",
  projectId: "synchronozedtablets",
  storageBucket: "synchronozedtablets.appspot.com",
  messagingSenderId: "538886454755"
};
firebase.initializeApp(config);


var color = firebase.database().ref('id/' + getParameterByName("id"));
color.on("value", function(colors) {
  document.getElementById("color_1").style = "background-color: " + colors.val().color.color_1
  document.getElementById("color_2").style = "background-color: " + colors.val().color.color_2  
});
