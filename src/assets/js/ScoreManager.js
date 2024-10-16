export default class ScoreManager {
    constructor() {
        this.score = [];
        this.currentScore = 0;
        this.currentScorePercent = 0;
    }

    // Méthode pour calculer le pourcentage du score
    calculateScorePercent(currentQuestionIndex) {
        if (!isNaN(Math.round(this.currentScore * 100 / currentQuestionIndex))) {
            this.currentScorePercent = Math.round(this.currentScore * 100 / currentQuestionIndex);
        } else {
            this.currentScorePercent = 0;
        }
        return this.currentScorePercent;
    }

    // Méthode pour stocker le score dans le localStorage
    saveScoreToLocalStorage() {
        localStorage.setItem('score', JSON.stringify(this.score));
    }

    // Méthode pour récupérer le score depuis le localStorage
    loadScoreFromLocalStorage() {
        const storedScore = JSON.parse(localStorage.getItem('score')) || [];
        this.score = storedScore;
        return this.score;
    }

    // Méthode pour ajouter un score
    addScore(scorePercent, totalQuestions) {
        this.score.push(scorePercent);
        this.score.push(totalQuestions);
        this.saveScoreToLocalStorage();
    }

    // Méthode pour incrémenter le score actuel
    incrementScore() {
        this.currentScore++;
    }

    // Obtenir le score actuel
    getCurrentScore() {
        return this.currentScore;
    }
}


