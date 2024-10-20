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
            divBestScore.className = 'flex items-center gap-6'
            divBestScore.innerHTML = `
            <img class="w-[60px]" src="${user.avatar}" alt="avatar de ${user.name}">
            <p class="font-bold">${user.name}</p>
            <p class="bg-score-img bg-[length:80%] bg-no-repeat bg-center md:text-[3.125rem] font-semibold text-center text-offWhite drop-shadow-trivia px-4 py-5 md:px-8 md:py-10">${bestScore.score} %</p>
            `;
            scoresContainer.appendChild(divBestScore);  // Ajouter chaque score au conteneur
        });

        return scoresContainer;  // Retourner le conteneur des scores
    }
}
