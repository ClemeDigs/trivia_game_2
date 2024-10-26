export default class Dialog {
  constructor() {
    this.dialogs = document.querySelectorAll(".dialog");
    this.btnsClose = document.querySelectorAll(".btn-close");
    this.init();
  }

  init() {
    // Écouteur global pour ouvrir ou fermer les modales au clic
    window.addEventListener("click", (e) => this.toggleDialog(e));

    // Fermer les modales lorsqu'un bouton "fermer" est cliqué
    this.btnsClose.forEach((btn) =>
      btn.addEventListener("click", (e) => this.closeDialogs(e))
    );
  }

  toggleDialog(e) {
    const target = e.target;
    const dialogSelector = target.getAttribute("data-dialog");
    const dialog = dialogSelector
      ? document.querySelector(dialogSelector)
      : null;

    // Si un élément avec data-dialog est cliqué, ouvrir/fermer la modale correspondante
    if (dialog) {
      dialog.hasAttribute("open")
        ? this.closeDialog(dialog)
        : this.openDialog(dialog);
    }
  }

  openDialog(dialog) {
    dialog.setAttribute("open", "");
    dialog.addEventListener(
      "click",
      (e) => {
        if (e.target === dialog) this.closeDialog(dialog);
      },
      { once: true }
    ); // Fermeture en cliquant en dehors du contenu de la modale
  }

  closeDialogs(e) {
    e.stopPropagation(); // Empêche la fermeture globale
    this.dialogs.forEach((dialog) => this.closeDialog(dialog));
  }

  closeDialog(dialog) {
    dialog.setAttribute("closing", "");
    dialog.addEventListener(
      "animationend",
      () => {
        dialog.removeAttribute("open");
        dialog.removeAttribute("closing");
      },
      { once: true }
    );
  }
}
