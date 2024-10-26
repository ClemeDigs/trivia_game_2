import Settings from "./Settings.js";
import PageChanger from "./Page-Changer.js";
import ScoreManager from "./ScoreManager.js";
import User from "./User";
import BestScores from "./BestScores.js";
import Game from "./Game.js";
import Slider from "./Slider";

const settingsManager = new Settings();
const pageChanger = new PageChanger();
const scoreManager = new ScoreManager();
const gameManager = new Game();
const slider = new Slider();

const gameUrl = settingsManager.getUrlBySettings();
const modaleContinue = document.querySelector(".modale-continue");
const btnContinue = document.querySelector(".btn-continue");
const btnsRestart = document.querySelectorAll(".btn-restart");
const btnsStart = document.querySelectorAll(".btn-start");
const inputName = document.getElementById("user-name");
const choosenAvatar = document.querySelector(".img-avatar");
const currentNameHtml = document.querySelector(".current-name");
const currentAvatarHtml = document.querySelector(".current-avatar");
const msgError = document.querySelector(".msg-error");
let bestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
const bestScoresInstance = new BestScores(bestScores);

function checkCurrentUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return pageChanger.switchScreen("accueil");
  }

  if (gameManager.gameFromLocalStorage()) {
    pageChanger.switchScreen("game");
    scoreManager.displayScore(gameManager.currentQuestionIndex);
    gameManager.displayQuestion();
    modaleContinue.setAttribute("open", "");
    currentNameHtml.textContent = currentUser.name;
    currentAvatarHtml.setAttribute("src", currentUser.avatar);
  } else {
    pageChanger.switchScreen("accueil");
  }
}

checkCurrentUser();

btnsStart.forEach((btnStart) => {
  btnStart.addEventListener("click", () => {
    const username = inputName.value.trim();
    if (username.length > 1) {
      msgError.textContent = "";
      const user = new User(username, choosenAvatar.getAttribute("src"));
      user.saveCurrentUser();
      gameManager.fetchGame(gameUrl);
    } else {
      msgError.textContent = "Veuillez entrer un nom d'utilisateur.";
    }
  });
});

btnContinue.addEventListener("click", () => {
  gameManager.continueGame();
});

btnsRestart.forEach((btnRestart) => {
  btnRestart.addEventListener("click", () => {
    gameManager.restartGame();
  });
});

bestScoresInstance.displayBestScores();
scoreManager.displayScore(scoreManager.currentQuestionIndex);
