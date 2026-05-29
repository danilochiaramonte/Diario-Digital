import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trash2, Plus, Info, ArrowLeft, LogOut, Edit, Save, Mic, Search, CheckCircle2, Sparkles, Download, Upload, User, KeyRound, Sun, Moon } from 'lucide-react';
import StorageManager from './logic/StorageManager';

const storageManager = new StorageManager();

const MIN_PASSWORD_LENGTH = 4;

const NOTE_COLORS = [
  { name: 'Azul',     value: '#3b82f6' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja',  value: '#f97316' },
  { name: 'Amarelo',  value: '#eab308' },
  { name: 'Verde',    value: '#22c55e' },
  { name: 'Roxo',     value: '#a855f7' },
  { name: 'Rosa',     value: '#ec4899' },
];

function FormMessage({ type = 'error', children }) {
  if (!children) return null;
  const styles =
    type === 'error'
      ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
  return (
    <p
      className={`mb-4 p-3 rounded-lg text-sm border ${styles}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [noteColor, setNoteColor] = useState('#3b82f6');
  const [noteError, setNoteError] = useState('');
  const [categoryHint, setCategoryHint] = useState('');
  const [audioError, setAudioError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [changePassCurrent, setChangePassCurrent] = useState('');
  const [changePassNew, setChangePassNew] = useState('');
  const [changePassConfirm, setChangePassConfirm] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('diario_tema');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('diario_tema', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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

  const stats = useMemo(() => {
    const total = notes.length;
    const byCategory = {};
    let lastDate = null;
    for (const n of notes) {
      if (n.category) byCategory[n.category] = (byCategory[n.category] || 0) + 1;
      const d = n.lastModificationDate ? new Date(n.lastModificationDate) : null;
      if (d && (!lastDate || d > lastDate)) lastDate = d;
    }
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return { total, topCategory, lastDate };
  }, [notes]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUser.trim() || !loginPass) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      if (await storageManager.login(loginUser.trim(), loginPass)) {
        setIsLoggedIn(true);
        setCurrentPage('home');
        setSearchQuery('');
        refreshNotes();
      } else {
        setLoginError('Nome de usuário ou senha inválidos.');
      }
    } catch (error) {
      console.error('Erro interno ao processar o login:', error);
      setLoginError('Ocorreu um erro no sistema ao tentar entrar. Tente novamente.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!regUser.trim() || !regPass || !regPassConfirm) {
      setRegisterError('Por favor, preencha todos os campos.');
      return;
    }
    if (regPass !== regPassConfirm) {
      setRegisterError('As senhas não coincidem.');
      return;
    }
    if (regPass.length < MIN_PASSWORD_LENGTH) {
      setRegisterError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (await storageManager.registerUser(regUser.trim(), regPass)) {
      setRegisteredUsername(regUser.trim());
      setRegisterSuccess(true);
      setRegPass('');
      setRegPassConfirm('');
    } else {
      setRegisterError('Nome de usuário já existe.');
    }
  };

  const goToLoginAfterRegister = () => {
    setLoginUser(registeredUsername);
    setLoginPass('');
    setLoginError('');
    setRegisterSuccess(false);
    setRegUser('');
    setRegPassConfirm('');
    setRegisteredUsername('');
    setCurrentPage('login');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    storageManager.logout();
    setIsLoggedIn(false);
    setCurrentPage('login');
    setLoginUser('');
    setLoginPass('');
    setLoginError('');
    setSearchQuery('');
    setNotes([]);
  };

  const navigate = (page, note = null) => {
    setEditingNote(note);
    if (page === 'register') {
      setRegisterSuccess(false);
      setRegisterError('');
    }
    if (page === 'login') {
      setLoginError('');
    }
    if (page === 'edit-note') {
      setNoteContent(note ? note.content : '');
      setNoteCategory(note?.category || '');
      setNoteColor(note?.color || '#3b82f6');
      setNoteError('');
      setCategoryHint('');
      setAudioError('');
    }
    if (page === 'profile') {
      setChangePassCurrent('');
      setChangePassNew('');
      setChangePassConfirm('');
      setChangePassError('');
      setChangePassSuccess('');
      refreshNotes();
    }
    if (page === 'home') {
      setSearchQuery('');
      refreshNotes();
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setNotes(storageManager.searchNotes(value));
  };

  const startRecording = () => {
    setAudioError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAudioError('Seu navegador não suporta gravação de áudio. Tente usar o Google Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNoteContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      setAudioError('Não foi possível capturar o áudio. Verifique a permissão do microfone.');
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleSuggestCategory = () => {
    setNoteError('');
    setCategoryHint('');
    if (!noteContent.trim()) {
      setNoteError('Escreva algo no conteúdo antes de solicitar uma sugestão de categoria.');
      return;
    }
    const suggested = storageManager.suggestCategory(noteContent);
    setNoteCategory(suggested);
    setCategoryHint(`Categoria sugerida: ${suggested}`);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    setNoteError('');
    const title = e.target.title.value.trim();
    const content = noteContent.trim();
    const category = noteCategory.trim();
    const tags = e.target.tags.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title || !content) {
      setNoteError('Título e conteúdo não podem ser vazios.');
      return;
    }

    try {
      if (editingNote) {
        storageManager.updateNote(editingNote.id, title, content, noteColor, tags, category);
      } else {
        const novaNota = storageManager.createNote(title, content);
        const noteId = novaNota?.id || (typeof novaNota?.getId === 'function' ? novaNota.getId() : null);
        if (noteId) {
          storageManager.updateNote(noteId, title, content, noteColor, tags, category);
        } else {
          throw new Error('O gerenciador não retornou um ID válido para a nova nota.');
        }
      }
      refreshNotes();
      navigate('home');
    } catch (error) {
      console.error('Erro interno ao salvar a nota:', error);
      setNoteError('Erro ao salvar a nota. Tente novamente.');
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      storageManager.deleteNote(id);
      handleSearch(searchQuery);
    }
  };

  const handleExportNotes = () => {
    try {
      const json = storageManager.exportNotesToJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const username = storageManager.getLoggedInUser()?.username || 'usuario';
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `diario-${username}-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar notas:', error);
      alert('Erro ao exportar notas. Tente novamente.');
    }
  };

  const handleImportNotes = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const count = storageManager.importNotesFromJson(e.target.result);
        refreshNotes();
        alert(`${count} nota(s) importada(s) com sucesso.`);
      } catch (error) {
        console.error('Erro ao importar notas:', error);
        alert(`Erro ao importar: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');
    if (!changePassCurrent || !changePassNew || !changePassConfirm) {
      setChangePassError('Preencha todos os campos.');
      return;
    }
    if (changePassNew.length < MIN_PASSWORD_LENGTH) {
      setChangePassError(`A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (changePassNew !== changePassConfirm) {
      setChangePassError('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (changePassNew === changePassCurrent) {
      setChangePassError('A nova senha deve ser diferente da atual.');
      return;
    }
    try {
      await storageManager.changePassword(changePassCurrent, changePassNew);
      setChangePassSuccess('Senha alterada com sucesso.');
      setChangePassCurrent('');
      setChangePassNew('');
      setChangePassConfirm('');
    } catch (error) {
      setChangePassError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Tem certeza? Esta ação não pode ser desfeita.');
    if (!confirmed) return;
    const password = window.prompt('Digite sua senha atual:');
    if (password === null) return;
    const keyword = window.prompt('Digite "EXCLUIR" em maiúsculas:');
    if (keyword !== 'EXCLUIR') {
      alert('Confirmação inválida. Conta não excluída.');
      return;
    }
    try {
      await storageManager.deleteAccount(password);
      setNotes([]);
      setIsLoggedIn(false);
      navigate('login');
      alert('Conta excluída com sucesso.');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // ─── classes reutilizadas ────────────────────────────────────────────────
  const inputCls = 'w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400';
  const inputXlCls = 'p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500';
  const cardCls = 'bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      {isLoggedIn && (
        <div className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center">
            {currentPage !== 'home' && (
              <button type="button" onClick={() => navigate('home')} className="mr-4 p-2 hover:bg-blue-500 rounded-full transition-all">
                <ArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-xl font-bold">Diário Digital</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDarkMode(d => !d)}
              className="p-2 hover:bg-blue-500 rounded-full transition-all"
              title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button type="button" onClick={() => navigate('about')} className="p-2 hover:bg-blue-500 rounded-full transition-all" title="Sobre">
              <Info size={24} />
            </button>
            <button
              type="button"
              onClick={() => navigate('profile')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-blue-500 rounded-lg transition-all"
              title="Meu perfil"
            >
              <div className="w-8 h-8 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold">
                {storageManager.getLoggedInUser()?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="hidden sm:inline font-medium">
                {storageManager.getLoggedInUser()?.username || ''}
              </span>
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-4xl">
        {/* ── Login ── */}
        {currentPage === 'login' && !isLoggedIn && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-8 border-blue-600">
              <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">Login</h2>
              <FormMessage type="error">{loginError}</FormMessage>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Usuário"
                  className={inputCls}
                  value={loginUser}
                  onChange={(e) => { setLoginUser(e.target.value); setLoginError(''); }}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className={inputCls}
                  value={loginPass}
                  onChange={(e) => { setLoginPass(e.target.value); setLoginError(''); }}
                  required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition shadow-lg">
                  Entrar
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Não tem conta?{' '}
                <button type="button" onClick={() => navigate('register')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── Cadastro ── */}
        {currentPage === 'register' && !isLoggedIn && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-8 border-green-600">
              {registerSuccess ? (
                <div className="text-center space-y-5" role="status" aria-live="polite">
                  <div className="flex justify-center">
                    <CheckCircle2 size={64} className="text-green-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Cadastro concluído!</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Sua conta <span className="font-semibold text-gray-800 dark:text-gray-200">{registeredUsername}</span> foi criada com sucesso.
                    Agora você já pode entrar no Diário Digital.
                  </p>
                  <button
                    type="button"
                    onClick={goToLoginAfterRegister}
                    className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-bold transition shadow-lg"
                  >
                    Ir para o login
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">Cadastro</h2>
                  <FormMessage type="error">{registerError}</FormMessage>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Usuário"
                      className={inputCls.replace('focus:ring-blue-500', 'focus:ring-green-500')}
                      value={regUser}
                      onChange={(e) => { setRegUser(e.target.value); setRegisterError(''); }}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Senha"
                      className={inputCls.replace('focus:ring-blue-500', 'focus:ring-green-500')}
                      value={regPass}
                      onChange={(e) => { setRegPass(e.target.value); setRegisterError(''); }}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirmar senha"
                      className={inputCls.replace('focus:ring-blue-500', 'focus:ring-green-500')}
                      value={regPassConfirm}
                      onChange={(e) => { setRegPassConfirm(e.target.value); setRegisterError(''); }}
                      required
                    />
                    <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-bold transition shadow-lg">
                      Cadastrar
                    </button>
                  </form>
                  <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Já tem conta?{' '}
                    <button type="button" onClick={() => navigate('login')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      Login
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Home ── */}
        {isLoggedIn && currentPage === 'home' && (
          <div className="p-4 pb-32">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar por título, conteúdo, tags ou categoria..."
                className="w-full p-4 pl-12 border rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {notes.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
                {searchQuery.trim()
                  ? `Nenhuma nota encontrada para '${searchQuery.trim()}'.`
                  : 'Nenhuma nota ainda. Clique em Nova Nota para começar!'}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border-l-8 hover:shadow-xl transition-all"
                  style={{ borderLeftColor: note.color || '#3b82f6' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="font-bold text-xl text-gray-800 dark:text-gray-100 cursor-pointer"
                      onClick={() => navigate('edit-note', note)}
                    >
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => navigate('edit-note', note)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-full">
                        <Edit size={20} />
                      </button>
                      <button type="button" onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{note.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.category && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {note.category}
                      </span>
                    )}
                    {note.tags?.map?.((tag) => (
                      <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium italic">
                    {note.lastModificationDate ? new Date(note.lastModificationDate).toLocaleString('pt-BR') : ''}
                  </p>
                </div>
              ))}
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
              <button
                type="button"
                onClick={() => navigate('edit-note', null)}
                className="bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-700 shadow-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
              >
                <Plus size={24} /> Nova Nota
              </button>
            </div>
          </div>
        )}

        {/* ── Edição de nota ── */}
        {isLoggedIn && currentPage === 'edit-note' && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-8">{editingNote ? 'Editar Nota' : 'Nova Nota'}</h2>
            <form onSubmit={handleSaveNote} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <FormMessage type="error">{noteError}</FormMessage>
              <FormMessage type="success">{categoryHint}</FormMessage>
              <FormMessage type="error">{audioError}</FormMessage>

              <input
                name="title"
                key={editingNote?.id ?? 'new'}
                defaultValue={editingNote?.title}
                placeholder="Título da Nota"
                className="w-full p-4 text-xl font-bold border-b-2 border-gray-100 dark:border-gray-700 outline-none focus:border-blue-500 transition-all bg-transparent dark:text-gray-100 dark:placeholder-gray-500"
                required
              />

              <textarea
                name="content"
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                  setNoteError('');
                  setCategoryHint('');
                }}
                rows="10"
                placeholder="Escreva aqui suas ideias..."
                className={`w-full ${inputXlCls} resize-none`}
                required
              />

              <button
                type="button"
                onClick={startRecording}
                className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md ${
                  isRecording ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                <Mic size={22} />
                {isRecording ? 'Ouvindo... (Fale agora)' : 'Áudio para Texto'}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="category"
                  value={noteCategory}
                  onChange={(e) => { setNoteCategory(e.target.value); setCategoryHint(''); }}
                  placeholder="Categoria (ex: Trabalho)"
                  className={inputXlCls}
                />
                <input
                  name="tags"
                  key={`tags-${editingNote?.id ?? 'new'}`}
                  defaultValue={editingNote?.tags ? (Array.isArray(editingNote.tags) ? editingNote.tags.join(', ') : editingNote.tags) : ''}
                  placeholder="Tags (separadas por vírgula)"
                  className={inputXlCls}
                />
              </div>

              <button
                type="button"
                onClick={handleSuggestCategory}
                className="w-full p-4 rounded-xl font-bold flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all active:scale-95"
              >
                <Sparkles size={22} />
                Sugerir Categoria
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor da nota</label>
                <div className="flex flex-wrap gap-3">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNoteColor(c.value)}
                      className={`w-10 h-10 rounded-full shadow-sm transition-all hover:scale-110 ${
                        noteColor === c.value ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-500 dark:ring-offset-gray-800' : ''
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                      aria-label={`Cor ${c.name}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
                >
                  <Save size={22} /> Salvar Nota
                </button>
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-bold transition-all active:scale-95"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Perfil ── */}
        {isLoggedIn && currentPage === 'profile' && (
          <div className="p-6 max-w-2xl mx-auto space-y-6 pb-12">
            {/* Seção 1: Informações da conta */}
            <div className={cardCls}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {storageManager.getLoggedInUser()?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {storageManager.getLoggedInUser()?.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Membro desde:{' '}
                    {storageManager.getLoggedInUser()?.createdAt
                      ? new Date(storageManager.getLoggedInUser().createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Seção 2: Estatísticas */}
            <div className={cardCls}>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600 dark:text-blue-400" /> Estatísticas
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Notas</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
                    {stats.topCategory ? stats.topCategory[0] : '—'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stats.topCategory ? `Top categoria (${stats.topCategory[1]})` : 'Top categoria'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {stats.lastDate ? stats.lastDate.toLocaleDateString('pt-BR') : '—'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Última edição</p>
                </div>
              </div>
            </div>

            {/* Seção 3: Trocar senha */}
            <div className={cardCls}>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <KeyRound size={20} className="text-blue-600 dark:text-blue-400" /> Trocar senha
              </h3>
              <FormMessage type="error">{changePassError}</FormMessage>
              <FormMessage type="success">{changePassSuccess}</FormMessage>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <input
                  type="password"
                  placeholder="Senha atual"
                  className={inputCls}
                  value={changePassCurrent}
                  onChange={(e) => { setChangePassCurrent(e.target.value); setChangePassError(''); setChangePassSuccess(''); }}
                />
                <input
                  type="password"
                  placeholder="Nova senha"
                  className={inputCls}
                  value={changePassNew}
                  onChange={(e) => { setChangePassNew(e.target.value); setChangePassError(''); setChangePassSuccess(''); }}
                />
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  className={inputCls}
                  value={changePassConfirm}
                  onChange={(e) => { setChangePassConfirm(e.target.value); setChangePassError(''); setChangePassSuccess(''); }}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 font-bold transition-all shadow-md"
                >
                  Alterar senha
                </button>
              </form>
            </div>

            {/* Seção 4: Dados */}
            <div className={cardCls}>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Download size={20} className="text-blue-600 dark:text-blue-400" /> Dados
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Backup das suas notas. Use Exportar para baixar um arquivo .json com todas as suas notas. Use Importar para restaurar a partir de um backup.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportNotes}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium shadow-sm transition-all"
                >
                  <Download size={16} /> Exportar JSON
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium shadow-sm transition-all cursor-pointer">
                  <Upload size={16} /> Importar JSON
                  <input type="file" accept="application/json,.json" onChange={handleImportNotes} className="hidden" />
                </label>
              </div>
            </div>

            {/* Seção 5: Logout */}
            <div className={cardCls}>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-bold transition-all"
              >
                <LogOut size={20} /> Sair
              </button>
            </div>

            {/* Seção 6: Zona de perigo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-2 border-red-200 dark:border-red-800">
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3">⚠️ Zona de perigo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Esta ação é irreversível. Todos os seus dados — incluindo notas, tags e categorias — serão permanentemente removidos.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold transition-all shadow-md"
              >
                <Trash2 size={20} /> Excluir minha conta
              </button>
            </div>
          </div>
        )}

        {/* ── Sobre ── */}
        {currentPage === 'about' && (
          <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl mt-10 border-t-8 border-blue-600">
            <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-400">Sobre o Diário Digital</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Este aplicativo foi desenvolvido como parte da atividade prática da disciplina de Desenvolvimento de Aplicativos Móveis (Extensão V).
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-6">
              <h3 className="font-bold mb-4 text-blue-700 dark:text-blue-400 text-xl">Recursos do Sistema:</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Persistência Local (Offline-first)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Organização por Categorias, Tags e Cores
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Busca Inteligente de Notas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Sugestão de Categoria e Reconhecimento de Voz
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Senhas protegidas com hash SHA-256
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Modo claro / escuro
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Instalável como PWA (funciona offline após o primeiro acesso)
                </li>
              </ul>
            </div>
            <button type="button" onClick={() => navigate('home')} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
              Voltar ao Diário
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
