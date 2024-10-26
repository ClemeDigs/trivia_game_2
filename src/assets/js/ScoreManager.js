export default class ScoreManager {
  constructor() {
    this.scorePercentHtml = document.querySelector(".score");
    this.numberQuestionHtml = document.querySelector(".number-questions");
    this.progressHtml = document.querySelector(".progress");

    this.score = [];
    this.currentScore = 0;
    this.currentScorePercent = 0;
  }

  calculateScorePercent(currentQuestionIndex) {
    const storedScore = JSON.parse(localStorage.getItem("score"));

    if (storedScore) {
      this.currentScore = storedScore;
    }

    if (currentQuestionIndex > 0) {
      this.currentScorePercent = Math.round(
        (this.currentScore * 100) / currentQuestionIndex
      );
    } else {
      this.currentScorePercent = 0;
    }

    localStorage.setItem("score", JSON.stringify(this.currentScore));

    return this.currentScorePercent;
  }

  displayScore(currentQuestionIndex) {
    this.numberQuestionHtml.textContent = currentQuestionIndex + " questions";
    this.scorePercentHtml.textContent =
      this.calculateScorePercent(currentQuestionIndex) + " %";
  }

  updateProgressBar(currentQuestionIndex, game) {
    this.progressHtml.style.width =
      (currentQuestionIndex * 100) / game.results.length + "%";
  }

  resetProgressBar() {
    this.progressHtml.style.width = 0 + "%";
  }

  resetScores() {
    this.numberQuestionHtml.textContent = 0 + " questions";
    this.scorePercentHtml.textContent = 0 + "&nbsp;%";
  }

  loadScoreFromLocalStorage() {
    const storedScore = JSON.parse(localStorage.getItem("score")) || [];
    this.score = storedScore;
    return this.score;
  }

  addScore(scorePercent, totalQuestions) {
    this.score.push(scorePercent);
    this.score.push(totalQuestions);
    this.saveScoreToLocalStorage();
  }

  incrementScore() {
    this.currentScore++;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  saveScoreToLocalStorage() {
    localStorage.setItem("score", JSON.stringify(this.currentScore));
  }
}
