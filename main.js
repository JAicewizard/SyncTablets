CurrentID = 0;
pageLoaded = 0;
load = 1;
currentIDs = 0;
lastID = 0

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
  alert(lastID)
  idCount.set(lastID-1)
}

callback = function(colors) { 
  if(load == 1){
    load = 0;
    for(i=1;i<=colors.val().pictures;i++){
        var image = document.createElement("img");
        image.id = "img_"+i+"_1";
        image.src = "assets/img_"+i+".png";
        image.setAttribute("hidden","hidden");
        document.getElementById("images").appendChild(image);
        image = document.createElement("img");
        image.src = "assets/img_"+i+".png";
        image.setAttribute("hidden","hidden");
        image.id = "img_"+i+"_2";        
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
          document.getElementById("color_"+i).style.backgroundColor = "white";
          

          var img = document.getElementById("img_"+code[i-1]+"_"+i);
          
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
}

setupStuf = function(){
  color = firebase.database().ref('id/' + CurrentID);          
  color.on("value", callback);
}

window.onload = function(){
  idCount.on("value", function(Count){
    count = Count.val()
    if(count<lastID | pageLoaded==0){
      lastID=count
      CurrentID=count+1;        
      color = firebase.database().ref('id/' + CurrentID);        
      pageLoaded = 1;
      setupStuf()
      idCount.set(count+1);
      pageLoaded=1
    }
    lastID=count
  });
}

function getColorCSS(c) {
  var ele = document.createElement("div");
  ele.style.color = c;
  return ele.style.color.split(/\s+/).join('').toLowerCase();
}



