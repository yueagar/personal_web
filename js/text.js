// Looks up wording from the loaded text file and fills in placeholders like {age}.

export class Text {
    /**
     * strings: the parsed data/text.<lang>.json
     * values: numbers and names that are the same in every language, e.g. { age: 22 }
     */
    constructor(strings, values = {}) {
        this.strings = strings;
        this.values = values;
    }

    /** Reads a dotted path such as "about.heading". Returns the path itself when missing. */
    get(path) {
        const found = path.split(".").reduce((step, key) => (step ? step[key] : undefined), this.strings);
        if (typeof found !== "string") return found === undefined ? path : found;
        return this.applyValues(found);
    }

    /** Reads one entry from the "items" map. Entries are either a string or an object. */
    item(id) {
        const found = this.strings.items[id];
        if (found === undefined) return id;
        if (typeof found === "string") return this.applyValues(found);
        return found;
    }

    applyValues(template) {
        return template.replace(/{(\w+)}/g, (whole, key) => (key in this.values ? this.values[key] : whole));
    }

    /** Fills every element that names a text path, e.g. <p data-text="about.heading">. */
    applyToPage() {
        document.querySelectorAll("[data-text]").forEach(node => {
            node.textContent = this.get(node.dataset.text);
        });
        document.title = this.get("meta.title");
        document.documentElement.lang = this.get("meta.htmlLang");
    }
}

/** Whole years between a date and today. */
export function ageFrom(birthDate) {
    const born = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - born.getFullYear();
    const hadBirthday =
        today.getMonth() > born.getMonth() ||
        (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());
    if (!hadBirthday) age -= 1;
    return age;
}
