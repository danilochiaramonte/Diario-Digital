import React, { useState, useEffect } from 'react';
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
          <button onClick={() => navigate('about')} className="p-2 hover:bg-blue-500 rounded transition">
            <Info size={24} />
          </button>
          <button onClick={onLogout} className="p-2 hover:bg-red-500 rounded transition">
            <LogOut size={24} />
          </button>
        </>
      )}
    </div>
  </div>
);

// Tela Sobre
const AboutScreen = ({ navigate }) => (
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
        <li>React 18+ com Vite (Build Tool)</li>
        <li>JavaScript (ES6+)</li>
        <li>Tailwind CSS (Estilização)</li>
        <li>Lucide React (Ícones)</li>
        <li>Web Storage API (localStorage)</li>
        <li>Simulação de IA para categorização e áudio-para-texto</li>
      </ul>
    </div>
    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
      <h3 className="font-bold mb-2 text-blue-700">Arquitetura:</h3>
      <p className="text-sm text-gray-700">
        Aplicativo offline-first com persistência local. Cada usuário tem seus dados armazenados 
        no navegador, garantindo privacidade total e funcionamento sem dependência de servidor externo.
      </p>
    </div>
    <p className="text-sm text-gray-500 mt-8 text-center">Versão 1.0.0 - 2026</p>
  </div>
);

// Tela de Login
const LoginScreen = ({ onLogin, navigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const success = storageManager.login(username, password);
      if (success) {
        setUsername('');
        setPassword('');
        onLogin();
      } else {
        setError('Nome de usuário ou senha inválidos.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Diário Digital</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Suas anotações, sempre com você</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta? <button onClick={() => navigate('register')} className="text-blue-600 hover:underline font-semibold">Cadastre-se aqui</button>
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const success = storageManager.registerUser(username, password);
      if (success) {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        onRegister();
      } else {
        setError('Nome de usuário já existe. Escolha outro.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm border-t-4 border-green-600">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-2">Criar Conta</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Comece a organizar suas anotações</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              id="reg-username"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escolha um usuário"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              id="reg-password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              id="confirm-password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta? <button onClick={() => navigate('login')} className="text-blue-600 hover:underline font-semibold">Faça login</button>
        </p>
      </div>
    </div>
  );
};

// Tela Principal (Diário)
const HomeScreen = ({ navigate }) => {
  const [notes, setNotes] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const allNotes = storageManager.getAllNotes();
    setNotes(allNotes);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setFilterKeyword(keyword);
    if (keyword.trim() === '') {
      loadNotes();
    } else {
      const filtered = storageManager.searchNotes(keyword);
      setNotes(filtered);
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.')) {
      storageManager.deleteNote(id);
      loadNotes();
    }
  };

  const handleNewNote = () => {
    navigate('edit-note', null);
  };

  const handleEditNote = (note) => {
    navigate('edit-note', note);
  };

  return (
    <div className="pb-32">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, conteúdo, tags ou categoria..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
            value={filterKeyword}
            onChange={handleSearch}
          />
        </div>

        {notes.length === 0 && filterKeyword === '' ? (
          <div className="text-center text-gray-400 mt-16 py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg font-semibold">Nenhuma nota ainda.</p>
            <p className="text-sm">Crie sua primeira nota usando o botão abaixo!</p>
          </div>
        ) : notes.length === 0 && filterKeyword !== '' ? (
          <div className="text-center text-gray-400 mt-16 py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold">Nenhuma nota encontrada</p>
            <p className="text-sm">Tente buscar por outro termo: "{filterKeyword}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-400"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 flex-1 cursor-pointer hover:text-blue-600" onClick={() => handleEditNote(note)}>
                    {note.title}
                  </h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditNote(note)}
                      className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 size={18} />
                    </button>
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

      {/* Botão FAB para Nova Nota */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg flex items-center justify-center gap-2">
        <button 
          onClick={handleNewNote}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 shadow-md transition-colors flex items-center justify-center font-semibold"
        >
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
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Título e conteúdo não podem ser vazios.');
      return;
    }
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onSave(note ? note.id : null, title, content, tagsArray, category);
  };

  const handleSuggestCategory = () => {
    const suggested = storageManager.suggestCategory(content);
    if (suggested) {
      setCategory(suggested);
    }
  };

  const handleAudioToText = () => {
    const transcribed = storageManager.convertAudioToText('simulated_audio.wav');
    setContent(prevContent => prevContent + (prevContent ? '\n\n' : '') + transcribed);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">{note ? 'Editar Nota' : 'Nova Nota'}</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            id="note-title"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da sua nota"
          />
        </div>
        <div>
          <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo *</label>
          <textarea
            id="note-content"
            rows="8"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva o conteúdo da sua nota aqui..."
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={handleSuggestCategory} className="flex items-center justify-center gap-2 bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition font-semibold">
            <Tag size={18} /> Sugerir Categoria
          </button>
          <button type="button" onClick={handleAudioToText} className="flex items-center justify-center gap-2 bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition font-semibold">
            <Mic size={18} /> Áudio para Texto
          </button>
        </div>
        <div>
          <label htmlFor="note-category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <input
            type="text"
            id="note-category"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Trabalho, Pessoal, Ideias..."
          />
        </div>
        <div>
          <label htmlFor="note-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
          <input
            type="text"
            id="note-tags"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Ex: importante, urgente, revisão"
          />
        </div>
        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">{error}</p>}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Save size={20} /> Salvar Nota
          </button>
          <button
            type="button"
            onClick={() => navigate('home')}
            className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition font-semibold flex items-center justify-center gap-2"
          >
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
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (storageManager.isUserLoggedIn()) {
      setIsLoggedIn(true);
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleRegister = () => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    storageManager.logout();
    setIsLoggedIn(false);
    setEditingNote(null);
    setCurrentPage('login');
  };

  const navigate = (page, note = null) => {
    if (page === 'edit-note') {
      setEditingNote(note);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSaveNote = (id, title, content, tags, category) => {
    if (id) {
      storageManager.updateNote(id, title, content, tags, category);
    } else {
      storageManager.createNote(title, content);
    }
    setEditingNote(null);
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {isLoggedIn && <Navbar currentPage={currentPage} navigate={navigate} onLogout={handleLogout} isLoggedIn={isLoggedIn} />}

      <main className={isLoggedIn ? '' : ''}>
        {currentPage === 'login' && !isLoggedIn && <LoginScreen onLogin={handleLogin} navigate={navigate} />}
        {currentPage === 'register' && !isLoggedIn && <RegisterScreen onRegister={handleRegister} navigate={navigate} />}
        {isLoggedIn && currentPage === 'home' && <HomeScreen navigate={navigate} />}
        {isLoggedIn && currentPage === 'edit-note' && <NoteEditorScreen note={editingNote} onSave={handleSaveNote} navigate={navigate} />}
        {currentPage === 'about' && <AboutScreen navigate={navigate} />}
      </main>
    </div>
  );
}
