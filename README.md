# Personal website

A static site. No build step — the files here are what gets served.

## Layout

```
index.html          Page skeleton. Section containers are filled in by JavaScript.
data/site.json      Facts that are the same in every language: dates, grades, urls, images.
data/text.*.json    Wording, one file per language (en, zh, ja).
js/                 loader.js -> main.js -> content, text, sections, navigation.
css/                base (variables and text sizes), layout, components, animations, mediaqueries.
assets/             Images and the resume PDF.
```

`site.json` and `text.*.json` are linked by id. An entry in `site.json` carries an `id`,
and every language file has that same id under `"items"`.

## Common changes

**Wording** — edit `data/text.<language>.json` only.

**A new course** — add `{ "id": "CSCI1234", "year": 2027, "grade": "A" }` to the right group in
`site.json`, then add `"CSCI1234": "Course Title"` under `items` in all three text files.
The course code links to the CSE course PDF automatically; add `"url": null` if there is no PDF,
or `"url": "..."` for a different page.

**A new job, project or skill group** — add an entry to the matching list in `site.json`, then add
its id to the three text files. Jobs and projects take an object (`title`, `organization`,
`location`, `points` / `description`); the rest take a plain string.

**A new language** — add it to `LANGUAGES` in `js/content.js` and copy a `data/text.*.json` file.

**Colours, text sizes, spacing** — the variables at the top of `css/base.css`.
`css/mediaqueries.css` only overrides those variables per screen size.

## Running it

From the parent folder: `node server.js` — serves this folder at http://localhost:8081.

Run `npx prettier --write .` before committing; `.prettierrc` holds the settings.
