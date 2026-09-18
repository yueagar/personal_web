// Entry point: loads the content, draws the page and keeps the language switcher in sync.
// The query string comes from loader.js and is passed on so every module is fetched fresh.

const version = new URL(import.meta.url).search;

const { LANGUAGES, startingLanguage, saveLanguage, loadSite, loadText } = await import(`./content.js${version}`);
const { Text, ageFrom } = await import(`./text.js${version}`);
const { renderPage } = await import(`./sections.js${version}`);
const { Navigation } = await import(`./navigation.js${version}`);

const site = await loadSite();
const selectors = [...document.querySelectorAll(".language-select")];

function buildLanguageOptions() {
    selectors.forEach(selector => {
        selector.replaceChildren(...LANGUAGES.map(language => new Option(language.label, language.code)));
    });
}

async function show(code) {
    const text = new Text(await loadText(code), {
        age: ageFrom(site.birthDate),
        gpa: site.about.education.majorGpa,
    });
    text.values.current = text.get("experience.current");

    renderPage(site, text);
    selectors.forEach(selector => {
        selector.value = code;
        // The menu has to be wide enough for the longest link in the chosen language.
        selector.closest(".menu-links")?.style.setProperty("width", text.get("nav.menuWidth"));
    });
}

buildLanguageOptions();
selectors.forEach(selector =>
    selector.addEventListener("change", async () => {
        saveLanguage(selector.value);
        await show(selector.value);
    }),
);

await show(startingLanguage());
new Navigation();
