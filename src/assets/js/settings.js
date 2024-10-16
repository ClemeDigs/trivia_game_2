// Sélection des éléments HTML
const formSettings = document.querySelector('.settings-inputs');
const categoriesSelect = document.querySelector('#category');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const typeRadios = document.querySelectorAll('input[name="type"]');
const nbQuestionsInput = document.querySelector('#nb-question');
const btnSave = document.querySelector('.btn-save');
const btnReset = document.querySelector('.btn-reset');

// Objet pour stocker les paramètres de jeu
let settings = {
    category: '',
    difficulty: '',
    type: '',
    nbQuestions: 10
};

// Récupérer les catégories depuis l'API et les ajouter au menu déroulant
fetch('https://opentdb.com/api_category.php')
    .then((response) => response.json())
    .then((data) => {
        data.trivia_categories.forEach((cat) => {
            const optionElement = document.createElement('option');
            optionElement.textContent = cat.name;
            optionElement.setAttribute('value', cat.id);
            categoriesSelect.appendChild(optionElement);
        });
    })
    .catch((error) => {
        console.error('Erreur lors du fetch des catégories:', error);
    });

// Fonction pour récupérer la valeur sélectionnée des boutons radio
function getSelectedRadioValue(radioList) {
    let selectedValue = '';
    radioList.forEach((radio) => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });
    return selectedValue;
}

// Gestion du bouton "Save"
btnSave.addEventListener('click', (e) => {
    e.preventDefault();

    // Récupérer les valeurs sélectionnées et les stocker dans l'objet settings
    settings.category = categoriesSelect.value;
    settings.difficulty = getSelectedRadioValue(difficultyRadios);
    settings.type = getSelectedRadioValue(typeRadios);
    settings.nbQuestions = nbQuestionsInput.value;

    // Sauvegarder les paramètres dans le localStorage
    localStorage.setItem('settings', JSON.stringify(settings));

    // Afficher les valeurs dans la console (ou effectuer une autre action)
    console.log('Catégorie:', settings.category);
    console.log('Difficulté:', settings.difficulty);
    console.log('Type:', settings.type);
    console.log('Nombre de questions:', settings.nbQuestions);
});

// Gestion du bouton "Reset"
btnReset.addEventListener('click', (e) => {
    e.preventDefault();

    // Réinitialiser les paramètres dans l'objet settings
    settings.category = '';
    settings.difficulty = '';
    settings.type = '';
    settings.nbQuestions = 10;

    // Réinitialiser le formulaire dans l'interface utilisateur
    categoriesSelect.value = 'any';
    difficultyRadios[0].checked = true; // Sélectionner "Any" par défaut
    typeRadios[0].checked = true; // Sélectionner "Any" par défaut
    nbQuestionsInput.value = 10;

    // Sauvegarder les paramètres réinitialisés dans le localStorage
    localStorage.setItem('settings', JSON.stringify(settings));

    console.log('Paramètres réinitialisés');
});

// Charger les paramètres à partir du localStorage au chargement de la page
window.addEventListener('load', () => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        // Si des paramètres sont trouvés, les appliquer
        settings = JSON.parse(savedSettings);

        // Appliquer les valeurs aux éléments du formulaire
        categoriesSelect.value = settings.category || 'any';
        difficultyRadios.forEach((radio) => {
            if (radio.value === settings.difficulty) {
                radio.checked = true;
            }
        });
        typeRadios.forEach((radio) => {
            if (radio.value === settings.type) {
                radio.checked = true;
            }
        });
        nbQuestionsInput.value = settings.nbQuestions;
    }
});
