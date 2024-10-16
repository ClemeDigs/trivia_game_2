export default class User {
    constructor(name, avatar) {
        this.name = name;
        this.avatar = avatar;
    }

    // Sauvegarder l'utilisateur courant dans le localStorage
    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this));
    }

    // Récupérer l'utilisateur courant du localStorage
    static getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }
}
