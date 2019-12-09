const db = firebase.firestore();
const qs = selector => document.querySelector(selector);

db.collection("players")
  .doc("x403VpJmjGFGDJvo88UY")
  .onSnapshot(function(doc) {
    console.log("Current data: ", doc.data());
  });

// Upon page load check for whether or not other players are registered
db.collection("players")
  .doc("x403VpJmjGFGDJvo88UY")
  .onSnapshot(function(doc) {
    let playerOne = doc.data()["playerOne"];
    let playerTwo = doc.data()["playerTwo"];
    if (playerOne === "null") {
      // No one has yet joined the game
      qs("#player-form").style.display = "block";
    } else if (playerTwo === "null") {
      // Only playerOne has joined the game
      qs("#player-form").style.display = "block";
      qs("#waiting-player").innerText = `${playerOne} is waiting for you!`;
    } else {
      // The game is in session
      qs("#player-form").style.display = "none";
    }
  });
