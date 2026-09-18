// Runs the hamburger menu and highlights the link of the section being viewed.

export class Navigation {
    constructor() {
        this.icon = document.querySelector(".hamburger-icon");
        this.menu = document.querySelector(".menu-links");
        this.links = document.querySelectorAll(".nav-links .nav-link, .menu-links .nav-link");
        this.sections = [...document.querySelectorAll("section")];
        this.activeSection = "";
        this.updateQueued = false;

        this.listen();
        this.updateActiveLink();
    }

    listen() {
        this.icon.addEventListener("click", () => this.toggleMenu());
        this.icon.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.toggleMenu();
            }
        });

        // Any tap outside the open menu closes it.
        document.addEventListener("click", event => {
            if (!event.target.closest(".hamburger-menu")) this.closeMenu();
        });
        document
            .querySelectorAll(".nav-link")
            .forEach(element => element.addEventListener("click", () => this.closeMenu()));

        const queueUpdate = () => {
            if (this.updateQueued) return;
            this.updateQueued = true;
            requestAnimationFrame(() => {
                this.updateQueued = false;
                this.updateActiveLink();
            });
        };
        window.addEventListener("scroll", queueUpdate, { passive: true });
        window.addEventListener("resize", queueUpdate);
    }

    openMenu() {
        this.icon.classList.add("open");
        this.menu.classList.add("open");
    }

    closeMenu() {
        this.icon.classList.remove("open");
        this.menu.classList.remove("open");
    }

    toggleMenu() {
        if (this.menu.classList.contains("open")) this.closeMenu();
        else this.openMenu();
    }

    /** The active section is the last one that has started before a third of the way down the screen. */
    updateActiveLink() {
        const line = window.scrollY + window.innerHeight / 3;
        let active = this.sections[0];
        for (const section of this.sections) {
            if (section.offsetTop <= line) active = section;
        }
        if (!active || active.id === this.activeSection) return;

        this.activeSection = active.id;
        this.links.forEach(element => {
            element.classList.toggle("active", element.dataset.section === this.activeSection);
        });
    }
}
