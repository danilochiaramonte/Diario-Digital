import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, Info, ArrowLeft, LogOut, Edit, Save, X, Mic, Tag, Search } from 'lucide-react';
import StorageManager from './logic/StorageManager';

const storageManager = new StorageManager();

// Componente de Navegação
const Navbar = ({ currentPage, navigate, onLogout, isLoggedIn }) => (
  <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
    {currentPage === 'home' ? (
      <h1 className="text-xl font-bold">Diário Digital</h1>
    ) : (
      <button onClick={() => navigate('home')} className="flex items-center text-lg font-semibold hover:opacity-80">
        <ArrowLeft className="mr-2" size={20} /> Voltar
      </button>
    )}
    <div className="flex items-center gap-2">
      {isLoggedIn && currentPage === 'home' && (
        <>
          <button onClick={() => navigate('about')} className="p-2 hover:bg-blue-500 rounded transition" title="Sobre">
            <Info size={24} />
          </button>
          <button onClick={onLogout} className="p-2 hover:bg-red-500 rounded transition" title="Sair">
            <LogOut size={24} />
          </button>
        </>
      )}
    </div>
  </div>
);

// Tela Sobre
const AboutScreen = () => (
  <div className="p-6 text-gray-700 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 text-blue-800">Sobre o Diário Digital</h2>
    <p className="mb-4 text-justify leading-relaxed">
      Este aplicativo foi desenvolvido como parte da atividade prática da disciplina de 
      Desenvolvimento de Aplicativos Móveis (Extensão III), adaptado para ser um Diário Digital 
      com funcionalidades avançadas de organização e categorização de anotações.
    </p>
    <div className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-600">
      <h3 className="font-bold mb-2 text-blue-700">Tecnologias Utilizadas:</h3>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>React 18+ com Vite</li>
        <li>Tailwind CSS (Estilização)</li>
        <li>Lucide React (Ícones)</li>
        <li>Web Storage API (localStorage)</li>
        <li>Simulação de IA para categorização e áudio-para-texto</li>
      </ul>
    </div>
    <p className="text-sm text-gray-500 mt-8 text-center">Versão 1.0.0 - 2026</p>
  </div>
);

// Tela de Login
const LoginScreen = ({ onLogin, navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const success = storageManager.login(username, password);
    if (success) {
      onLogin();
    } else {
      setError('Nome de usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold transition">
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta? <button onClick={() => navigate('register')} className="text-blue-600 hover:underline font-semibold">Cadastre-se</button>
        </p>
      </div>
    </div>
  );
};

// Tela de Registro
const RegisterScreen = ({ onRegister, navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    const success = storageManager.registerUser(username, password);
    if (success) {
      onRegister();
    } else {
      setError('Nome de usuário já existe.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm border-t-4 border-green-600">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Cadastro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold transition">
            Cadastrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta? <button onClick={() => navigate('login')} className="text-blue-600 hover:underline font-semibold">Login</button>
        </p>
      </div>
    </div>
  );
};

// Tela Principal (Diário)
const HomeScreen = ({ navigate, notes, onDeleteNote }) => {
  const [filterKeyword, setFilterKeyword] = useState('');
  const [displayNotes, setDisplayNotes] = useState(notes);

  useEffect(() => {
    if (filterKeyword.trim() === '') {
      setDisplayNotes(notes);
    } else {
      const filtered = storageManager.searchNotes(filterKeyword);
      setDisplayNotes(filtered);
    }
  }, [filterKeyword, notes]);

  return (
    <div className="pb-32">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar notas..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>

        {displayNotes.length === 0 ? (
          <div className="text-center text-gray-400 mt-16 py-12">
            <p className="text-lg font-semibold">Nenhuma nota encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayNotes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-400 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 flex-1 cursor-pointer" onClick={() => navigate('edit-note', note)}>
                    {note.title}
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={() => navigate('edit-note', note)} className="text-blue-500 p-1"><Edit size={18} /></button>
                    <button onClick={() => onDeleteNote(note.id)} className="text-red-500 p-1"><Trash2 size={18} /></button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {note.category && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{note.category}</span>}
                  {note.tags && note.tags.map(tag => <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">#{tag}</span>)}
                </div>
                <p className="text-xs text-gray-400">{new Date(note.lastModificationDate).toLocaleString('pt-BR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg flex justify-center">
        <button onClick={() => navigate('edit-note', null)} className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 shadow-md font-semibold flex items-center gap-2">
          <Plus size={20} /> Nova Nota
        </button>
      </div>
    </div>
  );
};

// Tela de Edição/Criação de Nota
const NoteEditorScreen = ({ note, onSave, navigate }) => {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [tagsInput, setTagsInput] = useState(note && note.tags ? note.tags.join(', ') : '');
  const [category, setCategory] = useState(note ? note.category : '');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Título e conteúdo não podem ser vazios.');
      return;
    }
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onSave(note ? note.id : null, title, content, tagsArray, category);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">{note ? 'Editar Nota' : 'Nova Nota'}</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Título *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="8"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Conteúdo *"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setCategory(storageManager.suggestCategory(content))} className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 font-semibold flex items-center justify-center gap-2">
            <Tag size={18} /> Sugerir Categoria
          </button>
          <button type="button" onClick={() => setContent(prev => prev + (prev ? '\n\n' : '') + storageManager.convertAudioToText())} className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 font-semibold flex items-center justify-center gap-2">
            <Mic size={18} /> Áudio para Texto
          </button>
        </div>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Tags (separadas por vírgula)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        <div className="flex gap-4 mt-6">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
            <Save size={20} /> Salvar Nota
          </button>
          <button type="button" onClick={() => navigate('home')} className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 font-semibold flex items-center justify-center gap-2">
            <X size={20} /> Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente Principal
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const refreshNotes = useCallback(() => {
    setNotes(storageManager.getAllNotes());
  }, []);

  useEffect(() => {
    if (storageManager.isUserLoggedIn()) {
      setIsLoggedIn(true);
      setCurrentPage('home');
      refreshNotes();
    }
  }, [refreshNotes]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    refreshNotes();
  };

  const handleLogout = () => {
    storageManager.logout();
    setIsLoggedIn(false);
    setCurrentPage('login');
    setNotes([]);
  };

  const navigate = (page, note = null) => {
    setEditingNote(note);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSaveNote = (id, title, content, tags, category) => {
    if (id) {
      storageManager.updateNote(id, title, content, null, tags, category);
    } else {
      storageManager.createNote(title, content);
    }
    refreshNotes();
    navigate('home');
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Excluir esta nota?')) {
      storageManager.deleteNote(id);
      refreshNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {isLoggedIn && <Navbar currentPage={currentPage} navigate={navigate} onLogout={handleLogout} isLoggedIn={isLoggedIn} />}
      <main>
        {currentPage === 'login' && !isLoggedIn && <LoginScreen onLogin={handleLogin} navigate={navigate} />}
        {currentPage === 'register' && !isLoggedIn && <RegisterScreen onRegister={() => setCurrentPage('login')} navigate={navigate} />}
        {isLoggedIn && currentPage === 'home' && <HomeScreen navigate={navigate} notes={notes} onDeleteNote={handleDeleteNote} />}
        {isLoggedIn && currentPage === 'edit-note' && <NoteEditorScreen note={editingNote} onSave={handleSaveNote} navigate={navigate} />}
        {currentPage === 'about' && <AboutScreen />}
      </main>
    </div>
  );
}
