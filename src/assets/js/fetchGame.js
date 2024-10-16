import './settings.js';
import PageChanger from './Page-Changer.js';
import ScoreManager from './ScoreManager.js';
import User from './User';

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
const btnsStart = document.querySelectorAll('.btn-start');
const inputName = document.getElementById('user-name');
const choosenAvatar = document.querySelector('.img-avatar');
const currentNameHtml = document.querySelector('.current-name');
const currentAvatarHtml = document.querySelector('.current-avatar');
const msgError = document.querySelector('.msg-error');
let oldGame = JSON.parse(localStorage.getItem('oldGame')) || null;
const currentUser = User.getCurrentUser();



btnsStart.forEach(btnStart => {
    btnStart.addEventListener('click', () => {
        if (inputName.value.length > 1) {
            msgError.textContent = '';
            const user = new User(inputName.value, choosenAvatar.getAttribute('src'));
            user.saveCurrentUser(); 
            pageChanger.switchScreen('game');  // Passe à l'écran "jeu"
            fetchGame(getUrlBySettings());   // Charge les données du jeu après le changement d'écran
        } else {
            msgError.textContent = 'Veuillez entrer un nom d\'utilisateur.';
        }
    });
});

function fetchGame(url) {
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            game = data;
            localStorage.setItem('oldGame', JSON.stringify(game));
            displayQuestion();
        })
        .catch((error) => {
            console.error('Il y a eu un problème avec le fetch: ', error);
        });
}

function getUrlBySettings() {
    const url = 'https://opentdb.com/api.php';
    let savedSettings = JSON.parse(localStorage.getItem('settings'));

    if (!savedSettings) {
        return url + '?amount=10';
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
    localStorage.setItem('currentQuestion', JSON.stringify(currentQuestionIndex));
    displayQuestion();
    displayScore();
}

if (oldGame) {
    modaleContinue.setAttribute('open', '');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser);
    currentNameHtml.textContent = currentUser.name;
    currentAvatarHtml.setAttribute('src', currentUser.avatar);
    btnContinue.addEventListener('click', () => {
        continueGame();
    });
    btnRestart.addEventListener('click', () => {
        restartGame();
    });
} else {
    pageChanger.switchScreen('accueil');
}

function gameFromLocalStorage() {
    let oldGameData = localStorage.getItem('oldGame');
    
    if (oldGameData) {
        game = JSON.parse(oldGameData);
        currentQuestionIndex = JSON.parse(localStorage.getItem('currentQuestion')) || 0;
    }
}

// Fonction pour continuer la partie
function continueGame() {
    modaleContinue.removeAttribute('open');
    displayQuestion();
}

function restartGame() {
    game = {};
    currentQuestionIndex = 0; 
    localStorage.removeItem('oldGame');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('currentUser');
    progressHtml.style.width = 0 + '%';
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
    scoreManager.addScore(scoreManager.currentScorePercent, totalQuestions);
    questionHtml.textContent = `Fin du jeu ! Votre score : ${scoreManager.getCurrentScore()}/${totalQuestions}`;
    responsesHtml.forEach(response => response.textContent = '');
    pageChanger.switchScreen('end');
}

// Appeler displayScore et gameFromLocalStorage pour restaurer le jeu
displayScore();
fetchGame(getUrlBySettings());
gameFromLocalStorage();

if (oldGame) {
    pageChanger.switchScreen('jeu');
    modaleContinue.setAttribute('open', '');
    btnContinue.addEventListener('click', () => {
        continueGame();
    });
    btnRestart.addEventListener('click', () => {
        restartGame();
    });
} else {
    pageChanger.switchScreen('accueil');  // Aller à l'écran d'accueil s'il n'y a pas de jeu en cours
}
