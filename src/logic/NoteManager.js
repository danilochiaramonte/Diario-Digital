import Note from './Note';

class NoteManager {
    constructor() {
        this.notes = new Map();
    }

    createNote(title, content, author = null) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Simple ID generation
        const newNote = new Note(id, title, content, author);
        this.notes.set(id, newNote);
        return newNote;
    }

    getNoteById(id) {
        return this.notes.get(id);
    }

    updateNote(id, newTitle, newContent, newColor, newTags, newCategory) {
        const note = this.notes.get(id);
        if (note) {
            // null/undefined = não alterar; string vazia = limpar o campo
            if (newTitle !== null && newTitle !== undefined) {
                note.setTitle(newTitle);
            }
            if (newContent !== null && newContent !== undefined) {
                note.setContent(newContent);
            }
            if (newColor !== null && newColor !== undefined) {
                note.setColor(newColor);
            }
            if (newTags !== null && newTags !== undefined) {
                if (!(note.tags instanceof Set)) note.tags = new Set();
                note.tags.clear();
                newTags.forEach(tag => note.addTag(tag));
            }
            if (newCategory !== null && newCategory !== undefined) {
                note.setCategory(newCategory === '' ? null : newCategory);
            }
            return true;
        }
        return false;
    }

    deleteNote(id) {
        return this.notes.delete(id);
    }

    getAllNotes() {
        return Array.from(this.notes.values());
    }

    getNotesSortedByCreationDate() {
        return Array.from(this.notes.values()).sort((a, b) => b.getCreationDate() - a.getCreationDate());
    }

    getNotesSortedByLastModificationDate() {
        return Array.from(this.notes.values()).sort((a, b) => b.getLastModificationDate() - a.getLastModificationDate());
    }

    searchNotes(keyword) {
        const lowerCaseKeyword = keyword.toLowerCase();
        return Array.from(this.notes.values()).filter(note =>
            note.getTitle().toLowerCase().includes(lowerCaseKeyword) ||
            note.getContent().toLowerCase().includes(lowerCaseKeyword) ||
            note.getTags().some(tag => tag.toLowerCase().includes(lowerCaseKeyword)) ||
            (note.getCategory() && note.getCategory().toLowerCase().includes(lowerCaseKeyword))
        );
    }

    filterNotesByCategory(category) {
        const lowerCaseCategory = category.toLowerCase();
        return Array.from(this.notes.values()).filter(note =>
            note.getCategory() && note.getCategory().toLowerCase() === lowerCaseCategory
        );
    }

    filterNotesByTag(tag) {
        const lowerCaseTag = tag.toLowerCase();
        return Array.from(this.notes.values()).filter(note =>
            note.getTags().some(t => t.toLowerCase() === lowerCaseTag)
        );
    }

    filterNotesByDateRange(startDate, endDate) {
        return Array.from(this.notes.values()).filter(note =>
            note.getCreationDate() >= startDate && note.getCreationDate() <= endDate
        );
    }

    // Normaliza texto para comparação (minúsculas, sem acentos)
    _normalizeForMatch(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // Simulação de categorização automática por IA (regras + pontuação por palavras-chave)
    suggestCategory(content) {
        const text = this._normalizeForMatch(content);
        if (!text.trim()) {
            return 'Geral';
        }

        const categoryKeywords = {
            Compras: [
                'compra', 'comprar', 'compras', 'mercado', 'supermercado', 'feira',
                'lista', 'leite', 'pao', 'ovos', 'produto', 'sacola', 'carrinho',
                'promocao', 'desconto', 'preco', 'ifood', 'delivery', 'pedido',
                'restaurante', 'almoco', 'jantar', 'cafe', 'padaria', 'acougue',
                'hortifruti', 'shopee', 'amazon', 'mercado livre',
            ],
            Financas: [
                'financas', 'financeiro', 'dinheiro', 'pix', 'boleto', 'fatura',
                'cartao', 'credito', 'debito', 'salario', 'holerite', 'imposto',
                'aluguel', 'condominio', 'parcela', 'juros', 'emprestimo',
                'investimento', 'poupar', 'orcamento', 'conta', 'transferencia',
                'divida', 'economizar', 'gasto', 'pagamento', 'nubank', 'banco',
            ],
            Trabalho: [
                'projeto', 'desenvolvimento', 'trabalho', 'codigo', 'programar',
                'cliente', 'sprint', 'tarefa', 'reuniao', 'equipe', 'empresa',
                'relatorio', 'entrega', 'office', 'email', 'chefe', 'lider',
                'meeting', 'zoom', 'teams', 'slack', 'github', 'deploy', 'bug',
                'proposta', 'contrato', 'freelance', 'estagio', 'vaga',
                'curriculo', 'home office', 'presencial', 'plantao',
            ],
            Urgente: [
                'urgente', 'prazo', 'deadline', 'amanha', 'hoje', 'importante',
                'atrasado', 'vence', 'rapido', 'prioridade', 'alerta', 'emergencia',
                'critico', 'asap', 'expira', 'ultimo dia', 'nao esquecer',
                'lembrar', 'cobranca', 'imediato', 'agora',
            ],
            Estudos: [
                'estudo', 'estudar', 'prova', 'faculdade', 'aula', 'tcc',
                'universidade', 'unifil', 'disciplina', 'trabalho academico',
                'apresentacao', 'seminario', 'dever', 'licao', 'resumo', 'slide',
                'bibliografia', 'simulado', 'enem', 'vestibular', 'professor',
                'materia', 'redacao', 'pesquisa', 'monografia', 'orientador',
                'laboratorio', 'cronograma', 'edital', 'nota de aula',
            ],
            Saude: [
                'saude', 'medico', 'medica', 'hospital', 'clinica', 'remedio',
                'receita', 'sintoma', 'dor', 'febre', 'gripe', 'vacina', 'exame',
                'consulta', 'dentista', 'terapia', 'psicologo', 'nutricionista',
                'pressao', 'dieta', 'nutricao', 'sono', 'dormir', 'academia',
                'treino', 'exercicio', 'caminhada', 'check-up', 'checkup',
            ],
            Pessoal: [
                'familia', 'casa', 'hobby', 'viagem', 'aniversario', 'amigo',
                'lazer', 'filme', 'serie', 'festa', 'churrasco', 'presente',
                'namoro', 'casamento', 'filho', 'filha', 'mae', 'pai', 'pet',
                'cachorro', 'gato', 'ferias', 'hotel', 'passagem', 'descanso',
                'igreja', 'futebol', 'jogo', 'musica', 'show', 'plano', 'meta',
            ],
        };

        let bestCategory = 'Geral';
        let bestScore = 0;

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            const score = keywords.reduce(
                (total, keyword) => total + (text.includes(keyword) ? 1 : 0),
                0
            );
            if (score > bestScore) {
                bestScore = score;
                bestCategory = category;
            }
        }

        return bestCategory;
    }

    // Simulação de conversão de áudio em texto por IA
    convertAudioToText() {
        return 'Texto transcrito do áudio: Esta é uma anotação de voz.';
    }

    // Exportação de dados para JSON
    exportNotesToJson(filterByAuthor = null) {
        const notes = Array.from(this.notes.values()).filter(note =>
            filterByAuthor === null || note.author === filterByAuthor
        );
        return JSON.stringify(notes.map(note => ({
            id: note.getId(),
            title: note.getTitle(),
            content: note.getContent(),
            creationDate: note.getCreationDate(),
            lastModificationDate: note.getLastModificationDate(),
            color: note.getColor(),
            tags: note.getTags(),
            category: note.getCategory(),
            author: note.getAuthor(),
        })), null, 2);
    }

    // Importação de notas a partir de JSON. Retorna a quantidade importada.
    importNotesFromJson(jsonString, author = null) {
        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            throw new Error('Arquivo JSON inválido.');
        }
        if (!Array.isArray(parsed)) {
            throw new Error('Formato esperado: lista de notas.');
        }
        let imported = 0;
        for (const data of parsed) {
            if (!data || typeof data !== 'object') continue;
            const id = data.id || (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
            // Vincula ao usuário atual (se informado), independentemente do autor original do arquivo
            const noteAuthor = author !== null ? author : (data.author || null);
            const note = new Note(id, data.title || '', data.content || '', noteAuthor);
            note.creationDate = data.creationDate ? new Date(data.creationDate) : new Date();
            note.lastModificationDate = data.lastModificationDate ? new Date(data.lastModificationDate) : new Date();
            note.color = data.color || null;
            note.category = data.category || null;
            note.tags = new Set(Array.isArray(data.tags) ? data.tags : []);
            this.notes.set(id, note);
            imported += 1;
        }
        return imported;
    }
}

export default NoteManager;


