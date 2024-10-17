import './settings.js';
import PageChanger from './Page-Changer.js';
import ScoreManager from './ScoreManager.js';
import User from './User';
import BestScores from './BestScores.js'

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
export let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];
const ecranFin = document.querySelector('.ecran-fin')


btnsStart.forEach(btnStart => {
    btnStart.addEventListener('click', () => {
        if (inputName.value.length > 1) {
            msgError.textContent = '';
            const user = new User(inputName.value, choosenAvatar.getAttribute('src'));
            user.saveCurrentUser(); 
            pageChanger.switchScreen('game'); 
            fetchGame(getUrlBySettings()); 
        } else {
            msgError.textContent = 'Veuillez entrer un nom d\'utilisateur.';
        }
    });
});

function fetchGame(url) {
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            game = data;
            localStorage.setItem('oldGame', JSON.stringify(game));
            displayQuestion();
        })
        .catch((error) => {
            console.error('Erreur de fetch:', error);
        });
};


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
    if (currentQuestionIndex >= game.results.length) {
        return endGame();
    }

    let question = game.results[currentQuestionIndex].question;
    questionHtml.textContent = question;

    let correctAnswer = game.results[currentQuestionIndex].correct_answer;
    let responses = game.results[currentQuestionIndex].incorrect_answers.concat(correctAnswer);
    responses.sort(() => Math.random() - 0.5);

    if (responses.length === 2) {
        responsesHtml.forEach((responseHtml, index) => {
            if (index < 2) {
                responseHtml.classList.remove('hidden');
                responseHtml.textContent = responses[index];
                responseHtml.onclick = () => verifyAnswer(responses[index], correctAnswer);
            } else {
                responseHtml.classList.add('hidden');
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

function gameFromLocalStorage() {
    let oldGameData = localStorage.getItem('oldGame');
    if (oldGameData) {
        game = JSON.parse(oldGameData);
        currentQuestionIndex = JSON.parse(localStorage.getItem('currentQuestion')) || 0;
    }
}

function resetLocalStorage() {
    localStorage.removeItem('oldGame');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('currentUser');
}

function continueGame() {
    modaleContinue.setAttribute('closing', '');
    modaleContinue.removeAttribute('open');
    displayQuestion();
}

function restartGame() {
    game = {};
    currentQuestionIndex = 0; 
    resetLocalStorage();
    progressHtml.style.width = 0 + '%';
    pageChanger.switchScreen('accueil');
    modaleContinue.setAttribute('closing', '');
    modaleContinue.removeAttribute('open');
}

function endGame() {
    displayScore();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userScore = {
        user: currentUser,
        score: scoreManager.calculateScorePercent(currentQuestionIndex)
    };
    bestScores.push(userScore);
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
    game = {};
    resetLocalStorage();
    questionHtml.textContent = '';
    responsesHtml.forEach(response => response.textContent = '');
    currentQuestionIndex = 0;
    pageChanger.switchScreen('end');
    const bestScoresInstance = new BestScores(bestScores);
    const scoresHtml = bestScoresInstance.toBestScoreLigne();
    ecranFin.appendChild(scoresHtml);
}

displayScore();
gameFromLocalStorage();

if (oldGame && Array.isArray(oldGame.results) && oldGame.results.length > 0) {
    pageChanger.switchScreen('jeu');
    gameFromLocalStorage();
    modaleContinue.setAttribute('open', '');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentNameHtml.textContent = currentUser.name;
    currentAvatarHtml.setAttribute('src', currentUser.avatar);
} else {
    resetLocalStorage();
    pageChanger.switchScreen('accueil');
}

btnContinue.addEventListener('click', continueGame);
btnRestart.addEventListener('click', restartGame);