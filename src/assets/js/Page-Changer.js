export default class PageChanger {
  constructor() {
    this.ecranAccueil = document.querySelector(".ecran-accueil");
    this.ecranJeu = document.querySelector(".ecran-jeu");
    this.ecranFin = document.querySelector(".ecran-fin");
    this.header = document.querySelector("header");
    this.welcome = document.querySelector(".welcome");
    this.result = document.querySelector(".result-wrapper");
    this.btnsSettings = document.querySelectorAll(".btn-settings");
    this.btnsStart = document.querySelectorAll(".btn-start");
    this.currentScreen = "accueil";
  }

  hideAllScreens() {
    this.ecranAccueil.classList.add("hidden");
    this.ecranAccueil.classList.remove("flex");
    this.ecranJeu.classList.add("hidden");
    this.ecranJeu.classList.remove("flex");
    this.ecranFin.classList.add("hidden");
    this.ecranFin.classList.remove("flex");
  }

  switchScreen(screenName) {
    this.hideAllScreens();
    this.currentScreen = screenName;

    switch (screenName) {
      case "game":
        this.ecranJeu.classList.remove("hidden");
        this.ecranJeu.classList.add("flex");
        this.header.classList.remove("bg-desert");
        this.header.classList.add("bg-mountain");
        this.welcome.classList.add("hidden");
        this.result.classList.remove("hidden");
        this.result.classList.add("flex");
        this.btnsStart.forEach((btn) => {
          btn.setAttribute("disabled", true);
        });
        this.btnsSettings.forEach((btn) => {
          btn.setAttribute("disabled", true);
        });
        break;

      case "end":
        this.ecranFin.classList.remove("hidden");
        this.ecranFin.classList.add("flex");
        this.header.classList.remove("bg-mountain");
        this.header.classList.add("bg-beach");
        this.btnsStart.forEach((btn) => {
          btn.setAttribute("disabled", "");
        });
        this.btnsSettings.forEach((btn) => {
          btn.removeAttribute("disabled");
        });
        break;

      case "accueil":
        this.ecranAccueil.classList.remove("hidden");
        this.ecranAccueil.classList.add("flex");
        this.header.classList.remove("bg-beach");
        this.header.classList.remove("bg-mountain");
        this.header.classList.add("bg-desert");
        this.welcome.classList.remove("hidden");
        this.result.classList.add("hidden");
        this.result.classList.remove("flex");
        this.btnsSettings.forEach((btn) => {
          btn.removeAttribute("disabled");
        });
        this.btnsStart.forEach((btn) => {
          btn.removeAttribute("disabled");
        });
    }
  }
}
