class Note {
    constructor(id, title, content) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.creationDate = new Date();
        this.lastModificationDate = new Date();
        this.color = null;
        this.tags = new Set();
        this.category = null;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
        this.lastModificationDate = new Date();
    }

    getContent() {
        return this.content;
    }

    setContent(content) {
        this.content = content;
        this.lastModificationDate = new Date();
    }

    getCreationDate() {
        return this.creationDate;
    }

    getLastModificationDate() {
        return this.lastModificationDate;
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
        this.lastModificationDate = new Date();
    }

    getTags() {
        return Array.from(this.tags);
    }

    addTag(tag) {
        this.tags.add(tag);
        this.lastModificationDate = new Date();
    }

    removeTag(tag) {
        this.tags.delete(tag);
        this.lastModificationDate = new Date();
    }

    getCategory() {
        return this.category;
    }

    setCategory(category) {
        this.category = category;
        this.lastModificationDate = new Date();
    }

    equals(otherNote) {
        if (!(otherNote instanceof Note)) {
            return false;
        }
        return this.id === otherNote.id;
    }

    toString() {
        return `Note{id='${this.id}', title='${this.title}', creationDate=${this.creationDate}}`;
    }
}

export default Note;


