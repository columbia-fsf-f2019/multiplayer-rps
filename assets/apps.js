const db = firebase.firestore();
const qs = selector => document.querySelector(selector);
let localPlayerName;
let localPlayerNumber;
let localPlayerKey;

let isGameRunning = false;

db.collection("players")
  .doc("x403VpJmjGFGDJvo88UY")
  .onSnapshot(function(doc) {
    console.log("Current data: ", doc.data());
  });

function writeDataMerge(key, value) {
  let data = {};
  data[key] = value;
  db.collection("players")
    .doc("x403VpJmjGFGDJvo88UY")
    .set(data, { merge: true });
}

function writeDataOverWrite(collection, doc, key, value) {
  let data = {};
  data[key] = value;
  db.collection(collection)
    .doc(doc)
    .set(data);
}

function setLocalPlayerData(name, number, key) {
  localPlayerName = name;
  localPlayerNumber = number;
  localPlayerKey = key;
}
function resetGame() {
  writeDataMerge("playerOne", "null");
  writeDataMerge("playerTwo", "null");
  writeDataMerge("playerOnePick", "null");
  writeDataMerge("playerTwoPick", "null");
  writeDataMerge("playerOneScore", 0);
  writeDataMerge("playerTwoScore", 0);
}

// Upon page load check for whether or not other players are registered
db.collection("players")
  .doc("x403VpJmjGFGDJvo88UY")
  .onSnapshot(function(doc) {
    let playerOne = doc.data()["playerOne"];
    let playerTwo = doc.data()["playerTwo"];
    if (playerOne === "null") {
      // No one has yet joined the game
      qs("#player-form").style.display = "block";
      qs("#add-user").onclick = function(event) {
        event.preventDefault();
        writeDataMerge("playerOne", qs("#name-input").value);
        setLocalPlayerData(qs("#name-input").value, 1, "playerOne");
        qs("#waiting-player").innerText = `You're all set! Hang tight`;
        qs("#player-form").style.display = "none";
        db.collection("players")
          .doc("x403VpJmjGFGDJvo88UY")
          .onSnapshot(function(doc) {
            let playerTwoHolder = doc.data()["playerTwo"];
            if (playerTwoHolder != "null") {
              launchGame();
              qs("#waiting-player").style.display = "none";
            }
          });
      };
    } else if (playerTwo === "null" && localPlayerNumber != 1) {
      // Only playerOne has joined the game
      qs("#player-form").style.display = "block";
      qs("#waiting-player").innerText = `${playerOne} is waiting for you!`;
      qs("#add-user").onclick = function(event) {
        event.preventDefault();
        writeDataMerge("playerTwo", qs("#name-input").value);
        setLocalPlayerData(qs("#name-input").value, 2, "playerTwo");
        qs("#player-form").style.display = "none";
        qs("#waiting-player").style.display = "none";
        if (isGameRunning === false) {
          launchGame();
        }
      };
      // The game is in session
    }
  });

// Function for launching the actual game
function launchGame() {
  isGameRunning = true;
  qs(".game-holder").classList.remove("hidden");
  qs(".game-holder").onclick = function(event) {
    writeDataMerge(localPlayerKey + "Pick", event.target.value);
  };
  if (localPlayerNumber === 1) {
    judgeGame();
  }
}

// Here is the "server-side" logic that will listen to both responses and judge them if both players put in a response
function judgeGame() {
  db.collection("players")
    .doc("x403VpJmjGFGDJvo88UY")
    .onSnapshot(function(doc) {
      let playerOnePick = doc.data()["playerOnePick"];
      let playerTwoPick = doc.data()["playerTwoPick"];
      let playerOneScore = doc.data()["playerOneScore"];
      let playerTwoScore = doc.data()["playerTwoScore"];

      if (playerOnePick != "null" && playerTwoPick != "null") {
        // Run the RPS logic
        runRPSLogic(
          playerOnePick,
          playerTwoPick,
          playerOneScore,
          playerTwoScore
        );
        // Refresh the picks in the database
        writeDataMerge("playerOnePick", "null");
        writeDataMerge("playerTwoPick", "null");
      }
    });
}

function runRPSLogic(
  playerOnePick,
  playerTwoPick,
  playerOneScore,
  playerTwoScore
) {
  if (playerOnePick === "rocks") {
    if (playerTwoPick === "scissors") {
      playerOneScore++;
      writeDataMerge("playerOneScore", playerOneScore);
    } else if (playerTwoPick === "rocks") {
      // Tie
    } else if (playerTwoPick === "paper") {
      playerTwoScore++;
      writeDataMerge("playerTwoScore", playerTwoScore);
    }
  } else if (playerOnePick === "scissors") {
    if (playerTwoPick === "scissors") {
      // Tie
    } else if (playerTwoPick === "rocks") {
      playerTwoScore++;
      writeDataMerge("playerTwoScore", playerTwoScore);
    } else if (playerTwoPick === "paper") {
      playerOneScore++;
      writeDataMerge("playerOneScore", playerOneScore);
    }
  } else if (playerOnePick === "paper") {
    if (playerTwoPick === "scissors") {
      playerTwoScore++;
      writeDataMerge("playerTwoScore", playerTwoScore);
    } else if (playerTwoPick === "rocks") {
      playerOneScore++;
      writeDataMerge("playerOneScore", playerOneScore);
    } else if (playerTwoPick === "paper") {
      // Tie
    }
  }
}

// function updateScoreBoard
