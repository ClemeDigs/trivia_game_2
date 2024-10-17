export default class BestScores {
    constructor() {
        this.bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
    }

    toBestScoreLigne() {
        // Créer un conteneur pour les scores
        const scoresContainer = document.createElement('div');
        
        this.bestScores.forEach(bestScore => {
            // Parser l'utilisateur s'il est encore une chaîne JSON
            const user = typeof bestScore.user === 'string' ? JSON.parse(bestScore.user) : bestScore.user;
            
            const divBestScore = document.createElement('div');
            divBestScore.innerHTML = `
            <img class="w-[60px]" src="${user.avatar}" alt="avatar de ${user.name}">
            <p>${user.name}</p>
            <p>${bestScore.score} %</p>
            `;
            scoresContainer.appendChild(divBestScore);  // Ajouter chaque score au conteneur
        });

        return scoresContainer;  // Retourner le conteneur des scores
    }
}
