import Note from './Note';

class NoteManager {
    constructor() {
        this.notes = new Map();
    }

    createNote(title, content) {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Simple ID generation
        const newNote = new Note(id, title, content);
        this.notes.set(id, newNote);
        console.log(`Nota "${title}" criada com sucesso.`);
        return newNote;
    }

    getNoteById(id) {
        return this.notes.get(id);
    }

    updateNote(id, newTitle, newContent, newColor, newTags, newCategory) {
        const note = this.notes.get(id);
        if (note) {
            if (newTitle !== null && newTitle !== undefined && newTitle !== '') {
                note.setTitle(newTitle);
            }
            if (newContent !== null && newContent !== undefined && newContent !== '') {
                note.setContent(newContent);
            }
            if (newColor !== null && newColor !== undefined && newColor !== '') {
                note.setColor(newColor);
            }
            if (newTags !== null && newTags !== undefined) {
                note.tags.clear();
                newTags.forEach(tag => note.addTag(tag));
            }
            if (newCategory !== null && newCategory !== undefined && newCategory !== '') {
                note.setCategory(newCategory);
            }
            console.log(`Nota "${note.getTitle()}" atualizada com sucesso.`);
            return true;
        }
        console.log(`Erro: Nota com ID ${id} não encontrada.`);
        return false;
    }

    deleteNote(id) {
        if (this.notes.delete(id)) {
            console.log(`Nota com ID ${id} excluída com sucesso.`);
            return true;
        }
        console.log(`Erro: Nota com ID ${id} não encontrada.`);
        return false;
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

    // Simulação de categorização automática por IA
    suggestCategory(content) {
        // Lógica simplificada para demonstração
        if (content.toLowerCase().includes("projeto") || content.toLowerCase().includes("desenvolvimento")) {
            return "Trabalho";
        } else if (content.toLowerCase().includes("compras") || content.toLowerCase().includes("mercado")) {
            return "Pessoal";
        } else if (content.toLowerCase().includes("reunião") || content.toLowerCase().includes("prazo")) {
            return "Urgente";
        }
        return "Geral";
    }

    // Simulação de conversão de áudio em texto por IA
    convertAudioToText(audioFilePath) {
        console.log(`Simulando conversão de áudio em texto para: ${audioFilePath}`);
        // Em uma implementação real, aqui seria feita a chamada para uma API de Speech-to-Text
        return "Texto transcrito do áudio: Esta é uma anotação de voz.";
    }

    // Exportação de dados para JSON
    exportNotesToJson() {
        return JSON.stringify(Array.from(this.notes.values()).map(note => ({
            id: note.getId(),
            title: note.getTitle(),
            content: note.getContent(),
            creationDate: note.getCreationDate(),
            lastModificationDate: note.getLastModificationDate(),
            color: note.getColor(),
            tags: note.getTags(),
            category: note.getCategory()
        })), null, 2);
    }
}

export default NoteManager;


