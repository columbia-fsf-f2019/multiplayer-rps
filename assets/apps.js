const db = firebase.firestore();
const qs = selector => document.querySelector(selector);
let localPlayerName;
let localPlayerNumber;

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

function setLocalPlayerData(name, number) {
  localPlayerName = name;
  localPlayerNumber = number;
}
function resetGame() {
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerOne", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerTwo", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerOnePick", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerTwoPick", "null");
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerOneScore", 0);
  writeDataMerge("players", "x403VpJmjGFGDJvo88UY", "playerTwoScore", 0);
}

function launchGame() {
  isGameRunning = true;
  qs(".game-holder").classList.remove("hidden");
  qs(".game-holder").onclick = function(event) {
    console.log(event.target.value);
  };
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
        setLocalPlayerData(qs("#name-input").value, 1);
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
        setLocalPlayerData(qs("#name-input").value, 2);
        qs("#player-form").style.display = "none";
        qs("#waiting-player").style.display = "none";
        if (isGameRunning === false) {
          launchGame();
        }
      };
      // The game is in session
    }
  });
