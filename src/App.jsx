import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, Info, ArrowLeft, LogOut, Edit, Save, X, Mic, Tag, Search } from 'lucide-react';
import StorageManager from './logic/StorageManager';

const storageManager = new StorageManager();

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');

  const refreshNotes = useCallback(() => {
    const allNotes = storageManager.getAllNotes();
    setNotes(allNotes);
  }, []);

  useEffect(() => {
    if (storageManager.isUserLoggedIn()) {
      setIsLoggedIn(true);
      setCurrentPage('home');
      refreshNotes();
    }
  }, [refreshNotes]);

  // --- Função de Login Corrigida ---
  const handleLogin = (e) => {
    e.preventDefault();
    try {
      if (storageManager.login(loginUser, loginPass)) {
        setIsLoggedIn(true);
        setCurrentPage('home');
        refreshNotes();
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error("Erro interno ao processar o login:", error);
      alert('Ocorreu um erro no sistema ao tentar logar. Verifique o console do navegador.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (storageManager.registerUser(regUser, regPass)) {
      alert('Cadastro realizado com sucesso!');
      setCurrentPage('login');
    } else {
      alert('Erro ao cadastrar. Usuário já existe?');
    }
  };

  // --- Função de Logout Corrigida ---
  const handleLogout = () => {
    storageManager.logout();
    localStorage.removeItem('diario_usuario_logado');
    setIsLoggedIn(false);
    setCurrentPage('login');
    setLoginUser('');
    setLoginPass('');
    setNotes([]);
  };

  const navigate = (page, note = null) => {
    setEditingNote(note);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- Função de Salvar Nota Corrigida e Blindada ---
  const handleSaveNote = (e) => {
    e.preventDefault();
    try {
      const title = e.target.title.value;
      const content = e.target.content.value;
      const category = e.target.category.value;
      const tags = e.target.tags.value.split(',').map(t => t.trim()).filter(t => t);

      if (editingNote) {
        storageManager.updateNote(editingNote.id, title, content, null, tags, category);
      } else {
        // Pegamos a nota diretamente do retorno da criação
        const novaNota = storageManager.createNote(title, content);
        
        // Extrai o ID de forma segura, seja como propriedade genérica ou como método da classe
        const noteId = novaNota?.id || (typeof novaNota?.getId === 'function' ? novaNota.getId() : null);
        
        if (noteId) {
          storageManager.updateNote(noteId, title, content, null, tags, category);
        } else {
          // Se o NoteManager não retornar a nota direito, avisamos ao invés de travar
          throw new Error("O gerenciador não retornou um ID válido para a nova nota.");
        }
      }
      
      refreshNotes();
      navigate('home');
    } catch (error) {
      console.error("Erro interno ao salvar a nota:", error);
      alert("Erro ao salvar a nota! Abra o Console (F12) para ver os detalhes do problema.");
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Excluir esta nota?')) {
      storageManager.deleteNote(id);
      refreshNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {isLoggedIn && (
        <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center">
            {currentPage !== 'home' && (
              <button onClick={() => navigate('home')} className="mr-4 p-2 hover:bg-blue-500 rounded-full transition-all">
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-xl font-bold">Diário Digital</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('about')} className="p-2 hover:bg-blue-500 rounded-full transition-all" title="Sobre"><Info size={24} /></button>
            <button onClick={handleLogout} className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all shadow-md flex items-center justify-center" title="Sair"><LogOut size={24} /></button>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-4xl">
        {currentPage === 'login' && !isLoggedIn && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-8 border-blue-600">
              <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="Usuário" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required />
                <input type="password" placeholder="Senha" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition shadow-lg">Entrar</button>
              </form>
              <p className="mt-6 text-center text-sm">Não tem conta? <button onClick={() => navigate('register')} className="text-blue-600 font-bold hover:underline">Cadastre-se</button></p>
            </div>
          </div>
        )}

        {currentPage === 'register' && !isLoggedIn && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-8 border-green-600">
              <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Cadastro</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" placeholder="Usuário" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={regUser} onChange={(e) => setRegUser(e.target.value)} required />
                <input type="password" placeholder="Senha" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={regPass} onChange={(e) => setRegPass(
