import User from './User';

class UserManager {
    constructor() {
        this.users = new Map();
        this.loggedInUser = null;
        // Adicionar um usuário de teste para facilitar
        this.registerUser("teste", "senha123");
    }

    registerUser(username, password) {
        if (this.users.has(username)) {
            console.log("Erro: Nome de usuário já existente.");
            return false;
        }
        const newUser = new User(username, password);
        this.users.set(username, newUser);
        console.log(`Usuário ${username} registrado com sucesso.`);
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
                console.log(`Login bem-sucedido para o usuário: ${username}`);
                return user;
            }
        }
        
        console.log("Erro: Nome de usuário ou senha inválidos.");
        return null;
    }

    logout() {
        if (this.loggedInUser) {
            // A mesma proteção aplicada ao username na hora de deslogar
            const username = typeof this.loggedInUser.getUsername === 'function' 
                ? this.loggedInUser.getUsername() 
                : this.loggedInUser.username;
                
            console.log(`Logout do usuário: ${username}`);
            this.loggedInUser = null;
        }
    }

    getLoggedInUser() {
        return this.loggedInUser;
    }

    isUserLoggedIn() {
        return this.loggedInUser !== null;
    }
}

export default UserManager;
