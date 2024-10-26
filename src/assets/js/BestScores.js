export default class BestScores {
  constructor() {
    this.bestScores = [];
    this.savedBestScores = JSON.parse(localStorage.getItem("bestScores")) || [];
    this.bestScoresContainer = document.querySelector(".best-scores-container");
    this.modaleContainerBestScoresHtml = document.querySelector(
      ".best-scores-modale"
    );
  }

  sortScores() {
    this.savedBestScores.sort((a, b) => b.score - a.score);
    if (this.savedBestScores.length > 10) {
      this.savedBestScores = this.savedBestScores.slice(0, 10);
    }
  }

  toBestScoreLigne() {
    let scoresHtml = "";
    this.savedBestScores.forEach((bestScore) => {
      const user =
        typeof bestScore.user === "string"
          ? JSON.parse(bestScore.user)
          : bestScore.user;
      const date = new Date(bestScore.date);
      const options = { year: "numeric", month: "long", day: "numeric" };

      scoresHtml += `
        <div class="flex items-center gap-3 md:gap-4 lg:gap-6">
          <img class="w-[50px] md:w-[65px] lg:w-[80px]" src="${
            user.avatar
          }" alt="avatar de ${user.name}">
          <p class="font-bold">${user.name}</p>
          <p class="bg-score-img bg-[length:70%] lg:bg-[length:75%] bg-no-repeat bg-center text-[16px] md:text-[20px] lg:text-[38px] font-semibold text-center text-offWhite drop-shadow-trivia px-4 py-5 md:px-8 md:py-10">
            ${bestScore.score} %
          </p>
          <p class="text-sm font-bold">${date.toLocaleDateString(
            "en-US",
            options
          )}</p>
        </div>
      `;
    });
    return scoresHtml;
  }

  displayBestScores() {
    this.sortScores();
    const scoresHtml = this.toBestScoreLigne();

    // Remplir chaque conteneur avec les scores sans duplication
    this.bestScoresContainer.innerHTML = scoresHtml;
    this.modaleContainerBestScoresHtml.innerHTML = scoresHtml;
  }
}
