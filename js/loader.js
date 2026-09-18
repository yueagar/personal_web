"use strict";

// Loads the entry module with a fresh query string so GitHub Pages never serves a stale script.
// main.js passes the same query string on to the modules it imports.
const entry = document.createElement("script");
entry.type = "module";
entry.src = "js/main.js?v=" + Date.now();
document.head.appendChild(entry);
