/**
 * StorageManager.js
 * Gerencia a persistência de dados em localStorage para o Diário Digital.
 * Integra as classes de lógica de negócio (User, Note, Category, UserManager, NoteManager)
 * com o armazenamento local do navegador.
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

  /**
   * Carrega os dados do localStorage e reconstrói os objetos de usuários e anotações.
   */
  loadFromStorage() {
    try {
      // Carregar usuários
      const usersData = localStorage.getItem(this.USERS_KEY);
      if (usersData) {
        const users = JSON.parse(usersData);
        this.userManager.users = new Map(users);
      }

      // Carregar anotações
      const notesData = localStorage.getItem(this.NOTES_KEY);
      if (notesData) {
        const notes = JSON.parse(notesData);
        this.noteManager.notes = new Map(notes);
      }

      // Carregar usuário logado
      const currentUserData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (currentUserData) {
        const userData = JSON.parse(currentUserData);
        const user = this.userManager.users.get(userData.username);
        if (user) {
          this.userManager.loggedInUser = user;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }

  /**
   * Salva os dados de usuários no localStorage.
   */
  saveUsersToStorage() {
    try {
      const usersArray = Array.from(this.userManager.users.entries());
      localStorage.setItem(this.USERS_KEY, JSON.stringify(usersArray));
    } catch (error) {
      console.error('Erro ao salvar usuários no localStorage:', error);
    }
  }

  /**
   * Salva os dados de anotações no localStorage.
   */
  saveNotesToStorage() {
    try {
      const notesArray = Array.from(this.noteManager.notes.entries()).map(([id, note]) => [
        id,
        {
          id: note.getId(),
          title: note.getTitle(),
          content: note.getContent(),
          creationDate: note.getCreationDate(),
          lastModificationDate: note.getLastModificationDate(),
          color: note.getColor(),
          tags: Array.from(note.tags),
          category: note.getCategory(),
        },
      ]);
      localStorage.setItem(this.NOTES_KEY, JSON.stringify(notesArray));
    } catch (error) {
      console.error('Erro ao salvar anotações no localStorage:', error);
    }
  }

  /**
   * Salva o usuário logado no localStorage.
   */
  saveCurrentUserToStorage() {
    try {
      if (this.userManager.loggedInUser) {
        const userData = {
          username: this.userManager.loggedInUser.getUsername(),
        };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    } catch (error) {
      console.error('Erro ao salvar usuário logado no localStorage:', error);
    }
  }

  /**
   * Registra um novo usuário.
   */
  registerUser(username, password) {
    const result = this.userManager.registerUser(username, password);
    if (result) {
      this.saveUsersToStorage();
    }
    return result;
  }

  /**
   * Faz login de um usuário.
   */
  login(username, password) {
    const user = this.userManager.login(username, password);
    if (user) {
      this.saveCurrentUserToStorage();
    }
    return user;
  }

  /**
   * Faz logout do usuário atual.
   */
  logout() {
    this.userManager.logout();
    this.saveCurrentUserToStorage();
  }

  /**
   * Retorna o usuário logado.
   */
  getLoggedInUser() {
    return this.userManager.getLoggedInUser();
  }

  /**
   * Verifica se há um usuário logado.
   */
  isUserLoggedIn() {
    return this.userManager.isUserLoggedIn();
  }

  /**
   * Cria uma nova anotação.
   */
  createNote(title, content) {
    const note = this.noteManager.createNote(title, content);
    this.saveNotesToStorage();
    return note;
  }

  /**
   * Atualiza uma anotação existente.
   */
  updateNote(id, newTitle, newContent, newColor, newTags, newCategory) {
    const result = this.noteManager.updateNote(id, newTitle, newContent, newColor, newTags, newCategory);
    if (result) {
      this.saveNotesToStorage();
    }
    return result;
  }

  /**
   * Deleta uma anotação.
   */
  deleteNote(id) {
    const result = this.noteManager.deleteNote(id);
    if (result) {
      this.saveNotesToStorage();
    }
    return result;
  }

  /**
   * Retorna todas as anotações.
   */
  getAllNotes() {
    return this.noteManager.getAllNotes();
  }

  /**
   * Busca anotações por palavra-chave.
   */
  searchNotes(keyword) {
    return this.noteManager.searchNotes(keyword);
  }

  /**
   * Filtra anotações por categoria.
   */
  filterNotesByCategory(category) {
    return this.noteManager.filterNotesByCategory(category);
  }

  /**
   * Filtra anotações por tag.
   */
  filterNotesByTag(tag) {
    return this.noteManager.filterNotesByTag(tag);
  }

  /**
   * Sugere uma categoria baseada no conteúdo.
   */
  suggestCategory(content) {
    return this.noteManager.suggestCategory(content);
  }

  /**
   * Simula a conversão de áudio em texto.
   */
  convertAudioToText(audioFilePath) {
    return this.noteManager.convertAudioToText(audioFilePath);
  }

  /**
   * Exporta as anotações para JSON.
   */
  exportNotesToJson() {
    return this.noteManager.exportNotesToJson();
  }

  /**
   * Limpa todos os dados do localStorage (para testes e reset).
   */
  clearAllData() {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.NOTES_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.userManager = new UserManager();
    this.noteManager = new NoteManager();
  }
}

export default StorageManager;
