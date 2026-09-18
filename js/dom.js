// Helpers for building elements without writing HTML strings.

/**
 * Creates an element.
 * options: className, text, dataset, and any other key becomes an attribute.
 * children: elements or strings; falsy entries are skipped.
 */
export function element(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    const { className, text, dataset, ...attributes } = options;

    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    if (dataset) Object.assign(node.dataset, dataset);

    for (const [name, value] of Object.entries(attributes)) {
        if (value !== undefined && value !== null) node.setAttribute(name, value);
    }
    for (const child of children) {
        if (child) node.append(child);
    }
    return node;
}

/** Creates a link. External addresses open in a new tab; without a url you get a span. */
export function link(url, options = {}, children = []) {
    if (!url) return element("span", options, children);
    const external = !url.startsWith("#");
    const extras = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return element("a", { href: url, ...extras, ...options }, children);
}

/** Replaces everything inside a container. */
export function fill(container, children) {
    if (container) container.replaceChildren(...children.filter(Boolean));
}

/** Finds the container a section renders into. */
export function slot(name) {
    return document.querySelector(`[data-render="${name}"]`);
}
