var picture_count = 4;
CurrentID = 0;
lastID = 0
pageLoaded = 0;
reset = 0;
/*function getParameterByName( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
}*/

//var id = getParameterByName("id");

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

var previous = {
    1: "1_0",
    2: "1_1"
}

 callback = function(colors) {
    code = {}

    code[0] = colors.val().color.color_1;
    code[1] = colors.val().color.color_2;

    console.info(parseInt(code[0]))
    console.info(parseInt(code[1]))
	console.log()
    if (parseInt(code[0])==NaN) {
        document.getElementById("img_" + previous[1] + "_1").setAttribute("hidden","hidden");
        document.getElementById("color_1").style.backgroundColor = code[0]
    } else {
        document.getElementById("img_" + previous[1] + "_1").setAttribute("hidden","hidden");
        document.getElementById("color_1").style.backgroundColor = "white"
        document.getElementById("img_" + code[0] + "_1").removeAttribute("hidden")
        previous[1] = code[0]
    }

    if (parseInt(code[1])==NaN) {
        document.getElementById("img_" + previous[2] + "_2").setAttribute("hidden","hidden");
        document.getElementById("color_2").style.backgroundColor = code[1]
    } else {
        document.getElementById("img_" + previous[2] + "_2").setAttribute("hidden","hidden");
        document.getElementById("color_2").style.backgroundColor = "white"
        document.getElementById("img_" + code[1] + "_2").removeAttribute("hidden")
        previous[2] = code[1]
    }
}
setupStuf = function(){
    color = firebase.database().ref('id/' + CurrentID);          
    color.on("value", callback);
    


}

function getid(){
    CurrentID=document.getElementById('textInput').value
    document.getElementById("table").style.height="100%"
    document.getElementById("idInput").setAttribute("hidden","hidden");
    setupStuf()


}


window.onload =  function() {
    /*idCount.on("value", function(Count){
        count = Count.val()
        if((count < CurrentID) | pageLoaded==0 && reset==0){
          lastID=count
          CurrentID=count+1;        
          pageLoaded = 1;
          setupStuf()
          console.log("reloaded config")
          idCount.set(count+1);
          pageLoaded=1
        }
        lastID=count
      });*/
    for (i = 1; i <= picture_count; i++) {
        var image = document.createElement("img");
        image.id = "img_"+i+"_0_1";
        image.src = "assets/img_"+i+"_0.png";
		image.setAttribute("style", 'min-height: 100%; min-width:100%;  float: right; image-rendering: optimizespeed')
		image.setAttribute("hidden","hidden");
        document.getElementById("color_1").appendChild(image);

		image = document.createElement("img");
        image.id = "img_"+i+"_1_1";
		image.src = "assets/img_"+i+"_1.png";
		image.setAttribute("style", 'min-height: 100%; min-width:100%;  float: left; image-rendering: optimizespeed')
		image.setAttribute("hidden","hidden");
        document.getElementById("color_1").appendChild(image);

        image = document.createElement("img");
        image.id = "img_"+i+"_0_2";        
        image.src = "assets/img_"+i+"_0.png";
		image.setAttribute("style", 'min-height: 100%; min-width:100%; float:right; image-rendering: optimizespeed')
		image.setAttribute("hidden","hidden");

		document.getElementById("color_2").appendChild(image);
		
		image = document.createElement("img");
        image.id = "img_"+i+"_1_2";        
		image.src = "assets/img_"+i+"_1.png";
		image.setAttribute("hidden","hidden");
		image.setAttribute("style", 'min-height: 100%; min-width:100%; float:left; image-rendering: optimizespeed')
        document.getElementById("color_2").appendChild(image);
    }
}

firebase.database().ref('id/' + CurrentID).on("value", callback)