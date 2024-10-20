export default class BestScores {
    constructor() {
        this.bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
        this.ecranFin = document.querySelector('.ecran-fin');
        this.modaleContainerBestScoresHtml = document.querySelector('.best-scores-modale');
        this.scoresHtml = '';
    }

    // Nouvelle méthode pour trier les scores
    sortScores() {
        this.bestScores.sort((a, b) => {
            return b.score - a.score;  // Tri décroissant
        });

        // Limiter à 10 meilleurs scores si nécessaire
        if (this.bestScores.length > 10) {
            this.bestScores = this.bestScores.slice(0, 10);  // Garder seulement les 10 meilleurs
        }
    }

    toBestScoreLigne() {
        const scoresContainer = document.createElement('div');
        
        this.bestScores.forEach(bestScore => {
            // Parser l'utilisateur s'il est encore une chaîne JSON
            const user = typeof bestScore.user === 'string' ? JSON.parse(bestScore.user) : bestScore.user;
            
            const divBestScore = document.createElement('div');
            divBestScore.className = 'flex items-center gap-6';
            divBestScore.innerHTML = `
                <img class="w-[60px]" src="${user.avatar}" alt="avatar de ${user.name}">
                <p class="font-bold">${user.name}</p>
                <p class="bg-score-img bg-[length:80%] bg-no-repeat bg-center md:text-[3.125rem] font-semibold text-center text-offWhite drop-shadow-trivia px-4 py-5 md:px-8 md:py-10">${bestScore.score} %</p>
            `;
            scoresContainer.appendChild(divBestScore);  // Ajouter chaque score au conteneur
        });

        return scoresContainer;  // Retourner le conteneur des scores
    }

    displayBestScores() {
        // Vider le contenu précédent des conteneurs
        this.ecranFin.innerHTML = '';
        this.modaleContainerBestScoresHtml.innerHTML = '';

        // Trier les scores avant de les afficher
        this.sortScores();

        // Générer les nouveaux scores
        this.scoresHtml = this.toBestScoreLigne();

        // Ajouter le conteneur des scores à l'écran fin
        this.ecranFin.appendChild(this.scoresHtml);

        // Cloner le conteneur des scores pour l'ajouter également à la modale
        const scoresClone = this.scoresHtml.cloneNode(true);  // Cloner avec les enfants
        this.modaleContainerBestScoresHtml.appendChild(scoresClone);
    }
}
