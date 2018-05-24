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
var playerRef = FBDB.ref("/Players");
var throwRef = FBDB.ref("/Throws");
// var numberOfConnected;
var playerNumber;
// var connectionID;
var playerThrow;
var controlsOn = false;
var localPlayer1;
var localPlayer2;
var gameWon = false; //in the drawPlayer function add an if statement for a title in the area "Winner!"

// var amOnline = connectedRef;
// var userRef = FBDB.ref("/presence/"+userid);

// amOnline.on('value', function(snap){
//   if(snap.val()){
//     userRef.onDisconnect.remove();
//     userRef.set(true);
//   }
// });

// connectedRef.on("value", function(snap) {
//   if (snap.val()) {

//     // connectionID = snap.val();
//     // console.log(connectionID);
//     var con = connections.push(true);
//     con.onDisconnect().remove()
//   }
// });

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
      dateAdded: firebase.database.ServerValue.TIMESTAMP //,
      //conID : connectionID
    };

    FBDB.ref()
      .child("/Players")
      .once("value")
      .then(function(onceShot) {
        // console.log(onceShot.val());
        if (onceShot.numChildren() == 0) {
          playerNumber = 1;
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
          ref
            .child("Players")
            .child(1)
            .onDisconnect()
            .remove();
        } else if (onceShot.numChildren() == 1) {
          playerNumber = 2;
          console.log("There is one Player");
          ref
            .child("Players")
            .child(2)
            .set(player);
          $("#playerinput")
            .empty()
            .css("height", "88px");
          drawPlayer(player, $("#player2"));
          ref
            .child("Players")
            .child(2)
            .onDisconnect()
            .remove();
        } else if (onceShot.numChildren() == 2) {
          console.log("There are 2 players");
          alert("Too many Players, sorry");
        } else {
          console.log("lots of players");
        }
      });
  }
});
// connections.on("value", function(snap) {
//   console.log(snap.numChildren());
//   numberOfConnected = snap.numChildren();

// });
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
      playerNumber = 2;
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

function drawPlayer(playerInfo, placeToBeDrawn) {
  console.log(playerInfo.name);
  placeToBeDrawn.empty();
  var playerNameDiv = $("<div>");
  playerNameDiv.addClass("row");
  var player1Image = $("<img>");
  placeToBeDrawn.addClass("text-center");
  player1Image.attr("src", playerInfo.avatar);
  playerNameDiv.addClass("justify-content-center");
  playerNameDiv.html("<b>Name: </b>" + playerInfo.name + "<br>");
  var winsLabel = $("<div>");
  winsLabel
    .addClass("row")
    .text("Wins: ")
    .addClass("justify-content-center");
  var winsCount = $("<div>");
  winsCount.text(playerInfo.wins).addClass("wins");
  winsLabel.append(winsCount);
  var losesLabel = $("<div>");
  losesLabel
    .addClass("row")
    .addClass("justify-content-center")
    .text("Loses: ");
  var losesCount = $("<div>");
  losesCount.text(playerInfo.loses).addClass("loses");
  losesLabel.append(losesCount);
  placeToBeDrawn.append(player1Image);
  placeToBeDrawn.append(playerNameDiv);
  placeToBeDrawn.append(winsLabel);
  placeToBeDrawn.append(losesLabel);
}

function drawControls(where) {
  console.log("DrawControls Fired");
  $("#throws").remove();
  var controlDiv = $("<div>");
  controlDiv.addClass("row").attr("id", "throws");
  var rockDiv = $("<div>");
  rockDiv
    .addClass("col")
    .text("ROCK")
    .attr("id", "rock")
    .addClass("throw");
  var paperDiv = $("<div>");
  paperDiv
    .addClass("col")
    .text("PAPER")
    .attr("id", "paper")
    .addClass("throw");
  var scissorDiv = $("<div>");
  scissorDiv
    .addClass("col")
    .text("SCISSOR")
    .attr("id", "scissor")
    .addClass("throw");
  controlDiv.append(rockDiv);
  controlDiv.append(paperDiv);
  controlDiv.append(scissorDiv);
  where.append(controlDiv);
}
$("#gamearea").on("click", ".throw", function() {
  console.log($(this).attr("id"));
  $(this)
    .siblings()
    .css("display", "none");
  playerThrow = $(this).attr("id");
  FBDB.ref("/Throws")
    .child(playerNumber)
    .set(playerThrow);
  FBDB.ref("/Throws")
    .child(playerNumber)
    .onDisconnect()
    .remove();
  // controlsOn = false;
});

ref.child("/Players").on("value", function(snap) {
  if (snap.child("1").val()) {
    localPlayer1 = snap.child("1").val();
    console.log("player 1 present");
  }
  if (snap.child("2").val()) {
    localPlayer2 = snap.child("2").val();
    console.log("player 2 present");
    console.log(localPlayer2.name);
    console.log(localPlayer2.wins);
  }
  console.log("There are " + snap.numChildren() + " players");
  if (snap.numChildren() === 2) {
    console.log(controlsOn);
    console.log("I am Player: " + playerNumber);
    if (playerNumber == 1) {
      drawControls($("#player1"));
      drawPlayer(snap.child("2").val(), $("#player2"));
      controlsOn = true;
    }
    if (playerNumber == 2) {
      drawControls($("#player2"));
      drawPlayer(snap.child("1").val(), $("#player1"));
      controlsOn = true;
    }
  }
});

ref.child("/Throws").on("value", function(snap) {
  console.log("There are " + snap.numChildren() + " throws");
  if (snap.numChildren() === 2) {
    console.log("we have a game here");
    if (snap.child(1).val() == "paper" && snap.child(2).val() == "rock") {
      console.log("Player1 wins");
      player1Win(snap.child(2).val().toUpperCase());
    } else if (
      snap.child(1).val() == "rock" &&
      snap.child(2).val() == "scissor"
    ) {
      console.log("Player1 wins");
      player1Win(snap.child(2).val().toUpperCase());
    } else if (
      snap.child(1).val() == "scissor" &&
      snap.child(2).val() == "paper"
    ) {
      console.log("Player1 wins");
      player1Win(snap.child(2).val().toUpperCase());
    } else if (snap.child(1).val() == snap.child(2).val()) {
      console.log("Tie Game");
      $("#battlearea")
        .html("<h2>DRAW!!!</h2>")
        .css("text-align", "center");
      ref.child("/Throws").remove();
      setTimeout(function() {
        drawControls($("#player" + playerNumber));
        $("#battlearea").empty();
      }, 5000);
    } else if (
      snap.child(2).val() == "paper" &&
      snap.child(1).val() == "rock"
    ) {
      console.log("Player2 wins");
      player2Win(snap.child(1).val().toUpperCase());
    } else if (
      snap.child(2).val() == "rock" &&
      snap.child(1).val() == "scissor"
    ) {
      console.log("Player2 wins");
      player2Win(snap.child(1).val().toUpperCase());
    } else if (
      snap.child(2).val() == "scissor" &&
      snap.child(1).val() == "paper"
    ) {
      console.log("Player2 wins");
      player2Win(snap.child(1).val().toUpperCase());
    }
  }
});

function drawWinner(winner) {
  $("#battlearea").empty();
  var playerNameDiv = $("<div>");
  playerNameDiv.addClass("row");
  var player1Image = $("<img>");
  $("#battlearea").addClass("text-center");
  player1Image.attr("src", winner.avatar);
  playerNameDiv.addClass("justify-content-center");
  playerNameDiv.html("<b>The Winner is <br>" + winner.name + "</b>");
  $("#battlearea").append(player1Image);
  $("#battlearea").append(playerNameDiv);
}
function player2Win(oThrow) {
  console.log("Player2 wins");
  ref.child("/Throws").remove();
  localPlayer1.loses++;
  localPlayer2.wins++;
  $("#player1 .loses").text(localPlayer1.loses);
  $("#player2 .wins").text(localPlayer2.wins);
  var otherThrowDiv = $("<div>"); //you need an if statement in one of these incase you are player2 or if you are player1
  otherThrowDiv.addClass("row").attr("id", "othrow");
  var theThrow = $("<div>");
  theThrow.text(oThrow).addClass("col");
  otherThrowDiv.append(theThrow);
  $("#player1").append(otherThrowDiv);
  drawWinner(localPlayer2);
  setTimeout(function() {
    playerRef
      .child("1")
      .child("loses")
      .set(localPlayer1.loses);
    playerRef
      .child("2")
      .child("wins")
      .set(localPlayer2.wins);
    drawControls($("#player" + playerNumber));
    $("#battlearea").empty();
    $("#othrow").remove();
  }, 5000);
}
function player1Win(oThrow) {
  console.log("Player1 wins");
  ref.child("/Throws").remove();
  localPlayer1.wins++;
  localPlayer2.loses++;
  $("#player1 .wins").text(localPlayer1.wins);
  $("#player2 .loses").text(localPlayer2.loses);
  var otherThrowDiv = $("<div>"); //you need an if statement in one of these incase you are player2 or if you are player1
  otherThrowDiv.addClass("row").attr("id", "othrow");//further more if you are p2 your counts are now not going up. 
  var theThrow = $("<div>");// because the update is happening one after the other, you are losing the second increment. 
  theThrow.text(oThrow).addClass("col");
  otherThrowDiv.append(theThrow);
  $("#player2").append(otherThrowDiv);
  drawWinner(localPlayer1);
  ref.child("/Throws").remove();
  setTimeout(function() {
    playerRef
      .child("1")
      .child("wins")
      .set(localPlayer1.wins);
    playerRef
      .child("2")
      .child("loses")
      .set(localPlayer2.loses);
    drawControls($("#player" + playerNumber));
    $("#battlearea").empty();
    $("#othrow").remove();
  }, 5000);
}
