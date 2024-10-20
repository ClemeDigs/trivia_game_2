export default class User {
    constructor(name, avatar) {
        this.currentNameHtml = document.querySelector('.current-name');
        this.currentAvatarHtml = document.querySelector('.current-avatar');

        this.name = name;
        this.avatar = avatar;
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify({ name: this.name, avatar: this.avatar }));
    }

    static getCurrentUser() {
        const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
        return currentUserData ? new User(currentUserData.name, currentUserData.avatar) : null;
    }

    setUser() {
/*         const user = new User(inputName.value, choosenAvatar.getAttribute('src')); */
        this.currentUser = User.getCurrentUser();
        this.currentNameHtml.textContent = currentUser.name;
        this.currentAvatarHtml.setAttribute('src', currentUser.avatar);
    }
}
