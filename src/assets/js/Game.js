import ScoreManager from "./ScoreManager";
import PageChanger from "./Page-Changer";
import BestScores from "./BestScores.js";
import Dialog from "./Dialog.js";

const dialogManager = new Dialog();
const pageChanger = new PageChanger();
const scoreManager = new ScoreManager();
const bestScoresInstance = new BestScores();

export default class Game {
  constructor() {
    this.currentQuestionIndex = 0;

    this.questionHtml = document.querySelector(".question");
    this.responsesHtml = document.querySelectorAll(".response");
    this.modaleContinue = document.querySelector(".modale-continue");
  }

  fetchGame(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.game = data;
        localStorage.setItem("oldGame", JSON.stringify(this.game));
        this.displayQuestion();
        pageChanger.switchScreen("game");
      })
      .catch((error) => {
        console.error("Erreur de fetch:", error);
      });
  }

  gameFromLocalStorage() {
    let oldGameData = localStorage.getItem("oldGame");
    if (oldGameData) {
      this.game = JSON.parse(oldGameData);
      this.currentQuestionIndex =
        JSON.parse(localStorage.getItem("currentQuestion")) || 0;
      return true;
    }
    return false;
  }

  verifyAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
      scoreManager.incrementScore();
    }
    this.currentQuestionIndex++;
    localStorage.setItem(
      "currentQuestion",
      JSON.stringify(this.currentQuestionIndex)
    );
    this.displayQuestion();
    scoreManager.displayScore(this.currentQuestionIndex);
  }

  decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  displayQuestion() {
    if (this.currentQuestionIndex >= this.game.results.length) {
      return this.endGame();
    }

    const question = this.game.results[this.currentQuestionIndex].question;
    this.questionHtml.innerHTML = this.decodeHtml(question);

    const correctAnswer =
      this.game.results[this.currentQuestionIndex].correct_answer;
    let responses =
      this.game.results[this.currentQuestionIndex].incorrect_answers.concat(
        correctAnswer
      );
    responses.sort(() => Math.random() - 0.5);

    if (responses.length === 2) {
      this.responsesHtml.forEach((responseHtml, index) => {
        if (index < 2) {
          responseHtml.classList.remove("hidden");
          responseHtml.textContent = this.decodeHtml(responses[index]);
          responseHtml.onclick = () =>
            this.verifyAnswer(responses[index], correctAnswer);
        } else {
          responseHtml.classList.add("hidden");
        }
      });
    } else {
      this.responsesHtml.forEach((responseHtml, index) => {
        responseHtml.classList.remove("hidden");
        responseHtml.textContent = this.decodeHtml(responses[index]);
        responseHtml.onclick = () =>
          this.verifyAnswer(responses[index], correctAnswer);
      });
    }
    scoreManager.updateProgressBar(this.currentQuestionIndex, this.game);
    scoreManager.displayScore(this.currentQuestionIndex);
  }

  endGame() {
    pageChanger.switchScreen("end");
    scoreManager.displayScore(this.currentQuestionIndex);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Créer un nouvel objet score
    const userScore = {
      user: currentUser,
      score: scoreManager.calculateScorePercent(this.currentQuestionIndex),
      date: new Date().toISOString(), // Stocker la date au format ISO
    };

    // Ajouter le score à l'instance des meilleurs scores
    bestScoresInstance.savedBestScores.push(userScore);
    bestScoresInstance.sortScores();

    // Mettre à jour le stockage local avec les meilleurs scores
    localStorage.setItem(
      "bestScores",
      JSON.stringify(bestScoresInstance.savedBestScores)
    );

    // Réinitialiser le jeu
    this.resetGame();

    // Afficher les meilleurs scores
    bestScoresInstance.displayBestScores();
  }

  resetGame() {
    this.resetLocalStorage();
    this.game = {};
    this.questionHtml.textContent = "";
    this.responsesHtml.forEach((response) => (response.textContent = ""));
  }

  resetLocalStorage() {
    localStorage.removeItem("oldGame");
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("score");
  }

  restartGame() {
    this.resetGame();
    this.currentQuestionIndex = 0;
    scoreManager.currentScore = 0;
    scoreManager.resetScores();
    scoreManager.resetProgressBar();
    localStorage.removeItem("currentUser");
    this.modaleContinue.setAttribute("closing", "");
    this.modaleContinue.removeAttribute("open");
    pageChanger.switchScreen("accueil");
    console.log("game restart");
  }

  continueGame() {
    this.modaleContinue.setAttribute("closing", "");
    this.modaleContinue.removeAttribute("open");
    scoreManager.displayScore(this.currentQuestionIndex);
    this.displayQuestion();
  }
}
