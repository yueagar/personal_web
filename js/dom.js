// Helpers for building elements without writing HTML strings.

/**
 * Creates an element.
 * options: className, text, and any other key becomes an attribute.
 * children: elements or strings; falsy entries are skipped.
 */
export function element(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    const { className, text, ...attributes } = options;

    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;

    for (const [name, value] of Object.entries(attributes)) {
        if (value !== undefined && value !== null) node.setAttribute(name, value);
    }
    for (const child of children) {
        if (child) node.append(child);
    }
    return node;
}

/** Creates a link that opens in a new tab, or a plain span when there is no url. */
export function link(url, options = {}, children = []) {
    if (!url) return element("span", options, children);
    return element("a", { href: url, target: "_blank", rel: "noopener noreferrer", ...options }, children);
}

/** Replaces everything inside a container. */
export function fill(container, children) {
    container.replaceChildren(...children.filter(Boolean));
}

/** Finds the container a section renders into. */
export function slot(name) {
    return document.querySelector(`[data-render="${name}"]`);
}
