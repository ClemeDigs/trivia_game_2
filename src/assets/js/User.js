export default class User {
    constructor(name, avatar) {
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
}
