var firebaseConfig = {
  apiKey: "AIzaSyD5gJ2sYTs_NIK_ezudGbP_dKCKlU8awHo",
  authDomain: "rps-multi2.firebaseapp.com",
  databaseURL: "https://rps-multi2.firebaseio.com",
  projectId: "rps-multi2",
  storageBucket: "rps-multi2.appspot.com",
  messagingSenderId: "689284357464",
  appId: "1:689284357464:web:7d4326e126d50fc93c592d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function writeDataMerge(collection, doc, data) {
  db.collection(collection)
    .doc(doc)
    .set(data, { merge: true });
}

const db = firebase.firestore();
let game;
let roundNum = 0;
let currentRound = "round" + roundNum;
let answer;
let playersArray;
let nickname;
let unsubJoin;
let unsubStart;
let gameID;

// const qs = document.querySelector();

// // A $( document ).ready() block.
// $(document).ready(function() {
//   game.set(
//     {
//       joiningID: ""
//     },
//     { merge: true }
//   );
// });

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
  gameID = Math.random()
    .toString(36)
    .substr(2, 2);

  console.log(gameID);
  game = db.collection(gameID).doc("Game");
  game.set({
    gameID: gameID
  });

  let pushPlayer1 = {};
  pushPlayer1["player1"] = 0;
  writeDataMerge(gameID, "Game", pushPlayer1);
  console.log(pushPlayer1);
  nickname = "player1";

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

  db.collection(gameID)
    .doc("Game")
    .set(
      {
        gameID: gameID,
        roundCounter: 1
      },
      { merge: true }
    );

  unsubStart = game.onSnapshot(function(doc) {
    console.log(doc.data().gameID, doc.data().joiningID);
    if (doc.data().gameID === doc.data().joiningID) {
      console.log("Hello");
      //render players array
      renderGame();
      unsubStart();
    }
  });
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
});

$(".start-row").on("click", ".begin-btn", function(event) {
  event.preventDefault();
  let joinID = $("#gameIDInput")
    .val()
    .trim();

  db.collection(joinID)
    .doc("Game")
    .set(
      {
        joiningID: joinID
      },
      { merge: true }
    );
  let pushPlayer2 = {};
  pushPlayer2["player2"] = 0;
  writeDataMerge(joinID, "Game", pushPlayer2);
  nickname = "player2";
  unsubJoin = db
    .collection(joinID)
    .doc("Game")
    .onSnapshot(function(doc) {
      if (doc.data().gameID === doc.data().joiningID) {
        gameID = joinID;
        renderGame();
        console.log("Hello");
        unsubJoin();
      }
    });
});

//render Game Function
function renderGame() {
  roundNum++;
  writeDataMerge(gameID, currentRound, {});
  $(".col-12").html("");
  $(".start-row")[0].innerHTML += `<p>Choose Rock Paper or Scissors!</p>`;
  $(
    ".join-row"
  )[0].innerHTML += `<img class="paper" src="assets/images/paper.jpg" width="150"><img class="rock" src="assets/images/rock.jpg" width="150"><img class="scissors" src="assets/images/scisors.jpg" width="150">`;
}

// select rock
function gameListeners(guess) {
  $(".join-row").on("click", `.${guess}`, function() {
    answer = guess;
    let data = {};
    data[`${nickname}`] = answer;
    console.log(data);
    writeDataMerge(gameID, currentRound, data);
    selectWinner();
  });
}

gameListeners("rock");
gameListeners("paper");
gameListeners("scissors");

function selectWinner() {
  db.collection(gameID)
    .doc(currentRound)
    .get()
    .then(function(doc) {
      if (doc.data()["player1"] === "rock") {
        if (doc.data()["player2"] === "scissors") {
          console.log("player1 wins");
        } else if (doc.data()["player2"] === "paper") {
          console.log("player2 wins");
        }
      }
      if (doc.data()["player1"] === "paper") {
        if (doc.data()["player2"] === "rock") {
          console.log("player1 wins");
        } else if (doc.data()["player2"] === "scissors") {
          console.log("player2 wins");
        }
      }
      if (doc.data()["player1"] === "scissors") {
        if (doc.data()["player2"] === "paper") {
          console.log("player1 wins");
        } else if (doc.data()["player2"] === "rock") {
          console.log("player2 wins");
        }
      }
    });
}
