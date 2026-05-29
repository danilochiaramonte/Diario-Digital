import User from './User';
import { hashPassword, verifyPassword } from './crypto.js';

class UserManager {
    constructor() {
        this.users = new Map();
        this.loggedInUser = null;
    }

    async registerUser(username, password) {
        if (this.users.has(username)) {
            return false;
        }
        const hashed = await hashPassword(password);
        const newUser = new User(username, hashed, new Date());
        this.users.set(username, newUser);
        return true;
    }

    async login(username, password) {
        const user = this.users.get(username);
        if (user) {
            const ok = await verifyPassword(password, user.password);
            if (ok) {
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
