import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, Info, ArrowLeft, LogOut, Edit, Save, Mic, Search } from 'lucide-react';
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
  
  // Novos estados para controlar o texto e o microfone
  const [noteContent, setNoteContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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
    // Quando abrir a tela de edição, carrega o texto da nota no estado (ou deixa vazio se for nova)
    if (page === 'edit-note') {
      setNoteContent(note ? note.content : '');
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- Nova Função: Reconhecimento de Voz ---
  const startRecording = () => {
    // Verifica se o navegador tem suporte à API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta a gravação de áudio nativa. Tente usar o Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; // Força o reconhecimento em Português do Brasil
    recognition.continuous = false; // Para de gravar automaticamente quando você faz uma pausa
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Adiciona o texto falado ao conteúdo que já estava lá (com um espaço antes)
      setNoteContent((prev) => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    try {
      const title = e.target.title.value;
      const content = noteContent; // Agora pega do estado controlado
      const category = e.target.category.value;
      const tags = e.target.tags.value.split(',').map(t => t.trim()).filter(t => t);

      if (editingNote) {
        storageManager.updateNote(editingNote.id, title, content, null, tags, category);
      } else {
        const novaNota = storageManager.createNote(title, content);
        const noteId = novaNota?.id || (typeof novaNota?.getId === 'function' ? novaNota.getId() : null);
        
        if (noteId) {
          storageManager.updateNote(noteId, title, content, null, tags, category);
        } else {
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
                <input type="password" placeholder="Senha" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-bold transition shadow-lg">Cadastrar</button>
              </form>
              <p className="mt-6 text-center text-sm">Já tem conta? <button onClick={() => navigate('login')} className="text-blue-600 font-bold hover:underline">Login</button></p>
            </div>
          </div>
        )}

        {isLoggedIn && currentPage === 'home' && (
          <div className="p-4 pb-32">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Buscar notas..." className="w-full p-4 pl-12 border rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-300" onChange={(e) => setNotes(storageManager.searchNotes(e.target.value))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map(note => (
                <div key={note.id} className="bg-white p-5 rounded-xl shadow-md border-l-8 border-blue-500 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-gray-800 cursor-pointer" onClick={() => navigate('edit-note', note)}>{note.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => navigate('edit-note', note)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"><Edit size={20} /></button>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.category && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{note.category}</span>}
                    {note.tags && note.tags.map && note.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>)}
                  </div>
                  <p className="text-xs text-gray-400 font-medium italic">{note.lastModificationDate ? new Date(note.lastModificationDate).toLocaleString('pt-BR') : ''}</p>
                </div>
              ))}
            </div>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
              <button onClick={() => navigate('edit-note', null)} className="bg-blue-600 text-white px-10 py-4 rounded-full hover:bg-blue-700 shadow-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95"><Plus size={24} /> Nova Nota</button>
            </div>
          </div>
        )}

        {isLoggedIn && currentPage === 'edit-note' && (
          <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-800 mb-8">{editingNote ? 'Editar Nota' : 'Nova Nota'}</h2>
            <form onSubmit={handleSaveNote} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <input name="title" defaultValue={editingNote?.title} placeholder="Título da Nota" className="w-full p-4 text-xl font-bold border-b-2 border-gray-100 outline-none focus:border-blue-500 transition-all" required />
              
              {/* Textarea agora é controlada pelo estado noteContent */}
              <textarea 
                name="content" 
                value={noteContent} 
                onChange={(e) => setNoteContent(e.target.value)} 
                rows="10" 
                placeholder="Escreva aqui suas ideias..." 
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                required
              ></textarea>
              
              {/* Botão de gravação real com feedback visual */}
              <button 
                type="button" 
                onClick={startRecording} 
                className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                <Mic size={22} /> 
                {isRecording ? 'Ouvindo... (Fale agora)' : 'Áudio para Texto'}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="category" defaultValue={editingNote?.category} placeholder="Categoria (ex: Trabalho)" className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="tags" defaultValue={editingNote?.tags ? (Array.isArray(editingNote.tags) ? editingNote.tags.join(', ') : editingNote.tags) : ''} placeholder="Tags (separadas por vírgula)" className="p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 font-bold flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"><Save size={22} /> Salvar Nota</button>
                <button type="button" onClick={() => navigate('home')} className="flex-1 bg-gray-200 text-gray-700 p-4 rounded-xl hover:bg-gray-300 font-bold transition-all active:scale-95">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="p-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl mt-10 border-t-8 border-blue-600">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Sobre o Diário Digital</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">Este aplicativo foi desenvolvido como parte da atividade prática da disciplina de Desenvolvimento de Aplicativos Móveis (Extensão III).</p>
            <div className="bg-blue-50 p-6 rounded-xl mb-6">
              <h3 className="font-bold mb-4 text-blue-700 text-xl">Recursos do Sistema:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Persistência Local (Offline-first)</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Organização por Categorias e Tags</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Busca Inteligente de Notas</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Reconhecimento de Voz Nativo</li>
              </ul>
            </div>
            <button onClick={() => navigate('home')} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">Voltar ao Diário</button>
          </div>
        )}
      </main>
    </div>
  );
}
