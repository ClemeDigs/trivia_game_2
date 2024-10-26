export default class Settings {
  constructor() {
    this.formSettings = document.querySelector(".settings-inputs");
    this.categoriesSelect = document.querySelector("#category");
    this.difficultyRadios = document.querySelectorAll(
      'input[name="difficulty"]'
    );
    this.typeRadios = document.querySelectorAll('input[name="type"]');
    this.nbQuestionsInput = document.querySelector("#nb-question");
    this.btnSave = document.querySelector(".btn-save");
    this.btnReset = document.querySelector(".btn-reset");
    this.nbQuestionIndicator = document.querySelector(".nb-question-indicator");

    this.settings = {
      category: "",
      difficulty: "",
      type: "",
      nbQuestions: 10,
    };

    this.loadSettingsFromLocalStorage();
    this.init();
  }

  init() {
    this.fetchCategories();

    this.btnSave.addEventListener("click", (e) => this.handleSave(e));
    this.btnReset.addEventListener("click", (e) => this.handleReset(e));
    this.nbQuestionsInput.addEventListener("change", () =>
      this.updateNbQuestionIndicator()
    );
  }

  fetchCategories() {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        data.trivia_categories.forEach((cat) => {
          const optionElement = document.createElement("option");
          optionElement.textContent = cat.name;
          optionElement.setAttribute("value", cat.id);
          this.categoriesSelect.appendChild(optionElement);
          this.applySettingsToForm();
        });
      })
      .catch((error) => {
        console.error("Erreur lors du fetch des catégories:", error);
      });
  }

  /**
   * @param {Event} e
   */
  handleSave(e) {
    e.preventDefault();

    this.settings.category = this.categoriesSelect.value;
    this.settings.difficulty = this.getSelectedRadioValue(
      this.difficultyRadios
    );
    this.settings.type = this.getSelectedRadioValue(this.typeRadios);
    this.settings.nbQuestions = this.nbQuestionsInput.value;

    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  /**
   * @param {Event} e
   */
  handleReset(e) {
    e.preventDefault();

    this.settings = {
      category: "",
      difficulty: "",
      type: "",
      nbQuestions: 10,
    };

    this.categoriesSelect.value = "any";
    this.difficultyRadios[0].checked = true;
    this.typeRadios[0].checked = true;
    this.nbQuestionsInput.value = 10;

    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  updateNbQuestionIndicator() {
    this.nbQuestionIndicator.textContent = this.nbQuestionsInput.value;
    this.nbQuestionIndicator.style.left =
      this.nbQuestionsInput.value * 1.7 + "%";
  }

  /**
   * @param {NodeList} radioList
   * @returns {string}
   */
  getSelectedRadioValue(radioList) {
    let selectedValue = "";
    radioList.forEach((radio) => {
      if (radio.checked) {
        selectedValue = radio.value;
      }
    });
    return selectedValue;
  }

  loadSettingsFromLocalStorage() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
      this.applySettingsToForm();
    }
  }

  applySettingsToForm() {
    this.categoriesSelect.value = this.settings.category || "any";
    /*         console.log(Array.from(this.categoriesSelect.options))

        for(let option of this.categoriesSelect.options) {
            console.log(option.value)
            if(option.value === this.settings.category) {
                console.log('ok')
                option.setAttribute('selected', '');
            }
        } */

    this.difficultyRadios.forEach((radio) => {
      if (radio.value === this.settings.difficulty) {
        radio.checked = true;
      }
    });
    this.typeRadios.forEach((radio) => {
      if (radio.value === this.settings.type) {
        radio.checked = true;
      }
    });
    this.nbQuestionsInput.value = this.settings.nbQuestions;
    this.updateNbQuestionIndicator();
  }

  getUrlBySettings() {
    const url = "https://opentdb.com/api.php";

    if (!this.settings) {
      return `${url}?amount=10`;
    }

    let settingsUrl = `${url}?amount=${this.settings.nbQuestions}`;

    if (this.settings.category && this.settings.category !== "any") {
      settingsUrl += `&category=${this.settings.category}`;
    }
    if (this.settings.difficulty && this.settings.difficulty !== "any") {
      settingsUrl += `&difficulty=${this.settings.difficulty}`;
    }
    if (this.settings.type && this.settings.type !== "any") {
      settingsUrl += `&type=${this.settings.type}`;
    }

    return settingsUrl;
  }
}
