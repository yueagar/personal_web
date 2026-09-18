// Light and dark theme. The choice is remembered; without one the system setting wins.
// A small script in index.html applies the saved theme before the first paint.

const STORAGE_KEY = "theme";

function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function currentTheme() {
    return document.documentElement.dataset.theme || systemTheme();
}

function apply(theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        /* Private browsing blocks storage; the theme still applies for this visit. */
    }
}

export function startTheme() {
    const button = document.querySelector(".theme-toggle");
    button?.addEventListener("click", () => apply(currentTheme() === "dark" ? "light" : "dark"));

    // Follow the system while the visitor has not chosen a theme.
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            /* Ignore, and follow the system. */
        }
        if (!saved) delete document.documentElement.dataset.theme;
    });
}
