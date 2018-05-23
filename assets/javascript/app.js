var config = {
  apiKey: "AIzaSyAe0-fpKphHdChAkM0WGFn2gH3WZf3_VZ0",
  authDomain: "rps-multiplayer-4f7fd.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-4f7fd.firebaseio.com",
  projectId: "rps-multiplayer-4f7fd",
  storageBucket: "rps-multiplayer-4f7fd.appspot.com",
  messagingSenderId: "596398391346"
};
firebase.initializeApp(config);

var FBDB = firebase.database();
var ref = FBDB.ref();
var connections = FBDB.ref("/connections");
var connectedRef = FBDB.ref(".info/connected");
var numberOfConnected;
var playerNumber;
var connectionID;
var playerThrow;
var controlsOn = false;

// var amOnline = connectedRef;
// var userRef = FBDB.ref("/presence/"+userid);

// amOnline.on('value', function(snap){
//   if(snap.val()){
//     userRef.onDisconnect.remove();
//     userRef.set(true);
//   }
// });


connectedRef.on("value", function(snap) {
  if (snap.val()) {
    
    // connectionID = snap.val();
    // console.log(connectionID);
    var con = connections.push(true);
    con.onDisconnect().remove()
  }
});

$("#playerinput").on("click", ".avatar", function() {
  $(this).addClass("active");
  $(this)
    .siblings()
    .removeClass("active");
});

$("#playerstartbutton").on("click", function(event) {
  event.preventDefault();
  name = $("#playername-input")
    .val()
    .trim();
  // console.log($(".active"));
  if ($(".active").length < 1) {
    alert("pick an avatar");
  } else {
    avatar = $(".active").attr("src");
    // console.log(name);
    // console.log(avatar);
    var player = {
      name: name,
      avatar: avatar,
      wins: 0,
      loses: 0,
      dateAdded: firebase.database.ServerValue.TIMESTAMP//,
      //conID : connectionID
    };
    
    FBDB.ref()
      .child("/Players")
      .once("value")
      .then(function(onceShot) {
        // console.log(onceShot.val());
        if (onceShot.numChildren() == 0) {
            playerNumber=1;
          console.log("There are no Players");
          ref
            .child("Players")
            .child(1)
            .set(player);
          $("#playerinput")
            .empty()
            .css("height", "88px");
            drawPlayer(player, $("#player1"));
            // drawControls($("#player1"));
            ref.child("Players").child(1).onDisconnect().remove();
        } else if (onceShot.numChildren() == 1) {
            playerNumber=2;
          console.log("There is one Player");
          ref
            .child("Players")
            .child(2)
            .set(player);
          $("#playerinput")
            .empty()
            .css("height", "88px");
            drawPlayer(player, $("#player2"));
            ref.child("Players").child(2).onDisconnect().remove();
        } else if (onceShot.numChildren() == 2) {
          console.log("There are 2 players");
          alert("Too many Players, sorry");
        } else {
          console.log("lots of players");
        }
      });
  }
});
connections.on("value", function(snap) {
  console.log(snap.numChildren());
  numberOfConnected = snap.numChildren();

});
FBDB.ref()
  .child("/Players")
  .once("value")
  .then(function(onceShot) {
    console.log(onceShot.val());
    if (onceShot.numChildren() == 0) {
      console.log("There are no Players");
      // playerNumber=1;
    } else if (onceShot.numChildren() == 1) {
      console.log("you are player 2");
      playerNumber=2;
      drawPlayer(onceShot.child("1").val(), $("#player1"));
      
    } else if (onceShot.numChildren() == 2) {
      console.log("There are 2 players");
    //   console.log(onceShot.child("1").val().name);
    //   console.log(onceShot.child("2").val().name);
      drawPlayer(onceShot.child("1").val(), $("#player1"));
      drawPlayer(onceShot.child("2").val(), $("#player2"));
      $("#playerinput")
            .empty()
            .css("height", "88px");
      alert("Too many Players, sorry");
    } else {
      console.log("lots of players");
    }
  });

function drawPlayer(playerInfo, placeToBeDrawn){
    console.log(playerInfo.name);
    placeToBeDrawn.empty();
      var playerNameDiv = $("<div>");
      playerNameDiv.addClass("row");
      var player1Image = $("<img>");
      placeToBeDrawn.addClass("text-center");
      player1Image.attr("src", playerInfo.avatar); 
      playerNameDiv.addClass("justify-content-center");
      playerNameDiv.html(
        "<b>Name: </b>" + playerInfo.name + "<br>"
      );
      var winsLabel = $("<div>");
      winsLabel
        .addClass("row")
        .text("Wins: ")
        .addClass("justify-content-center");
      var winsCount = $("<div>");
      winsCount.text(playerInfo.wins);
      winsLabel.append(winsCount);
      var losesLabel = $("<div>");
      losesLabel
        .addClass("row")
        .addClass("justify-content-center")
        .text("Loses: ");
      var losesCount = $("<div>");
      losesCount.text(playerInfo.loses);
      losesLabel.append(losesCount);
      placeToBeDrawn.append(player1Image);
      placeToBeDrawn.append(playerNameDiv);
      placeToBeDrawn.append(winsLabel);
      placeToBeDrawn.append(losesLabel);
}

function drawControls(where){
    var controlDiv=$("<div>");
    controlDiv.addClass("row").attr("id", "throws");
    var rockDiv = $("<div>");
    rockDiv.addClass("col").text("ROCK").attr("id", "rock").addClass("throw");
    var paperDiv = $("<div>");
    paperDiv.addClass("col").text("PAPER").attr("id", "paper").addClass("throw");
    var scissorDiv = $("<div>");
    scissorDiv.addClass("col").text("SCISSOR").attr("id", "scissor").addClass("throw");
    controlDiv.append(rockDiv);
    controlDiv.append(paperDiv);
    controlDiv.append(scissorDiv);
    where.append(controlDiv);
}
$("#gamearea").on("click", ".throw", function(){
    console.log($(this).attr("id"));
    $(this).siblings().css("display", "none");
    playerThrow=$(this).attr("id");
    FBDB.ref("/Throws").child(playerNumber).set(playerThrow);
    FBDB.ref("/Throws").child(playerNumber).onDisconnect().remove();
    controlsOn=false;
})

ref.child("/Players").on("value", function(snap){
    console.log("There are " + snap.numChildren() + " players");
    if ((snap.numChildren() === 2)){// && (!controlsOn)){
        console.log(controlsOn);
        console.log("I am Player: " + playerNumber);
        if(playerNumber==1){
            drawControls($("#player1"));
            drawPlayer(snap.child("2").val(), $("#player2"));
            controlsOn=true;
        }
        if (playerNumber==2){//broken
        // if((playerNumber==2)&&(controlsOn)){
            drawControls($("#player2"));
            drawPlayer(snap.child("1").val(), $("#player1"));
            controlsOn=true;
        }
    }
});

ref.child("/Throws").on("value", function(snap){
    console.log("There are " + snap.numChildren() + " throws");
    if(snap.numChildren() === 2){
      console.log("we have a game here");
      if((snap.child(1).val()=="paper")&&(snap.child(2).val()=="rock")){
        console.log("Player1 wins");
        $("#battlearea").text("Player 1 Wins");
      }else if((snap.child(1).val()=="rock")&&(snap.child(2).val()=="scissor")){
        console.log("Player1 wins");
        $("#battlearea").text("Player 1 Wins");
      }else if((snap.child(1).val()=="scissor")&&(snap.child(2).val()=="paper")){
        console.log("Player1 wins");
        $("#battlearea").text("Player 1 Wins");
      }else if(snap.child(1).val()==snap.child(2).val()){
        console.log("Tie Game");
        $("#battlearea").text("Draw");
      }else if((snap.child(2).val()=="paper")&&(snap.child(1).val()=="rock")){
        console.log("Player2 wins");
        $("#battlearea").text("Player 2 Wins");
      }else if((snap.child(2).val()=="rock")&&(snap.child(1).val()=="scissor")){
        console.log("Player2 wins");
        $("#battlearea").text("Player 2 Wins");
      }else if((snap.child(2).val()=="scissor")&&(snap.child(1).val()=="paper")){
        console.log("Player2 wins");
        $("#battlearea").text("Player 2 Wins");
    }
  }
});

function drawWin(winner){


}