// Builds the page from data/site.json and the wording in data/text.<lang>.json.
//
// renderChrome runs once and builds the header, menus and buttons.
// renderContent runs again on every language change and builds the sections.

import { element, link, fill, slot } from "./dom.js";
import { icon } from "./icons.js";
import { LANGUAGES } from "./content.js";

/** Splits "{programme} at {school}" and swaps the placeholders for the given nodes. */
function template(pattern, parts) {
    return pattern
        .split(/({\w+})/g)
        .map(piece => {
            const name = piece.match(/^{(\w+)}$/);
            return name ? parts[name[1]] : piece;
        })
        .filter(piece => piece !== "");
}

function tagList(labels) {
    return element(
        "ul",
        { className: "tags" },
        labels.map(label => element("li", { className: "tag", text: label })),
    );
}

function navLinks(site, { numbered = false } = {}) {
    return site.sections.map((name, index) =>
        element("a", { href: `#${name}`, dataset: { section: name } }, [
            element("span", { dataset: { text: `nav.${name}` }, text: name }),
            numbered ? element("span", { className: "mono", text: String(index + 1).padStart(2, "0") }) : null,
        ]),
    );
}

function languagePicker() {
    return [
        icon("globe", { size: 16 }),
        element(
            "select",
            { className: "language-select" },
            LANGUAGES.map(language => element("option", { value: language.code, text: language.label })),
        ),
    ];
}

/** Header, menus and buttons. Their labels carry data-text, so translating them
    later is handled by Text.applyToPage and they never need rebuilding. */
export function renderChrome(site) {
    fill(slot("desktop-nav"), navLinks(site));
    fill(slot("mobile-nav"), navLinks(site, { numbered: true }));
    fill(slot("language-picker-desktop"), languagePicker());
    fill(slot("language-picker-mobile"), languagePicker());
    fill(slot("theme-toggle"), [
        icon("sun", { size: 18, className: "icon icon-sun" }),
        icon("moon", { size: 18, className: "icon icon-moon" }),
    ]);
    fill(slot("menu-button"), [
        icon("menu", { size: 18, className: "icon icon-menu" }),
        icon("close", { size: 18, className: "icon icon-close" }),
    ]);
}

/** Labels that live in attributes rather than in the text of an element. */
function applyLabels(text) {
    const labels = [
        ["theme-toggle", "nav.theme"],
        ["menu-button", "nav.menu"],
        ["language-picker-desktop", "nav.language"],
        ["language-picker-mobile", "nav.language"],
    ];
    for (const [name, path] of labels) {
        const node = slot(name);
        if (!node) continue;
        const target = node.classList.contains("language-picker") ? node.querySelector("select") : node;
        target?.setAttribute("aria-label", text.get(path));
    }
}

function renderHero(site, text) {
    const study = site.profile.study;
    slot("hero-picture").src = site.profile.picture;
    slot("hero-picture").alt = text.get("hero.name");

    fill(
        slot("hero-role"),
        template(text.get("hero.role"), {
            programme: link(study.programmeUrl, { text: study.programme }),
            school: link(study.schoolUrl, { text: study.school }),
            year: study.graduationYear,
        }),
    );

    const email = site.contacts.find(contact => contact.url?.startsWith("mailto:"));
    fill(slot("hero-actions"), [
        link(site.profile.resume, { className: "button button-primary" }, [
            element("span", { text: text.get("hero.resume") }),
            icon("arrowUpRight", { size: 16 }),
        ]),
        link(email?.url, { className: "button button-ghost" }, [
            icon("mail", { size: 16 }),
            element("span", { text: text.get("hero.contact") }),
        ]),
    ]);

    fill(
        slot("hero-socials"),
        site.profile.socials.map(social =>
            link(social.url, { className: "icon-circle", "aria-label": text.item(social.id) }, [
                icon(social.icon, { size: 18 }),
            ]),
        ),
    );

    fill(slot("scroll-cue"), [element("span", { text: text.get("hero.scroll") }), icon("arrowDown", { size: 16 })]);
}

function renderAbout(site, text) {
    const education = site.about.education;
    slot("about-picture").src = site.about.picture;
    slot("about-picture").alt = text.get("about.portraitAlt") || "";

    fill(
        slot("stats"),
        site.stats.map(stat =>
            element("div", { className: "stat" }, [
                element("div", { className: "stat-value", text: stat.value }),
                element("div", { className: "stat-label", text: text.item(stat.id) }),
            ]),
        ),
    );

    fill(slot("about-cards"), [
        element("article", { className: "card" }, [
            element("div", { className: "card-title" }, [
                icon(education.icon, { size: 20 }),
                element("h3", { text: text.get("about.educationTitle") }),
            ]),
            element("ul", {}, [
                element("li", {}, [link(education.schoolUrl, { text: text.get("about.school") })]),
                element("li", {}, [link(education.programmeUrl, { text: text.get("about.programme") })]),
                element("li", { text: text.get("about.minor") }),
                element("li", { text: education.years }),
            ]),
        ]),
        element("article", { className: "card" }, [
            element("div", { className: "card-title" }, [
                icon(site.about.achievements.icon, { size: 20 }),
                element("h3", { text: text.get("about.achievementsTitle") }),
            ]),
            element(
                "ul",
                {},
                site.about.achievements.items.map(id => element("li", { text: text.item(id) })),
            ),
        ]),
    ]);
}

function renderExperience(site, text) {
    fill(
        slot("experience"),
        site.experience.map(job => {
            const wording = text.item(job.id);
            const current = job.period.includes("{current}");
            return element(
                "article",
                { className: `card card-hover timeline-item reveal${current ? " is-current" : ""}` },
                [
                    element("div", { className: "job-head" }, [
                        element("h3", { text: wording.title }),
                        element("span", { className: "mono faint", text: text.applyValues(job.period) }),
                    ]),
                    element("p", { className: "job-org" }, [
                        link(job.url, { text: wording.organization }),
                        element("span", { className: "dot" }),
                        element("span", { text: wording.location }),
                    ]),
                    element(
                        "ul",
                        { className: "job-points" },
                        wording.points.map(point => element("li", { text: point })),
                    ),
                    tagList(job.stack),
                ],
            );
        }),
    );
}

function renderCoursework(site, text) {
    // "url" wins; otherwise the PDF is that of linkCode, or of the course itself.
    const courseUrl = course =>
        "url" in course ? course.url : site.courseUrlPattern.replace("{code}", course.linkCode || course.id);
    const top = new Set(site.topGrades);

    // Newest first, whatever order the data file is in. Summer sits after Term 2.
    const TERM_RANK = { 1: 1, 2: 2, summer: 3 };
    const startYear = course => Number(course.academicYear.slice(0, 4));
    const inOrder = courses =>
        [...courses].sort(
            (a, b) =>
                startYear(b) - startYear(a) ||
                (TERM_RANK[b.term] || 0) - (TERM_RANK[a.term] || 0) ||
                a.id.localeCompare(b.id),
        );

    // "2025-26 Term 2", or just "2023" for a course with no term.
    const whenLabel = course => {
        if (course.term === "summer") return `${course.academicYear} ${text.get("coursework.summer")}`;
        if (course.term) return `${course.academicYear} ${text.get("coursework.term").replace("{n}", course.term)}`;
        return course.academicYear;
    };

    const tiles = site.coursework.flatMap(group =>
        inOrder(group.courses).map(course =>
            element("div", { className: "course", dataset: { group: group.id } }, [
                element("div", { className: "course-main" }, [
                    element("div", { className: "course-code mono" }, [
                        link(courseUrl(course), {}, [
                            element("span", { text: course.id }),
                            courseUrl(course) ? icon("arrowUpRight", { size: 11 }) : null,
                        ]),
                    ]),
                    element("div", { className: "course-name", text: text.item(course.id) }),
                    element("div", {
                        className: "course-meta",
                        text: `${course.school || site.defaultSchool} · ${whenLabel(course)}`,
                    }),
                ]),
                element("span", {
                    className: `grade${top.has(course.grade) ? " grade-top" : ""}`,
                    text: course.grade,
                }),
            ]),
        ),
    );
    fill(slot("coursework"), tiles);

    // "All" plus one button per group.
    const groups = [{ id: "all", label: text.get("coursework.all") }].concat(
        site.coursework.map(group => ({ id: group.id, label: text.item(group.id) })),
    );
    const buttons = groups.map(group =>
        element("button", {
            className: "filter",
            type: "button",
            text: group.label,
            "aria-pressed": group.id === "all" ? "true" : "false",
            dataset: { filter: group.id },
        }),
    );
    fill(slot("course-filters"), buttons);

    for (const button of buttons) {
        button.addEventListener("click", () => {
            const wanted = button.dataset.filter;
            buttons.forEach(other => other.setAttribute("aria-pressed", String(other === button)));
            tiles.forEach(tile => {
                tile.classList.toggle("is-hidden", wanted !== "all" && tile.dataset.group !== wanted);
            });
        });
    }
}

function renderProjects(site, text) {
    fill(
        slot("projects"),
        site.projects.map(project => {
            const wording = text.item(project.id);
            const media = project.image
                ? element("div", { className: "project-media" }, [
                      element("img", { src: project.image, alt: wording.title, loading: "lazy" }),
                  ])
                : element("div", { className: "project-media project-media-blank" });

            return element("article", { className: "card card-hover project reveal" }, [
                media,
                element("div", { className: "project-body" }, [
                    element("div", { className: "project-head" }, [
                        element("h3", { text: wording.title }),
                        element("span", { className: "mono faint", text: project.period }),
                    ]),
                    element("p", { className: "project-description", text: wording.description }),
                    tagList(project.stack),
                    element("div", { className: "project-links" }, [
                        project.url &&
                            link(project.url, { className: "link" }, [
                                element("span", { text: text.get("projects.visit") }),
                                icon("arrowUpRight", { size: 14 }),
                            ]),
                        project.sourceUrl &&
                            link(project.sourceUrl, { className: "link" }, [
                                icon("github", { size: 14 }),
                                element("span", { text: text.get("projects.sourceCode") }),
                            ]),
                    ]),
                ]),
            ]);
        }),
    );
}

function renderSkills(site, text) {
    fill(
        slot("skills"),
        site.skills.map(group =>
            element("article", { className: "card skill-group reveal" }, [
                element("h3", { text: text.item(group.id) }),
                tagList(group.translateItems ? group.items.map(id => text.item(id)) : group.items),
            ]),
        ),
    );
}

function renderContact(site, text) {
    const email = site.contacts.find(contact => contact.url?.startsWith("mailto:"));

    fill(slot("contact-actions"), [
        link(email?.url, { className: "button button-primary" }, [
            icon("mail", { size: 16 }),
            element("span", { text: text.get("contact.emailButton") }),
        ]),
    ]);

    fill(
        slot("contact"),
        site.contacts.map(contact => {
            const body = [
                icon(contact.icon, { size: 18 }),
                element("div", {}, [
                    element("div", { className: "contact-label", text: text.item(contact.id) }),
                    element("div", { className: "contact-value", text: contact.value }),
                ]),
            ];
            return contact.url
                ? link(contact.url, { className: "contact-row" }, body)
                : element("div", { className: "contact-row" }, body);
        }),
    );
}

function renderFooter(site, text) {
    slot("footer").textContent = `© ${site.footerYear} ${text.get("nav.logo")} · ${text.get("footer.builtWith")}`;

    fill(slot("footer-links"), [
        ...site.profile.socials.map(social => link(social.url, { text: text.item(social.id) })),
        link(site.profile.resume, { text: text.get("hero.resume") }),
    ]);
}

/** Redraws everything that depends on the chosen language. */
export function renderContent(site, text) {
    text.applyToPage();
    applyLabels(text);
    renderHero(site, text);
    renderAbout(site, text);
    renderExperience(site, text);
    renderCoursework(site, text);
    renderProjects(site, text);
    renderSkills(site, text);
    renderContact(site, text);
    renderFooter(site, text);
}
