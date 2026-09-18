// Header behaviour: the mobile menu, the border that appears on scroll, and
// highlighting the link of the section currently being read.

export class Navigation {
    constructor() {
        this.header = document.querySelector(".site-header");
        this.menu = document.getElementById("mobile-menu");
        this.menuButton = document.querySelector(".menu-button");
        this.sections = [...document.querySelectorAll("main > section")];
        this.links = [];
        this.activeSection = "";
        this.updateQueued = false;

        this.refresh();
        this.listen();
        this.update();
    }

    /** Re-reads the links, for use after the navigation bars are rebuilt. */
    refresh() {
        this.links = [...document.querySelectorAll("[data-section]")];
        this.links.forEach(link => link.addEventListener("click", () => this.closeMenu()));
    }

    listen() {
        this.menuButton?.addEventListener("click", () => this.toggleMenu());

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") this.closeMenu();
        });

        const queue = () => {
            if (this.updateQueued) return;
            this.updateQueued = true;
            requestAnimationFrame(() => {
                this.updateQueued = false;
                this.update();
            });
        };
        window.addEventListener("scroll", queue, { passive: true });
        window.addEventListener("resize", queue);
    }

    openMenu() {
        this.menu?.classList.add("is-open");
        this.menuButton?.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
    }

    closeMenu() {
        this.menu?.classList.remove("is-open");
        this.menuButton?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    toggleMenu() {
        if (this.menu?.classList.contains("is-open")) this.closeMenu();
        else this.openMenu();
    }

    update() {
        this.header?.classList.toggle("is-stuck", window.scrollY > 8);

        // The section being read is the last one that starts above a third of the screen.
        const line = window.scrollY + window.innerHeight / 3;
        let active = "";
        for (const section of this.sections) {
            if (section.offsetTop <= line) active = section.id;
        }

        // The last section can be shorter than the screen, so its top never reaches
        // the line. Once the page cannot scroll further, it is the one being read.
        const bottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (bottom && this.sections.length) active = this.sections[this.sections.length - 1].id;
        if (active === this.activeSection) return;

        this.activeSection = active;
        for (const link of this.links) {
            const isActive = link.dataset.section === active;
            link.classList.toggle("is-active", isActive);
            if (isActive) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        }
    }
}
