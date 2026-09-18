// Entry point: loads the content, draws the page and wires up the controls.
// The query string comes from loader.js and is passed on so every module is fetched fresh.

const version = new URL(import.meta.url).search;

const { startingLanguage, saveLanguage, loadSite, loadText } = await import(`./content.js${version}`);
const { Text, ageFrom } = await import(`./text.js${version}`);
const { renderChrome, renderContent } = await import(`./sections.js${version}`);
const { Navigation } = await import(`./navigation.js${version}`);
const { startTheme } = await import(`./theme.js${version}`);
const { startReveal } = await import(`./reveal.js${version}`);

const site = await loadSite();

renderChrome(site);

const navigation = new Navigation();
startTheme();

async function show(code) {
    const text = new Text(await loadText(code), {
        age: ageFrom(site.birthDate),
        gpa: site.about.education.majorGpa,
    });
    text.values.current = text.get("experience.current");

    renderContent(site, text);
    navigation.refresh();
    startReveal();

    document.querySelectorAll(".language-select").forEach(selector => {
        selector.value = code;
    });
}

// One listener covers both pickers, including any rebuilt later.
document.addEventListener("change", event => {
    if (!event.target.matches(".language-select")) return;
    saveLanguage(event.target.value);
    show(event.target.value);
});

await show(startingLanguage());
