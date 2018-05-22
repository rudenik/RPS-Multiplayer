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

connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connections.push(true);
    con.onDisconnect().remove();
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
  console.log($(".active"));
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
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
    
    FBDB.ref()
      .child("/Players")
      .once("value")
      .then(function(onceShot) {
        // console.log(onceShot.val());
        if (onceShot.numChildren() == 0) {
          console.log("There are no Players");
          ref
            .child("Players")
            .child(1)
            .set(player);
          $("#playerinput")
            .empty()
            .css("height", "88px");
            drawPlayer(player, $("#player1"));
        } else if (onceShot.numChildren() == 1) {
          console.log("There is one Player");
          ref
            .child("Players")
            .child(2)
            .set(player);
          $("#playerinput")
            .empty()
            .css("height", "88px");
            drawPlayer(player, $("#player2"));
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
    } else if (onceShot.numChildren() == 1) {
      console.log("you are player 2");
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

