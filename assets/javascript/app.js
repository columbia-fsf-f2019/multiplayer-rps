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
var joiningGame;

// const qs = document.querySelector();
const gameID = Math.random()
  .toString(36)
  .substr(2, 9);

console.log(gameID);

// Initialize Game
$(".start-game-btn").on("click", function() {
  db.collection("Game")
    .doc("Game")
    .set({
      gameID: gameID,
      isOwner: "yes",
      gameover: "no"
    });
  $(".col-12").html("");
  $(
    ".start-row"
  )[0].innerHTML += `<h4> Game ID is ${gameID}.  Have your opponent enter the Game ID to join the game.</h4>`;

  $(
    ".join-row"
  )[0].innerHTML += `<h2> Waiting for another player to join game.....</h2>`;
});

$(".join-game-btn").on("click", function(event) {
  $(".col-12").html("");
  $(".start-row")[0].innerHTML += `<form>
  <div class="form-group">
    <label for="GameIDInput">Enter The Game ID</label>
    <input type="text" class="form-control" id="gameIDInput" placeholder="Game ID">
  </div>
  <button type="submit" class="btn btn-primary begin-btn">Submit</button>
</form>`;
});

$(".start-row").on("click", ".begin-btn", function(event) {
  event.preventDefault();
  joiningGame = $("#gameIDInput")
    .val()
    .trim();
  console.log(joiningGame);
  return joiningGame;
});

db.collection("Game")
  .doc("Game")
  .onSnapshot(function(doc) {
    if (doc.data().gameID === joiningGame);
    {
      console.log("itworked");
    }
  });
