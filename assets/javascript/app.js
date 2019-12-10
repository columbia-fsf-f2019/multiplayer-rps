var firebaseConfig = {
  apiKey: "AIzaSyCwndgjTGuR30Sx-sDMP_3YDdqth5nKwE0",
  authDomain: "rps-multiplayer-148f9.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-148f9.firebaseio.com",
  projectId: "rps-multiplayer-148f9",
  storageBucket: "rps-multiplayer-148f9.appspot.com",
  messagingSenderId: "532502259116",
  appId: "1:532502259116:web:54ac2f1f19330a92710609"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var game = db.collection("Game").doc("Game");

// const qs = document.querySelector();
const gameID = Math.random()
  .toString(36)
  .substr(2, 9);

console.log(gameID);

// Initialize Game
$(".start-game-btn").on("click", function() {
  game.set({
    gameID: gameID,
    isOwner: "yes",
    gameover: "yes"
  });
  $(".col-12").html("");
  $(
    ".start-row"
  )[0].innerHTML += `<h4> Game ID is ${gameID}.  Have your opponent enter the Game ID to join the game.</h4>`;

  $(
    ".join-row"
  )[0].innerHTML += `<h2> Waiting for another player to join game.....</h2>`;
  $(
    ".other-row"
  )[0].innerHTML += `<button type="button" class="btn btn-primary btn-lg start-btn">Large button</button>`;
});

$(".other-row").on("click", ".start-btn", function(event) {
  console.log("Hello");
  event.preventDefault();
  game.onSnapshot(function(doc) {
    if (doc.data().gameID === doc.data().joiningID) {
      renderGame();
    }
  });
});

// Join Game Functionality
$(".join-game-btn").on("click", function(event) {
  $(".col-12").html("");
  $(".start-row")[0].innerHTML += `<form>
  <div class="form-group">
    <label for="GameIDInput">Enter The Game ID</label>
    <input type="text" class="form-control" id="gameIDInput" placeholder="Game ID">
  </div>
  <button type="submit" class="btn btn-primary begin-btn">Select</button>
</form>`;
  game.onSnapshot(function(doc) {
    if (doc.data().gameID === doc.data().joiningID) {
      renderGame();
      console.log("Hello");
    }
  });
});

$(".start-row").on("click", ".begin-btn", function(event) {
  event.preventDefault();
  game.set(
    {
      joiningID: $("#gameIDInput")
        .val()
        .trim()
    },
    { merge: true }
  );
  game.onSnapshot(function(doc) {
    if (doc.data().gameID === doc.data().joiningID) {
      renderGame();
      console.log("Hello");
    }
  });
});

function renderGame() {
  game.set(
    {
      joiningID: ""
    },
    { merge: true }
  );
  $(".col-12").html("");
  $(".start-row")[0].innerHTML += `<p>Choose Rock Paper or Scissors!</p>`;
  $(".join-row")[0].innerHTML += `<img src="../images/paper.jpg">`;
}
