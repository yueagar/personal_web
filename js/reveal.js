// Fades sections in as they come into view. Anything already on screen shows at once.
// Visitors who ask for reduced motion see everything immediately (handled in CSS).

export function startReveal() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(".reveal:not(.is-visible)");

    if (reduced || !("IntersectionObserver" in window)) {
        targets.forEach(target => target.classList.add("is-visible"));
        return;
    }

    const watcher = new IntersectionObserver(
        (entries, observer) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    targets.forEach(target => watcher.observe(target));
}
