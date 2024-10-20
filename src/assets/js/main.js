import '../css/styles.css';

import Slider from './Slider';
import PageChanger from './Page-Changer.js'
import User from './User';
import './dialog.js';
import './settings.js';
import './fetchGame.js';

const slider = new Slider();

const pageChanger = new PageChanger();

const currentUser = User.getCurrentUser();

if(!currentUser) {
    pageChanger.switchScreen('accueil');
} else {
    pageChanger.switchScreen('game');
}






