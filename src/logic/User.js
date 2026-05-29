class User {
    constructor(username, password, createdAt = null) {
        this.username = username;
        this.password = password;
        this.createdAt = createdAt || new Date();
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

    getCreatedAt() {
        return this.createdAt;
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
