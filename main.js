CurrentID = 0;
pageLoaded = 0;
load = 1;
currentIDs = 0;

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



window.onbeforeunload = function(){
  idCount.set(count-1)
}
setupStuf = function(){
  var color = firebase.database().ref('id/' + CurrentID);
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
            document.getElementById("color_"+i).style.backgroundColor = "white";
            

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
  });
}


function getColorCSS(c) {
  var ele = document.createElement("div");
  ele.style.color = c;
  return ele.style.color.split(/\s+/).join('').toLowerCase();
}
window.onload = function(){
  idCount.on("value", function(Count){
    count = Count.val()
    if(pageLoaded==0){
      CurrentID=count+1;
      pageLoaded = 1;
      console.log(count)    
      idCount.set(count+1);
      setupStuf()
    }
    currentIDs = count;
  });
}

