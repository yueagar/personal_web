# Personal website

A static site. No build step and no external libraries — the files here are what gets served.

## Layout

```
index.html          Page skeleton. Every list on the page is filled in by JavaScript.
data/site.json      Facts that are the same in every language: dates, grades, urls, images.
data/text.*.json    Wording, one file per language (en, zh, ja).
js/                 loader.js -> main.js -> content, text, sections, navigation, theme, reveal, icons.
css/                tokens (colours, type, spacing), base, components, sections.
assets/             Images and the resume PDF.
```

`site.json` and `text.*.json` are linked by id. An entry in `site.json` carries an `id`,
and every language file has that same id under `"items"`.

Two attributes connect the HTML to the JavaScript:

- `data-text="about.heading"` — the element's text comes from that path in the language file.
  It replaces the element's contents, so never put it on an element that has children.
- `data-render="projects"` — the element is a container that `js/sections.js` fills.

## Common changes

**Wording** — edit `data/text.<language>.json` only.

**Colours, type scale, spacing, radii** — `css/tokens.css`. Both themes are defined there;
the dark values appear twice on purpose, once for the manual toggle and once for visitors
who have not chosen a theme and follow their system.

**A new course** — add `{ "id": "CSCI1234", "academicYear": "2026-27", "term": 1, "grade": "A" }`
to the right group in `site.json`, then add `"CSCI1234": "Course Title"` under `items` in all
three text files. `term` is `1`, `2`, `"summer"`, or left out for a course with no CUHK term
(CS50x), in which case `academicYear` is a plain year such as `"2023"`.
The course code links to the CSE course PDF automatically; add `"url": null` if there is no PDF,
`"linkCode": "CSCI3180"` to point at another course's PDF (the ESTR courses do this), or
`"url": "..."` for any other page. Grades listed in `topGrades` get the accent badge.
Courses are shown newest academic year first, then by term (Summer after Term 2), then by
code, whatever order they sit in the file.

**A new job, project or skill group** — add an entry to the matching list in `site.json`, then add
its id to the three text files. Jobs and projects take an object (`title`, `organization`,
`location`, `points` / `description`); the rest take a plain string. A project without an `image`
gets a drawn placeholder panel instead of a screenshot.

**A new section** — add the section to `index.html` and its name to `sections` in `site.json`;
both navigation bars are built from that list.

**A new icon** — add the path to `PATHS` in `js/icons.js`, then use its name in `site.json`.

**A new language** — add it to `LANGUAGES` in `js/content.js` and copy a `data/text.*.json` file.

## Notes

- Images are WebP. Keep new photos under roughly 300 KB.
- Anything with the class `reveal` fades in when scrolled into view, and is shown immediately
  for visitors who ask for reduced motion.

## Running it

From the parent folder: `node server.js` — serves this folder at http://localhost:8081.

Run `npx prettier --write .` before committing; `.prettierrc` holds the settings.
