import './settings.js';
import PageChanger from './Page-Changer.js';
import ScoreManager from './ScoreManager.js';

const pageChanger = new PageChanger();
const scoreManager = new ScoreManager();

let game = {};
let currentQuestionIndex = 0;
const questionHtml = document.querySelector('.question');
const responsesHtml = document.querySelectorAll('.response');
const scorePercentHtml = document.querySelector('.score');
const numberQuestionHtml = document.querySelector('.number-questions');
const progressHtml = document.querySelector('.progress');
const modaleContinue = document.querySelector('.modale-continue');
const btnContinue = document.querySelector('.btn-continue');
const btnRestart = document.querySelector('.btn-restart');
let oldGame = JSON.parse(localStorage.getItem('oldGame')) || null;

function fetchGame(url) {
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            game = data;
            displayQuestion();
        });
};

function getUrlBySettings() {
    const url = 'https://opentdb.com/api.php';
    let savedSettings = JSON.parse(localStorage.getItem('settings'));

    if (!savedSettings) {
        return url + '?amount=10';  // Définir une valeur par défaut si aucun paramètre n'est trouvé
    }

    let settingsUrl = `${url}?amount=${savedSettings.nbQuestions}`;

    if (savedSettings.category && savedSettings.category !== 'any') {
        settingsUrl += `&category=${savedSettings.category}`;
    }
    if (savedSettings.difficulty && savedSettings.difficulty !== 'any') {
        settingsUrl += `&difficulty=${savedSettings.difficulty}`;
    }
    if (savedSettings.type && savedSettings.type !== 'any') {
        settingsUrl += `&type=${savedSettings.type}`;
    }

    return settingsUrl;
}

function displayScore() {
    numberQuestionHtml.textContent = currentQuestionIndex + ' questions';
    scorePercentHtml.textContent = scoreManager.calculateScorePercent(currentQuestionIndex) + ' %';
}

function displayQuestion() {
/*     gameToLocalStorage(); */
    
    // Vérifier que 'game.results' est bien défini et que c'est un tableau
    if (!game.results || !Array.isArray(game.results)) {
        console.error('Les résultats du jeu ne sont pas disponibles ou sont invalides');
        return endGame(); // Ou autre logique pour gérer le cas d'erreur
    }

    if (currentQuestionIndex >= game.results.length) {
        return endGame();
    }

    let question = game.results[currentQuestionIndex].question;
    questionHtml.textContent = question;

    let correctAnswer = game.results[currentQuestionIndex].correct_answer;
    let responses = game.results[currentQuestionIndex].incorrect_answers.concat(correctAnswer);
    responses.sort(() => Math.random() - 0.5);

    // Si la question a seulement 2 réponses (par exemple, type vrai/faux)
    if (responses.length === 2) {
        responsesHtml.forEach((responseHtml, index) => {
            if (index < 2) {
                responseHtml.classList.remove('hidden');
                responseHtml.textContent = responses[index];
                responseHtml.onclick = () => verifyAnswer(responses[index], correctAnswer);
            } else {
                responseHtml.classList.add('hidden'); // Cacher les boutons 3 et 4
            }
        });
    } else {
        responsesHtml.forEach((responseHtml, index) => {
            responseHtml.classList.remove('hidden');
            responseHtml.textContent = responses[index];
            responseHtml.onclick = () => verifyAnswer(responses[index], correctAnswer);
        });
    }
    progressHtml.style.width = (currentQuestionIndex * 100) / game.results.length + '%';
}

function verifyAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        scoreManager.incrementScore();
    }
    currentQuestionIndex++;
    displayQuestion();
    displayScore();
}


// Fonction pour continuer la partie
function continueGame() {
    modaleContinue.removeAttribute('open');
    displayQuestion(); // Reprendre la partie là où elle s'était arrêtée
}

function restartGame() {
    game = {};
    // Supprimer les données du jeu dans le localStorage
    localStorage.removeItem('oldGame');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('currentUser');
    pageChanger.switchScreen('accueil');
}

function endGame() {
    displayScore();
    const totalQuestions = game.results ? game.results.length : 0;
    game = {};
    // Supprimer les données du jeu dans le localStorage
    localStorage.removeItem('oldGame');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('currentUser');
    // Ajouter un état de fin de partie
    localStorage.setItem('gameFinished', 'true'); // Indicateur de fin de partie
    scoreManager.addScore(scoreManager.currentScorePercent, totalQuestions);
    questionHtml.textContent = `Fin du jeu ! Votre score : ${scoreManager.getCurrentScore()}/${totalQuestions}`;
    responsesHtml.forEach(response => response.textContent = '');
    pageChanger.switchScreen('end');
}

// Appeler displayScore et gameFromLocalStorage pour restaurer le jeu
displayScore();
fetchGame(getUrlBySettings());


/* gameFromLocalStorage(); */


/* function gameToLocalStorage(){
    localStorage.setItem('oldGame', JSON.stringify(game));
    localStorage.setItem('currentQuestion', currentQuestionIndex);
} */



/* function gameFromLocalStorage() {
    // Vérifier si la partie est terminée
    const isGameFinished = localStorage.getItem('gameFinished');

    if (isGameFinished === 'true') {
        // Supprimer l'indicateur de fin de jeu et rediriger vers l'accueil
        localStorage.removeItem('gameFinished');
        pageChanger.switchScreen('default');
        return;
    }

    let oldGameData = localStorage.getItem('oldGame');
    
    if (oldGameData) {
        game = JSON.parse(oldGameData);
        currentQuestionIndex = JSON.parse(localStorage.getItem('currentQuestion')) || 0;

        if (game.results && Array.isArray(game.results)) {
            // Afficher la modale continue pour proposer de reprendre la partie
            modaleContinue.setAttribute('open', '');

            // Suppression des anciens écouteurs d'événements pour éviter la duplication
            btnContinue.removeEventListener('click', continueGame);
            btnRestart.removeEventListener('click', restartGame);

            // Ajout des nouveaux écouteurs d'événements
            btnContinue.addEventListener('click', continueGame);
            btnRestart.addEventListener('click', restartGame);
        } else {
            console.error("Les résultats du jeu n'ont pas été trouvés dans le localStorage");
            pageChanger.switchScreen('default');
        }
    } else {
        console.warn('Aucune partie précédente trouvée dans le localStorage');
        pageChanger.switchScreen('default');
    }
} */


/* function gameFromLocalStorage(){
    // Charger les anciennes données
    let oldGameData = localStorage.getItem('oldGame');
    
    // Vérifier que les données existent et les parser si elles sont présentes
    if (oldGameData) {
        modaleContinue.setAttribute('open', '');
        btnContinue.addEventListener('click', () => {
            // S'assurer que 'game.results' existe bien
            if (game.results && Array.isArray(game.results)) {
                currentQuestionIndex = JSON.parse(localStorage.getItem('currentQuestion')) || 0;
                displayQuestion();
            } else {
                console.error("Les résultats du jeu n'ont pas été trouvés dans le localStorage");
                // Gérer l'erreur, peut-être relancer un nouveau fetch ou afficher un message d'erreur
            }
            modaleContinue.setAttribute('closing', '');
        })

        btnRestart.addEventListener('click', () => {
            game = {};
            // Supprimer les données du jeu dans le localStorage
            localStorage.removeItem('oldGame');
            localStorage.removeItem('currentQuestion');
            pageChanger.switchScreen('default');
            modaleContinue.setAttribute('closing', '');
        }) 
        game = JSON.parse(oldGameData);

    } else {
        console.warn('Aucune partie précédente trouvée dans le localStorage');
    }
} */