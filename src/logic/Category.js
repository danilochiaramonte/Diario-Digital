class Category {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    equals(otherCategory) {
        if (!(otherCategory instanceof Category)) {
            return false;
        }
        return this.name === otherCategory.name;
    }

    toString() {
        return `Category{name=\'${this.name}\', description=\'${this.description}\'}`;
    }
}

export default Category;


