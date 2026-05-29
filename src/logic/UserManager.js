import User from './User';

class UserManager {
    constructor() {
        this.users = new Map();
        this.loggedInUser = null;
    }

    registerUser(username, password) {
        if (this.users.has(username)) {
            return false;
        }
        const newUser = new User(username, password);
        this.users.set(username, newUser);
        return true;
    }

    login(username, password) {
        const user = this.users.get(username);
        
        if (user) {
            // A MÁGICA AQUI: Tenta usar a função, se não existir (porque veio do localStorage), usa a propriedade direta.
            const userPassword = typeof user.getPassword === 'function' 
                ? user.getPassword() 
                : user.password;

            if (userPassword === password) {
                this.loggedInUser = user;
                return user;
            }
        }

        return null;
    }

    logout() {
        this.loggedInUser = null;
    }

    getLoggedInUser() {
        return this.loggedInUser;
    }

    isUserLoggedIn() {
        return this.loggedInUser !== null;
    }
}

export default UserManager;
