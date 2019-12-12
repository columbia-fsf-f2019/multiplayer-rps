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

function writeDataMerge(collection, doc, key, value) {
  let data = {};
  data[key] = value;
  db.collection(collection)
    .doc(doc)
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
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerOne", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerTwo", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerOnePick", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerTwoPick", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerOneScore", 0);
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerTwoScore", 0);
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
        writeDataMerge(
          "players",
          "x403VpJmjGFGDJvo88UY",
          "playerOne",
          qs("#name-input").value
        );
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
        writeDataMerge(
          "players",
          "x403VpJmjGFGDJvo88UY",
          "playerTwo",
          qs("#name-input").value
        );
        setLocalPlayerData(qs("#name-input").value, 2, playerTwo);
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
    writeDataMerge(
      "players",
      "x403VpJmjGFGDJvo88UY",
      localPlayerKey + "pick",
      event.target.value
    );
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

        // Refresh the picks in the database
        writeDataMerge(
          "players",
          "x403VpJmjGFGDJvo88UY",
          "playerOnePick",
          "null"
        );
        writeDataMerge(
          "players",
          "x403VpJmjGFGDJvo88UY",
          "playerTwoPick",
          "null"
        );
      }
    });
}

function runRPSLogic(playerOnePick, playerTwoPick) {
  if (playerOnePick === "rocks") {
    if (playerTwoPick === "scissors") {
    }
  }
}
