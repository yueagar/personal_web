// Builds every part of the page that comes from data/site.json.
// To change wording edit data/text.<lang>.json; to add an entry edit data/site.json.

import { element, link, fill, slot } from "./dom.js";

/** Splits "{year} {programme} @ {school}." and swaps the placeholders for the given nodes. */
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

function renderProfile(site, text) {
    const study = site.profile.study;
    slot("profile-picture").src = site.profile.picture;

    fill(
        slot("profile-study"),
        template(text.get("profile.study"), {
            year: study.graduationYear,
            programme: link(study.programmeUrl, { text: study.programme }),
            school: link(study.schoolUrl, { text: study.school }),
        }),
    );

    fill(slot("profile-resume"), [
        link(site.profile.resume, {}, [
            element("button", {
                className: "button",
                text: text.get("profile.resumeButton"),
            }),
        ]),
    ]);

    fill(
        slot("profile-socials"),
        site.profile.socials.map(social =>
            link(social.url, { title: text.item(social.id) }, [
                element("img", {
                    className: "social-icon",
                    src: social.icon,
                    alt: text.item(social.id),
                }),
            ]),
        ),
    );
}

function renderAbout(site, text) {
    const education = site.about.education;
    slot("about-picture").src = site.about.picture;

    fill(slot("about-education"), [
        element("img", { className: "card-icon", src: education.icon, alt: "" }),
        element("p", {
            className: "text-4",
            text: text.get("about.educationTitle"),
        }),
        link(education.schoolUrl, {
            className: "text-5",
            text: text.get("about.school"),
        }),
        link(education.programmeUrl, {
            className: "text-5",
            text: text.get("about.programme"),
        }),
        element("p", { className: "text-5", text: text.get("about.minor") }),
        element("p", { className: "text-5", text: text.get("about.majorGpa") }),
        element("p", { className: "text-5", text: education.years }),
    ]);

    fill(slot("about-achievements"), [
        element("img", {
            className: "card-icon",
            src: site.about.achievements.icon,
            alt: "",
        }),
        element("p", {
            className: "text-4",
            text: text.get("about.achievementsTitle"),
        }),
        ...site.about.achievements.items.map(id => element("p", { className: "text-5", text: text.item(id) })),
    ]);
}

function renderExperience(site, text) {
    fill(
        slot("experience"),
        site.experience.map(job => {
            const wording = text.item(job.id);
            return element("article", { className: "card job" }, [
                element("div", { className: "row" }, [
                    element("p", { className: "text-4", text: wording.title }),
                    element("span", {
                        className: "text-6 meta",
                        text: text.applyValues(job.period),
                    }),
                ]),
                element("div", { className: "row" }, [
                    link(job.url, { className: "text-6", text: wording.organization }),
                    element("span", {
                        className: "text-5 place",
                        text: wording.location,
                    }),
                ]),
                tagList(job.stack),
                element(
                    "ul",
                    { className: "points" },
                    wording.points.map(point => element("li", { className: "text-5", text: point })),
                ),
            ]);
        }),
    );
}

function renderCoursework(site, text) {
    const courseUrl = course => {
        if ("url" in course) return course.url;
        return site.courseUrlPattern.replace("{code}", course.id);
    };

    fill(
        slot("coursework"),
        site.coursework.map(group =>
            element("article", { className: "card course-group" }, [
                element("p", { className: "text-4", text: text.item(group.id) }),
                element(
                    "ul",
                    { className: "courses" },
                    group.courses.map(course =>
                        element("li", { className: "course" }, [
                            element("div", { className: "row" }, [
                                link(courseUrl(course), {
                                    className: "text-6",
                                    text: course.id,
                                }),
                                element("span", {
                                    className: "text-6 meta",
                                    text: `${course.school || site.defaultSchool} — ${course.year}`,
                                }),
                            ]),
                            element("div", { className: "row" }, [
                                element("div", {}, [
                                    element("p", {
                                        className: "text-5",
                                        text: text.item(course.id),
                                    }),
                                    course.sourceUrl &&
                                        link(course.sourceUrl, {
                                            className: "text-5",
                                            text: text.get("coursework.sourceCode"),
                                        }),
                                ]),
                                element("span", {
                                    className: "text-4 meta grade",
                                    text: course.grade,
                                }),
                            ]),
                        ]),
                    ),
                ),
            ]),
        ),
    );
}

function renderProjects(site, text) {
    fill(
        slot("projects"),
        site.projects.map(project => {
            const wording = text.item(project.id);
            const picture = project.image
                ? element("div", { className: "project-image" }, [
                      link(project.url, {}, [element("img", { src: project.image, alt: wording.title })]),
                  ])
                : null;

            return element("article", { className: "card project" }, [
                picture,
                element("div", { className: "row" }, [
                    link(project.url, { className: "text-6", text: wording.title }),
                    element("span", { className: "text-6 meta", text: project.period }),
                ]),
                tagList(project.stack),
                element("p", { className: "text-5", text: wording.description }),
                project.sourceUrl &&
                    link(project.sourceUrl, {
                        className: "text-5",
                        text: text.get("projects.sourceCode"),
                    }),
            ]);
        }),
    );
}

function renderSkills(site, text) {
    fill(
        slot("skills"),
        site.skills.map(group =>
            element("article", { className: "card skill-group" }, [
                element("p", { className: "text-4", text: text.item(group.id) }),
                tagList(group.translateItems ? group.items.map(id => text.item(id)) : group.items),
            ]),
        ),
    );
}

function renderContact(site, text) {
    fill(slot("contact"), [
        element(
            "div",
            { className: "card contact-methods" },
            site.contacts.map(contact =>
                element("div", { className: "contact-method" }, [
                    element("img", {
                        className: "contact-icon",
                        src: contact.icon,
                        alt: text.item(contact.id),
                    }),
                    link(contact.url, {
                        className: "text-1",
                        title: text.item(contact.id),
                        text: contact.value,
                    }),
                ]),
            ),
        ),
    ]);
}

function renderFooter(site, text) {
    slot("footer").textContent = `© ${site.footerYear} ${text.get("nav.logo")}`;
}

/** Redraws the whole page. Called once at start-up and again on every language change. */
export function renderPage(site, text) {
    text.applyToPage();
    renderProfile(site, text);
    renderAbout(site, text);
    renderExperience(site, text);
    renderCoursework(site, text);
    renderProjects(site, text);
    renderSkills(site, text);
    renderContact(site, text);
    renderFooter(site, text);
}
