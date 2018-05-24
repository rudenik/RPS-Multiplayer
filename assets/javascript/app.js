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
var playerRef = FBDB.ref("/Players");
var playerNumber;
var playerThrow;
var localPlayer1;
var localPlayer2;

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

	if ($(".active").length < 1) {
		alert("pick an avatar");
	} else {
		avatar = $(".active").attr("src");

		var player = {
			name: name,
			avatar: avatar,
			wins: 0,
			loses: 0,
			dateAdded: firebase.database.ServerValue.TIMESTAMP //,
		};

		FBDB.ref()
			.child("/Players")
			.once("value")
			.then(function(onceShot) {
				if (onceShot.numChildren() == 0) {
					playerNumber = 1;
					ref
						.child("Players")
						.child(1)
						.set(player);
					$("#playerinput")
						.empty()
						.css("height", "88px");
					drawPlayer(player, $("#player1"));
					ref
						.child("Players")
						.child(1)
						.onDisconnect()
						.remove();
				} else if (onceShot.numChildren() == 1) {
					playerNumber = 2;
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
					alert("Too many Players, sorry");
				} else {
					console.log("lots of players");
				}
			});
	}
});

FBDB.ref()
	.child("/Players")
	.once("value")
	.then(function(onceShot) {
		if (onceShot.numChildren() == 0) {
		} else if (onceShot.numChildren() == 1) {
			playerNumber = 2;
			drawPlayer(onceShot.child("1").val(), $("#player1"));
		} else if (onceShot.numChildren() == 2) {
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
	placeToBeDrawn.empty();
	var playerCol = $("<div>");
	playerCol.addClass("col");
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
	playerCol.append(player1Image);
	playerCol.append(playerNameDiv);
	playerCol.append(winsLabel);
	playerCol.append(losesLabel);
	placeToBeDrawn.append(playerCol);
}

function drawControls(where) {
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
		.text("SCISSORS")
		.attr("id", "scissors")
		.addClass("throw");
	controlDiv.append(rockDiv);
	controlDiv.append(paperDiv);
	controlDiv.append(scissorDiv);
	where.append(controlDiv);
}
$("#gamearea").on("click", ".throw", function() {
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
});

ref.child("/Players").on("value", function(snap) {
	if (snap.child("1").val()) {
		localPlayer1 = snap.child("1").val();
		console.log("player 1 present");
	}
	if (snap.child("2").val()) {
		localPlayer2 = snap.child("2").val();
		console.log("player 2 present");
	}
	if (snap.numChildren() === 2) {
		if (playerNumber == 1) {
			drawControls($("#throwareaplayer1"));
			drawPlayer(snap.child("2").val(), $("#player2"));
		}
		if (playerNumber == 2) {
			drawControls($("#throwareaplayer2"));
			drawPlayer(snap.child("1").val(), $("#player1"));
		}
	}
});

ref.child("/Throws").on("value", function(snap) {
	if (snap.numChildren() === 2) {
		console.log("we have a game here");
		if (snap.child(1).val() == "paper" && snap.child(2).val() == "rock") {
			player1Win();
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
		} else if (
			snap.child(1).val() == "rock" &&
			snap.child(2).val() == "scissors"
		) {
			player1Win();
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
		} else if (
			snap.child(1).val() == "scissors" &&
			snap.child(2).val() == "paper"
		) {
			player1Win();
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
		} else if (snap.child(1).val() == snap.child(2).val()) {
			console.log("Tie Game");
			$("#battlearea")
				.html("<h2>DRAW!!!</h2>")
				.css("text-align", "center");
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
			ref.child("/Throws").remove();
			setTimeout(function() {
				drawControls($("#throwareaplayer" + playerNumber));
				$("#battlearea").empty();
			}, 5000);
		} else if (
			snap.child(2).val() == "paper" &&
			snap.child(1).val() == "rock"
		) {
			player2Win();
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
		} else if (
			snap.child(2).val() == "rock" &&
			snap.child(1).val() == "scissors"
		) {
			player2Win();
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
		} else if (
			snap.child(2).val() == "scissors" &&
			snap.child(1).val() == "paper"
		) {
			player2Win();
			if (playerNumber == 1) {
				drawOtherThrow(
					snap
						.child(2)
						.val()
						.toUpperCase(),
					2
				);
			} else {
				drawOtherThrow(
					snap
						.child(1)
						.val()
						.toUpperCase(),
					1
				);
			}
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
function drawOtherThrow(oThrowToDraw, whereToDraw) {
	var otherThrowDiv = $("<div>");
	otherThrowDiv.addClass("row").attr("id", "othrow");
	var theThrow = $("<div>");
	theThrow.text(oThrowToDraw).addClass("col");
	otherThrowDiv.append(theThrow);
	$("#throwareaplayer" + whereToDraw).append(otherThrowDiv);
	setTimeout(function() {
		$("#throwareaplayer" + whereToDraw).empty();
	}, 5000);
}
function player2Win() {
	ref.child("/Throws").remove();
	localPlayer1.loses++;
	localPlayer2.wins++;
	$("#player1 .loses").text(localPlayer1.loses);
	$("#player2 .wins").text(localPlayer2.wins);
	drawWinner(localPlayer2);
	setTimeout(function() {
		playerRef
			.child("1")
			.child("loses")
			.set(localPlayer1.loses);
		localPlayer2.wins++;
		playerRef
			.child("2")
			.child("wins")
			.set(localPlayer2.wins);
		drawControls($("#throwareaplayer" + playerNumber));
		$("#battlearea").empty();
	}, 5000);
}
function player1Win() {
	ref.child("/Throws").remove();
	localPlayer1.wins++;
	localPlayer2.loses++;
	$("#player1 .wins").text(localPlayer1.wins);
	$("#player2 .loses").text(localPlayer2.loses);
	drawWinner(localPlayer1);
	ref.child("/Throws").remove();
	setTimeout(function() {
		playerRef
			.child("1")
			.child("wins")
			.set(localPlayer1.wins);
		localPlayer2.loses++;
		playerRef
			.child("2")
			.child("loses")
			.set(localPlayer2.loses);
		drawControls($("#throwareaplayer" + playerNumber));
		$("#battlearea").empty();
	}, 5000);
}

$("#sendchat").on("click", function(event) {
	event.preventDefault();
	if (!playerNumber) {
		alert(
			"Select a user name and avatar, then hit start game to use chat functionality"
		);
	} else {
		var chatText = $("#chat-input").val();
		if (playerNumber == 1) {
			var whoSent = localPlayer1.name;
		} else {
			var whoSent = localPlayer2.name;
		}
		var chat = {
			sender: whoSent,
			text: chatText,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		};
		ref.child("/Message").push(chat);
		ref
			.child("/Message")
			.onDisconnect()
			.remove();
		$("#chat-input").val("");
	}
});

ref
	.child("/Message")
	.orderByChild("dateAdded")
	.limitToLast(5)
	.on("child_added", function(message) {
		var tBody = $("tbody");
		var tRow = $("<tr>");
		var whoSentTD = $("<td>").html("<b>" + message.val().sender + "</b>");
		var textTD = $("<td>").text(message.val().text);
		var dateATD = $("<td>").text(
			moment(message.val().dateAdded).format("hh:mm:ss")
		);
		tRow.append(whoSentTD, textTD, dateATD);
		tBody.prepend(tRow);
	});
