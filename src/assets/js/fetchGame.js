import './settings.js';
import PageChanger from './Page-Changer.js';
import ScoreManager from './ScoreManager.js';
import User from './User';
import BestScores from './BestScores.js';
import Game from './Game.js';

const pageChanger = new PageChanger();
const scoreManager = new ScoreManager();

const modaleContinue = document.querySelector('.modale-continue');
const btnContinue = document.querySelector('.btn-continue');
const btnRestart = document.querySelector('.btn-restart');
const btnsStart = document.querySelectorAll('.btn-start');
const inputName = document.getElementById('user-name');
const choosenAvatar = document.querySelector('.img-avatar');
const currentNameHtml = document.querySelector('.current-name');
const currentAvatarHtml = document.querySelector('.current-avatar');
const msgError = document.querySelector('.msg-error');
let bestScores = JSON.parse(localStorage.getItem('bestScores')) || [];

const bestScoresInstance = new BestScores(bestScores);
const gameManager = new Game();



btnsStart.forEach(btnStart => {
    btnStart.addEventListener('click', () => {
        console.log(pageChanger.currentScreen);

        if (pageChanger.currentScreen === 'end') {
            gameManager.restartGame();
        } else {
            if (inputName.value.length > 1) {
                msgError.textContent = '';
                const user = new User(inputName.value, choosenAvatar.getAttribute('src'));
                user.saveCurrentUser();
                pageChanger.switchScreen('game');
                gameManager.fetchGame(getUrlBySettings());
            } else {
                msgError.textContent = 'Veuillez entrer un nom d\'utilisateur.';
            }
        }
    });
});

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

gameManager.gameFromLocalStorage();
bestScoresInstance.displayBestScores();
scoreManager.displayScore(scoreManager.currentQuestionIndex);

btnContinue.addEventListener('click', () => {
    gameManager.continueGame();
})

btnRestart.addEventListener('click', () => {
    gameManager.restartGame();
})


if (gameManager.gameFromLocalStorage()) {
    pageChanger.switchScreen('jeu');
    scoreManager.displayScore(gameManager.currentQuestionIndex);
    gameManager.displayQuestion();
    
    modaleContinue.setAttribute('open', '');

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentNameHtml.textContent = currentUser.name;
        currentAvatarHtml.setAttribute('src', currentUser.avatar);
    }
} else {
    gameManager.resetLocalStorage();
    pageChanger.switchScreen('accueil');
}


