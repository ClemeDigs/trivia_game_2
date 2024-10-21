export default class BestScores {
    constructor() {
        this.bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
        this.ecranFin = document.querySelector('.ecran-fin');
        this.modaleContainerBestScoresHtml = document.querySelector('.best-scores-modale');
        this.scoresHtml = '';
    }

    sortScores() {
        this.bestScores.sort((a, b) => {
            return b.score - a.score;
        });

        if (this.bestScores.length > 10) {
            this.bestScores = this.bestScores.slice(0, 10);
        }
    }

    toBestScoreLigne() {
        const scoresContainer = document.createElement('div');
        
        this.bestScores.forEach(bestScore => {
            const user = typeof bestScore.user === 'string' ? JSON.parse(bestScore.user) : bestScore.user;
            
            const divBestScore = document.createElement('div');
            divBestScore.className = 'flex items-center gap-6';
            divBestScore.innerHTML = `
                <img class="w-[60px]" src="${user.avatar}" alt="avatar de ${user.name}">
                <p class="font-bold">${user.name}</p>
                <p class="bg-score-img bg-[length:80%] bg-no-repeat bg-center md:text-[3.125rem] font-semibold text-center text-offWhite drop-shadow-trivia px-4 py-5 md:px-8 md:py-10">${bestScore.score} %</p>
            `;
            scoresContainer.appendChild(divBestScore);
        });

        return scoresContainer;
    }

    displayBestScores() {
        this.ecranFin.innerHTML = '';
        this.modaleContainerBestScoresHtml.innerHTML = '';

        this.sortScores();
        this.scoresHtml = this.toBestScoreLigne();
        
        this.ecranFin.appendChild(this.scoresHtml);

        const scoresClone = this.scoresHtml.cloneNode(true);  
        this.modaleContainerBestScoresHtml.appendChild(scoresClone);
    }
}
