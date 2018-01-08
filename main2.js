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

var previous = {
    1: 1,
    2: 1
}

callback = function(data_) {
    data = data_.val()

    console.info(data)

    console.info(parseInt(data.color.color_1) == NaN)
    console.info(parseInt(data.color.color_2) == NaN)

    if (isNaN(data.color.color_1)) {
        document.getElementById("img_" + previous[1] + "_1").setAttribute("hidden","hidden");
        document.getElementById("color_1").style.backgroundColor = data.color.color_1
    } else {
        document.getElementById("img_" + previous[1] + "_1").setAttribute("hidden","hidden");
        document.getElementById("color_1").style.backgroundColor = "white"
        document.getElementById("img_" + data.color.color_1 + "_1").removeAttribute("hidden")
        previous[1] = data.color.color_1
    }

    if (isNaN(data.color.color_2)) {
        document.getElementById("img_" + previous[2] + "_2").setAttribute("hidden","hidden");
        document.getElementById("color_2").style.backgroundColor = data.color.color_2
    } else {
        console.log("stage2")
        document.getElementById("img_" + previous[2] + "_2").setAttribute("hidden","hidden");
        document.getElementById("color_2").style.backgroundColor = "white"
        document.getElementById("img_" + data.color.color_2 + "_2").removeAttribute("hidden")
        previous[2] = data.color.color_2
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

firebase.database().ref('id/' + id).on("value", callback)
