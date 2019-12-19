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

function writeDataMerge(collection, doc, data) {
  db.collection(collection)
    .doc(doc)
    .set(data, { merge: true });
}

const db = firebase.firestore();
const game = db.collection("Game").doc("Game");
let roundNum = 0;
let currentRound = "round" + roundNum;
let answer;
let playersArray;
let nickname;

// const qs = document.querySelector();
const gameID = Math.random()
  .toString(36)
  .substr(2, 2);

console.log(gameID);

// A $( document ).ready() block.
$(document).ready(function() {
  game.set(
    {
      joiningID: ""
    },
    { merge: true }
  );
});

$(".container")[0].innerHTML += `
<div class="col-12 mt-4 mb-4 start-row d-flex justify-content-center">
<p class = "game-description"> Welcome to <span>Rock Paper Scissors!</span> <br> 
</div>
<div class="col-12 mt-4 mb-4 join-row d-flex justify-content-center">
  <button type="button" class="btn btn-secondary btn-lg create-game-btn">
    Create New Game
  </button>
</div>
<div class="col-12 other-row d-flex justify-content-center">
  <button type="button" class="btn btn-secondary btn-lg join-game-btn">
    Join Existing Game
  </button>
</div>`;

//=====================
// Initialize Game
$(".create-game-btn").on("click", function() {
  game.set({
    gameID: gameID,
    isOwner: "yes",
    gameover: "yes",
    players: []
  });
  db.collection("Game")
    .doc("player1")
    .set({});
  $(".col-12").html("");
  $(
    ".start-row"
  )[0].innerHTML += `<h4> Game ID is ${gameID}.  Have your opponent enter the Game ID to join the game.</h4>`;
  ///Join Game
  $(
    ".join-row"
  )[0].innerHTML += `<h2> Waiting for another player to join game.....</h2>`;
  $(
    ".other-row"
  )[0].innerHTML += `<button type="button" class="btn btn-primary btn-lg start-btn">Large button</button>`;
  db.collection(`Game`)
    .doc("Game")
    .set({
      gameID: gameID,
      roundCounter: 1,
      gameStarted: false
    });
  nickname = "player1";

  pushPlayersToDB("Game", nickname);
});

//function that pushes player to DB
function pushPlayersToDB(gameID, nicknameInput) {
  db.collection(gameID)
    .doc("Game")
    .update({
      players: firebase.firestore.FieldValue.arrayUnion(nicknameInput)
    });
}
///Start Button
$(".other-row").on("click", ".start-btn", function(event) {
  console.log("Hello");
  event.preventDefault();
  if (doc.data().gameID === doc.data().joiningID) {
    renderGame();
  }
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
  if (doc.data().gameID === doc.data().joiningID) {
    renderGame();
    console.log("Hello");
  }
});

$(".start-row").on("click", ".begin-btn", function(event) {
  event.preventDefault();
  let joinID = $("#gameIDInput")
    .val()
    .trim();

  game.set(
    {
      joiningID: joinID
    },
    { merge: true }
  );
  db.collection("Game")
    .doc("player2")
    .set({});
  nickname = "player2";
  pushPlayersToDB("Game", nickname);
});
game.onSnapshot(function(doc) {
  console.log(doc.data().gameID, doc.data().joiningID);
  if (doc.data().gameID === doc.data().joiningID) {
    console.log("Hello");
    //render players array
    db.collection("Game")
      .doc("Game")
      .get()
      .then(function(doc) {
        playersArray = doc.data()["players"];
        console.log(playersArray);
      });
    renderGame();
  }
});

//render Game Function
function renderGame() {
  roundNum++;
  game.set(
    {
      joiningID: "",
      gameover: "no"
    },
    { merge: true }
  );

  writeDataMerge("Game", currentRound, {});
  $(".col-12").html("");
  $(".start-row")[0].innerHTML += `<p>Choose Rock Paper or Scissors!</p>`;
  $(
    ".join-row"
  )[0].innerHTML += `<img class="paper" src="assets/images/paper.jpg" width="150"><img class="rock" src="assets/images/rock.jpg" width="150"><img class="scissors" src="assets/images/scisors.jpg" width="150">`;
}

// establishes players array

// select rock
function gameListeners(guess) {
  $(".join-row").on("click", `.${guess}`, function() {
    answer = guess;
    let data = {};
    data[`${nickname}`] = answer;
    console.log(data);
    writeDataMerge("Game", currentRound, data);
  });
}

gameListeners("rock");
gameListeners("paper");
gameListeners("scissors");
