CurrentID = 0;
pageLoaded = 0;
load = 1;
currentIDs = 0;
lastID = 0
reset = 0
var picture_count = 4;
function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
var id = getParameterByName("id");

var config = {
  apiKey: "AIzaSyC3HKA1lIaS637z1IvKDugMFMELWkFlpwQ",
  authDomain: "synchronozedtablets.firebaseapp.com",
  databaseURL: "https://synchronozedtablets.firebaseio.com",
  projectId: "synchronozedtablets",
  storageBucket: "synchronozedtablets.appspot.com",
  messagingSenderId: "538886454755"
};
firebase.initializeApp(config);
var idCount = firebase.database().ref('idCount');

var color

window.onbeforeunload = function(){
  var idCount2 = firebase.database().ref('idCount');  
  console.log(lastID-1);
  idCount2.set(lastID-1);
  reset=1;
  return "You've modified your fiddle, reloading the page will reset all changes.";

};

var previous = {
  1: 1,
  2: 1
}

callback = function(colors) { 
  code = {}
  code[0] = colors.val().color.color_1;
  code[1] = colors.val().color.color_2;
  console.info(parseInt(code[0]) == NaN)
  console.info(parseInt(code[1]) == NaN)

  if (isNaN(code[0])) {
      document.getElementById("img_" + previous[1] + "_1").setAttribute("hidden","hidden");
      document.getElementById("color_1").style.backgroundColor = code[0]
  } else {
      document.getElementById("img_" + previous[1] + "_1").setAttribute("hidden","hidden");
      document.getElementById("color_1").style.backgroundColor = "white"
      document.getElementById("img_" + code[0] + "_1").removeAttribute("hidden")
      previous[1] = code[0]
  }

  if (isNaN(code[1])) {
      document.getElementById("img_" + previous[2] + "_2").setAttribute("hidden","hidden");
      document.getElementById("color_2").style.backgroundColor = code[1]
  } else {
      console.log("stage2")
      document.getElementById("img_" + previous[2] + "_2").setAttribute("hidden","hidden");
      document.getElementById("color_2").style.backgroundColor = "white"
      document.getElementById("img_" + code[1] + "_2").removeAttribute("hidden")
      previous[2] = code[1]
  }
}


window.onload =  function() {
  for (i = 1; i <= picture_count; i++) {
    var image = document.createElement("img");
    image.id = "img_"+i+"_1";
    image.src = "assets/img_"+i+".png";
    image.setAttribute("hidden","hidden");
    image.setAttribute("style", "height: 100%;")
    document.getElementById("color_1").appendChild(image);

    image = document.createElement("img");
    image.src = "assets/img_"+i+".png";
    image.setAttribute("hidden","hidden");
    image.setAttribute("style", "height: 100%;")
    image.id = "img_"+i+"_2";        
    document.getElementById("color_2").appendChild(image);
  }
}

function getColorCSS(c) {
  var ele = document.createElement("div");
  ele.style.color = c;
  return ele.style.color.split(/\s+/).join('').toLowerCase();
}



