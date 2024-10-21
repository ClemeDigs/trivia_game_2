export default class Dialog {
    constructor() {
        this.dialogs = document.querySelectorAll('.dialog');
        this.btnsClose = document.querySelectorAll('.btn-close');

        this.init();
    }

    /**
     * Initialisation des écouteurs d'événements pour les modales et les boutons.
     */
    init() {
        // Écouteur pour l'ouverture/fermeture des modales au clic
        window.addEventListener('click', (e) => this.handleWindowClick(e));

        // Ajout des écouteurs d'événements pour fermer les modales au clic à l'extérieur
        this.dialogs.forEach(dialog => this.setupDialogListeners(dialog));

        // Ajout des écouteurs d'événements pour les boutons close
        this.btnsClose.forEach(btnClose => {
            btnClose.addEventListener('click', () => this.closeAllDialogs());
        });
    }

    /**
     * Gestion du clic sur la fenêtre pour ouvrir/fermer les modales.
     * @param {MouseEvent} e 
     */
    handleWindowClick(e) {
        const target = e.target;
        const dialogSelector = target.getAttribute('data-dialog');

        if (dialogSelector) {
            const dialog = document.querySelector(dialogSelector);

            if (dialog) {
                if (dialog.checkVisibility()) {
                    this.closingDialog(dialog);
                } else {
                    dialog.setAttribute('open', '');
                }
            }
        }
    }

    /**
     * Configure les écouteurs pour chaque modale.
     * @param {HTMLElement} dialog 
     */
    setupDialogListeners(dialog) {
        // Fermer la modale au clic à l'extérieur
        dialog.addEventListener('click', () => this.closingDialog(dialog));

        // Empêcher la fermeture lorsque l'on clique à l'intérieur de la modale
        const childrens = dialog.querySelectorAll('& > *');
        childrens.forEach(children => {
            children.addEventListener('click', (e) => e.stopImmediatePropagation());
        });
    }

    /**
     * Ferme toutes les modales lorsqu'un bouton close est cliqué.
     */
    closeAllDialogs() {
        this.dialogs.forEach(dialog => this.closingDialog(dialog));
    }

    /**
     * Ajoute l'attribut 'closing' et l'écouteur d'événement pour la fermeture d'une modale.
     * @param {HTMLElement} dialog 
     */
    closingDialog(dialog) {
        dialog.setAttribute('closing', '');
        dialog.addEventListener('animationend', this.closeDialog.bind(this));
    }

    /**
     * Supprime les attributs 'open' et 'closing' et l'écouteur d'événement 'animationend'.
     * @param {Event} event 
     */
    closeDialog(event) {
        const dialog = event.target;
        dialog.removeAttribute('open');
        dialog.removeAttribute('closing');
        dialog.removeEventListener('animationend', this.closeDialog.bind(this));
    }
}