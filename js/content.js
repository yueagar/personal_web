// Loads the content files and remembers which language the visitor picked.

export const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本語" },
];

const STORAGE_KEY = "language";
const OLD_CODES = { jp: "ja" }; // An earlier version of the site stored "jp".

/** Reads the saved language, falling back to the browser language and then English. */
export function startingLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const wanted = OLD_CODES[saved] || saved || navigator.language || "en";
    const match = LANGUAGES.find(language => wanted.startsWith(language.code));
    return match ? match.code : "en";
}

export function saveLanguage(code) {
    localStorage.setItem(STORAGE_KEY, code);
}

async function loadJson(path) {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
    return response.json();
}

export function loadSite() {
    return loadJson("data/site.json");
}

export function loadText(code) {
    return loadJson(`data/text.${code}.json`);
}
