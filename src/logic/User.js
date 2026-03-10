class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    equals(otherUser) {
        if (!(otherUser instanceof User)) {
            return false;
        }
        return this.username === otherUser.username;
    }

    toString() {
        return `User{username='${this.username}'}`;
    }
}

export default User;


