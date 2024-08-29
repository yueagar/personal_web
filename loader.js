"use strict"

const ScriptFile = document.createElement("script");
ScriptFile.src = "script.js?d=" + Date.now();
document.head.appendChild(ScriptFile);

/*const StyleFile = document.createElement("link");
StyleFile.rel = "stylesheet";
StyleFile.href = "style.css?d=" + Date.now();
document.head.appendChild(StyleFile);

const MediaqueriesFile = document.createElement("link");
MediaqueriesFile.rel = "stylesheet";
MediaqueriesFile.href = "mediaqueries.css?d=" + Date.now();
document.head.appendChild(MediaqueriesFile);

const AnimationsFile = document.createElement("link");
AnimationsFile.rel = "stylesheet";
AnimationsFile.href = "animations.css?d=" + Date.now();
document.head.appendChild(AnimationsFile);*/