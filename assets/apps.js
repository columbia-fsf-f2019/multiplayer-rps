const db = firebase.firestore();
const qs = selector => document.querySelector(selector);

let isGameRunning = false;

db.collection("players")
  .doc("x403VpJmjGFGDJvo88UY")
  .onSnapshot(function(doc) {
    console.log("Current data: ", doc.data());
  });

function writeData(key, value) {
  let data = {};
  data[key] = value;
  db.collection("players")
    .doc("x403VpJmjGFGDJvo88UY")
    .set(data, { merge: true });
}

function resetGame() {
  writeData("playerOne", "null");
  writeData("playerTwo", "null");
}

function launchGame() {
  let isGameRunning = true;
  qs(".game-holder").classList.remove("hidden");
  console.log("step 1");
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
        writeData("playerOne", qs("#name-input").value);
        qs("#waiting-player").innerText = `You're all set! Hang tight`;
        qs("#player-form").style.display = "none";
      };
    } else if (playerTwo === "null") {
      // Only playerOne has joined the game
      qs("#player-form").style.display = "block";
      qs("#waiting-player").innerText = `${playerOne} is waiting for you!`;
      qs("#add-user").onclick = function(event) {
        event.preventDefault();
        writeData("playerTwo", qs("#name-input").value);
      };
    } else {
      // The game is in session
      qs("#player-form").style.display = "none";
      qs("#waiting-player").style.display = "none";
      if (isGameRunning === false) {
        launchGame();
      }
    }
  });
