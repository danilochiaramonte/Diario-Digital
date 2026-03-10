/**
 * StorageManager.js
 * Gerencia a persistência de dados em localStorage para o Diário Digital.
 */

import UserManager from './UserManager';
import NoteManager from './NoteManager';

class StorageManager {
  constructor() {
    this.USERS_KEY = 'diario_usuarios';
    this.NOTES_KEY = 'diario_anotacoes';
    this.CURRENT_USER_KEY = 'diario_usuario_logado';
    this.userManager = new UserManager();
    this.noteManager = new NoteManager();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      if (usersData) {
        const users = JSON.parse(usersData);
        this.userManager.users = new Map(users);
      }

      const notesData = localStorage.getItem(this.NOTES_KEY);
      if (notesData) {
        const notes = JSON.parse(notesData);
        this.noteManager.notes = new Map(notes);
      }

      const currentUserData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (currentUserData) {
        const userData = JSON.parse(currentUserData);
        const user = this.userManager.users.get(userData.username);
        if (user) {
          this.userManager.loggedInUser = user;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  saveUsersToStorage() {
    const usersArray = Array.from(this.userManager.users.entries());
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usersArray));
  }

  saveNotesToStorage() {
    const notesArray = Array.from(this.noteManager.notes.entries()).map(([id, note]) => [
      id,
      {
        id: note.id || id,
        title: typeof note.getTitle === 'function' ? note.getTitle() : note.title,
        content: typeof note.getContent === 'function' ? note.getContent() : note.content,
        creationDate: typeof note.getCreationDate === 'function' ? note.getCreationDate() : note.creationDate,
        lastModificationDate: typeof note.getLastModificationDate === 'function' ? note.getLastModificationDate() : note.lastModificationDate,
        color: typeof note.getColor === 'function' ? note.getColor() : note.color,
        tags: Array.from(note.tags || []),
        category: typeof note.getCategory === 'function' ? note.getCategory() : note.category,
      },
    ]);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notesArray));
  }

  saveCurrentUserToStorage() {
    if (this.userManager.loggedInUser) {
      const userData = { username: this.userManager.loggedInUser.getUsername() };
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  registerUser(username, password) {
    const result = this.userManager.registerUser(username, password);
    if (result) this.saveUsersToStorage();
    return result;
  }

  login(username, password) {
    const user = this.userManager.login(username, password);
    if (user) this.saveCurrentUserToStorage();
    return user;
  }

  logout() {
    this.userManager.logout();
    this.saveCurrentUserToStorage();
  }

  getLoggedInUser() { return this.userManager.getLoggedInUser(); }
  isUserLoggedIn() { return this.userManager.isUserLoggedIn(); }

  createNote(title, content) {
    const note = this.noteManager.createNote(title, content);
    this.saveNotesToStorage();
    return note;
  }

  updateNote(id, newTitle, newContent, newColor, newTags, newCategory) {
    const result = this.noteManager.updateNote(id, newTitle, newContent, newColor, newTags, newCategory);
    if (result) this.saveNotesToStorage();
    return result;
  }

  deleteNote(id) {
    const result = this.noteManager.deleteNote(id);
    if (result) this.saveNotesToStorage();
    return result;
  }

  getAllNotes() {
    this.loadFromStorage(); // Garante que os dados estão frescos
    return Array.from(this.noteManager.notes.values()).map(note => ({
      id: note.id || (typeof note.getId === 'function' ? note.getId() : null),
      title: typeof note.getTitle === 'function' ? note.getTitle() : note.title,
      content: typeof note.getContent === 'function' ? note.getContent() : note.content,
      category: typeof note.getCategory === 'function' ? note.getCategory() : note.category,
      tags: Array.from(note.tags || []),
      lastModificationDate: typeof note.getLastModificationDate === 'function' ? note.getLastModificationDate() : note.lastModificationDate
    })).sort((a, b) => new Date(b.lastModificationDate) - new Date(a.lastModificationDate));
  }

  searchNotes(keyword) {
    const all = this.getAllNotes();
    if (!keyword) return all;
    const lower = keyword.toLowerCase();
    return all.filter(n => 
      n.title.toLowerCase().includes(lower) || 
      n.content.toLowerCase().includes(lower) ||
      (n.category && n.category.toLowerCase().includes(lower)) ||
      n.tags.some(t => t.toLowerCase().includes(lower))
    );
  }

  suggestCategory(content) { return this.noteManager.suggestCategory(content); }
  convertAudioToText() { return "Texto convertido de áudio com sucesso!"; }
}

export default StorageManager;
