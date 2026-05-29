/**
 * StorageManager.js
 * Gerencia a persistência de dados em localStorage para o Diário Digital.
 *
 * Responsabilidades:
 *  - Carregar e salvar usuários, notas e sessão atual no localStorage.
 *  - Reinstanciar User e Note como objetos da classe ao ler do storage.
 *  - Isolar notas por usuário através do campo "author" em cada nota.
 *  - Operações async de auth (hash SHA-256 via Web Crypto API).
 */

import UserManager from './UserManager';
import NoteManager from './NoteManager';
import User from './User';
import Note from './Note';
import { hashPassword, verifyPassword, isHashed } from './crypto.js';

class StorageManager {
  constructor() {
    this.USERS_KEY = 'diario_usuarios';
    this.NOTES_KEY = 'diario_anotacoes';
    this.CURRENT_USER_KEY = 'diario_usuario_logado';
    this.userManager = new UserManager();
    this.noteManager = new NoteManager();
    this.loadFromStorage();
  }

  _hydrateNote(id, data) {
    const note = new Note(
      data.id || id,
      data.title || '',
      data.content || '',
      data.author || null
    );
    note.creationDate = data.creationDate ? new Date(data.creationDate) : new Date();
    note.lastModificationDate = data.lastModificationDate ? new Date(data.lastModificationDate) : new Date();
    note.color = data.color || null;
    note.category = data.category || null;
    note.tags = new Set(Array.isArray(data.tags) ? data.tags : []);
    return note;
  }

  _hydrateUser(data) {
    return new User(
      data.username,
      data.password,
      data.createdAt ? new Date(data.createdAt) : new Date()
    );
  }

  loadFromStorage() {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      if (usersData) {
        const parsedUsers = JSON.parse(usersData);
        if (Array.isArray(parsedUsers)) {
          this.userManager.users = new Map(
            parsedUsers.map(([username, data]) => [username, this._hydrateUser(data)])
          );
        } else {
          this.userManager.users = new Map();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.userManager.users = new Map();
    }

    try {
      const notesData = localStorage.getItem(this.NOTES_KEY);
      if (notesData) {
        const parsedNotes = JSON.parse(notesData);
        if (Array.isArray(parsedNotes)) {
          this.noteManager.notes = new Map(
            parsedNotes.map(([id, data]) => [id, this._hydrateNote(id, data)])
          );
        } else {
          this.noteManager.notes = new Map();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      this.noteManager.notes = new Map();
    }

    try {
      const currentUserData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (currentUserData) {
        const userData = JSON.parse(currentUserData);
        if (userData && userData.username && this.userManager.users instanceof Map) {
          const user = this.userManager.users.get(userData.username);
          if (user) {
            this.userManager.loggedInUser = user;
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar sessão do usuário:', error);
      this.userManager.loggedInUser = null;
    }
  }

  saveUsersToStorage() {
    const usersArray = Array.from(this.userManager.users.entries()).map(([username, user]) => [
      username,
      { username: user.username, password: user.password, createdAt: user.createdAt },
    ]);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usersArray));
  }

  saveNotesToStorage() {
    const notesArray = Array.from(this.noteManager.notes.entries()).map(([id, note]) => [
      id,
      {
        id: note.id || id,
        title: note.title,
        content: note.content,
        creationDate: note.creationDate,
        lastModificationDate: note.lastModificationDate,
        color: note.color,
        tags: Array.from(note.tags || []),
        category: note.category,
        author: note.author,
      },
    ]);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notesArray));
  }

  saveCurrentUserToStorage() {
    if (this.userManager.loggedInUser) {
      const username = this.userManager.loggedInUser.username;
      if (username) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({ username }));
      }
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  _getCurrentUsername() {
    const user = this.userManager.loggedInUser;
    return user ? user.username : null;
  }

  async registerUser(username, password) {
    const result = await this.userManager.registerUser(username, password);
    if (result) this.saveUsersToStorage();
    return result;
  }

  async login(username, password) {
    const user = await this.userManager.login(username, password);
    if (user) {
      // Migração silenciosa: senha legacy em texto plano → hash
      if (!isHashed(user.password)) {
        user.password = await hashPassword(password);
        this.saveUsersToStorage();
      }
      this.saveCurrentUserToStorage();
    }
    return user;
  }

  logout() {
    this.userManager.logout();
    this.saveCurrentUserToStorage();
  }

  getLoggedInUser() { return this.userManager.getLoggedInUser(); }
  isUserLoggedIn() { return this.userManager.isUserLoggedIn(); }

  async changePassword(currentPassword, newPassword) {
    const user = this.userManager.loggedInUser;
    if (!user) throw new Error('Nenhum usuário logado.');
    const ok = await verifyPassword(currentPassword, user.password);
    if (!ok) throw new Error('Senha atual incorreta.');
    user.password = await hashPassword(newPassword);
    this.saveUsersToStorage();
    return true;
  }

  async deleteAccount(password) {
    const user = this.userManager.loggedInUser;
    if (!user) throw new Error('Nenhum usuário logado.');
    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error('Senha incorreta.');
    const username = user.username;
    for (const [id, note] of this.noteManager.notes.entries()) {
      if (note.author === username) {
        this.noteManager.notes.delete(id);
      }
    }
    this.userManager.users.delete(username);
    this.userManager.loggedInUser = null;
    this.saveNotesToStorage();
    this.saveUsersToStorage();
    this.saveCurrentUserToStorage();
    return true;
  }

  createNote(title, content) {
    const author = this._getCurrentUsername();
    const note = this.noteManager.createNote(title, content, author);
    this.saveNotesToStorage();
    return note;
  }

  updateNote(id, newTitle, newContent, newColor, newTags, newCategory) {
    const note = this.noteManager.notes.get(id);
    const currentUser = this._getCurrentUsername();
    if (note && note.author && note.author !== currentUser) {
      return false;
    }
    const result = this.noteManager.updateNote(id, newTitle, newContent, newColor, newTags, newCategory);
    if (result) this.saveNotesToStorage();
    return result;
  }

  deleteNote(id) {
    const note = this.noteManager.notes.get(id);
    const currentUser = this._getCurrentUsername();
    if (note && note.author && note.author !== currentUser) {
      return false;
    }
    const result = this.noteManager.deleteNote(id);
    if (result) this.saveNotesToStorage();
    return result;
  }

  getAllNotes() {
    const currentUser = this._getCurrentUsername();
    return Array.from(this.noteManager.notes.values())
      .filter(note => note.author === currentUser || (currentUser && !note.author))
      .map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        color: note.color,
        tags: Array.from(note.tags || []),
        author: note.author,
        creationDate: note.creationDate,
        lastModificationDate: note.lastModificationDate,
      }))
      .sort((a, b) => new Date(b.lastModificationDate) - new Date(a.lastModificationDate));
  }

  searchNotes(keyword) {
    const all = this.getAllNotes();
    if (!keyword) return all;
    const lower = keyword.toLowerCase();
    return all.filter(n =>
      (n.title && n.title.toLowerCase().includes(lower)) ||
      (n.content && n.content.toLowerCase().includes(lower)) ||
      (n.category && n.category.toLowerCase().includes(lower)) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(lower)))
    );
  }

  suggestCategory(content) { return this.noteManager.suggestCategory(content); }

  exportNotesToJson() {
    const currentUser = this._getCurrentUsername();
    return this.noteManager.exportNotesToJson(currentUser);
  }

  importNotesFromJson(jsonString) {
    const currentUser = this._getCurrentUsername();
    if (!currentUser) {
      throw new Error('É necessário estar logado para importar notas.');
    }
    const imported = this.noteManager.importNotesFromJson(jsonString, currentUser);
    if (imported > 0) this.saveNotesToStorage();
    return imported;
  }
}

export default StorageManager;
