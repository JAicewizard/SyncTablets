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

function getColorCSS(c) {
  var ele = document.createElement("div");
  ele.style.color = c;
  return ele.style.color.split(/\s+/).join('').toLowerCase();
}

load = 1;
var color = firebase.database().ref('id/' + getParameterByName("id"));
color.on("value", function(colors) {

  if(load == 1){
   load = 0;
   for(i=1;i<=colors.val().pictures;i++){
       var image = document.createElement("img");
       image.id = "img_"+i;
       image.src = "assets/img_"+i+".png";
       image.setAttribute("hidden","hidden");
       document.getElementById("images").appendChild(image);
       console.log(i)
   }
  }
  code = {}
  code[0] = colors.val().color.color_1;
  code[1] = colors.val().color.color_2;
  for(i=1;i<=2;i++){
    console.log(code[i-1]);
    string = getColorCSS(code[i-1]);
    if(string == ""){
        if(!isNaN(code[i-1])){
          var img = document.getElementById("img_"+code[i-1]);
          
          img.removeAttribute("hidden");
          if(document.getElementById("color_"+i).firstElementChild!=null){
            oldImg=document.getElementById("color_"+i).firstElementChild;
            document.getElementById("images").appendChild(oldImg)
          }
          document.getElementById("color_"+i).appendChild(img);
          document.getElementById("color_"+i).firstElementChild.setAttribute("min-width","100%");
          
        }else{

        }
    }else{
      console.log("its a colour-code")
      if(document.getElementById("color_"+i).firstElementChild!=null){
        oldImg=document.getElementById("color_"+i).firstElementChild;
        document.getElementById("images").appendChild(oldImg)
      }
      document.getElementById("color_"+i).style.backgroundColor = string;
    }
  }
  //document.getElementById("img1_1").setAttribute("hidden", "hidden")
  //document.getElementById("img1_2").setAttribute("hidden", "hidden")
  //document.getElementById(colors.val().color.color_1 + "_1").removeAttribute("hidden")
  //document.getElementById(colors.val().color.color_2 + "_2").removeAttribute("hidden")
});
