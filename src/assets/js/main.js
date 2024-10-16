import '../css/styles.css';

import Slider from './Slider';
import PageChanger from './Page-Changer.js'
import User from './User';
import './dialog.js';
import './settings.js';
import './fetchGame.js';

const slider = new Slider();

const pageChanger = new PageChanger();
pageChanger.switchScreen('accueil');

const btnsStart = document.querySelectorAll('.btn-start');
const inputName = document.getElementById('user-name');
const choosenAvatar = document.querySelector('.img-avatar');
const msgError = document.querySelector('.msg-error');


msgError.textContent = '';

// Vérifier si un utilisateur est déjà sauvegardé
const currentUser = User.getCurrentUser();

pageChanger.switchScreen('accueil');  // Afficher l'écran d'accueil par défaut au début

if (currentUser) {
    // Si un utilisateur est trouvé, on passe directement à l'écran du jeu
    pageChanger.switchScreen('game');
} else {
    // Si aucun utilisateur n'est trouvé, on attend que l'utilisateur entre ses informations
    btnsStart.forEach(btnStart => {
        btnStart.addEventListener('click', () => {
            if (inputName.value.length > 1) {
                // Créer un nouvel utilisateur
                const user = new User(inputName.value, choosenAvatar.getAttribute('src'));
                user.saveCurrentUser(); // Sauvegarder dans le localStorage

                // Passer à l'écran du jeu
                pageChanger.switchScreen('game');

            } else {
                msgError.textContent = 'Veuillez entrer un nom d\'utilisateur.';
            }
        });
    });
}

