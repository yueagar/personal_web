class Navigation {
    constructor() {
        this.HamburgerIcon = document.querySelector(".hamburger-icon");
        this.NavLinks = document.querySelector(".nav-links");
        this.MenuLinks = document.querySelectorAll(".menu-links");
        this.OpenedMenu = false;
        this.focus = "about";
        this.addEvents();
        this.checkFocus();
    }

    addEvents() {
        ["scroll", "touchstart", "touchend", "touchcancel", "touchmove"].forEach(eventKey => {
            document.addEventListener(eventKey, event => {
                this.checkFocus()
            })
        });
        this.HamburgerIcon.addEventListener("click", () => {
            this.toggleMenu();
        });
        this.MenuLinks.forEach(element => {
            element.childNodes.forEach(child => {
                child.nodeName == "LI" && child.addEventListener("click", () => {
                    this.closeMenu();
                });
            });
        });
    }
    openMenu() {
        this.HamburgerIcon.classList.add("open");
        this.MenuLinks.forEach(element => {
            element.classList.add("open");
        });
    }
    closeMenu() {
        this.HamburgerIcon.classList.remove("open");
        this.MenuLinks.forEach(element => {
            element.classList.remove("open");
        });
    }
    toggleMenu() {
        this.HamburgerIcon.classList.toggle("open");
        this.MenuLinks.forEach(element => {
            element.classList.toggle("open");
        });
        /*if (this.OpenedMenu) this.closeMenu();
        else this.openMenu();*/
        this.OpenedMenu = !this.OpenedMenu;
    }
    checkFocus() {
        if (window.visualViewport.pageTop <= document.getElementById("profile").offsetTop + document.getElementById("profile").offsetHeight / 2) {
            this.Focus = "profile";
        } else if (window.visualViewport.pageTop <= document.getElementById("about").offsetTop + document.getElementById("about").offsetHeight / 2) {
            this.Focus = "about";
        } else if (window.visualViewport.pageTop <= document.getElementById("coursework").offsetTop + document.getElementById("coursework").offsetHeight / 2) {
            this.Focus = "coursework";
        } else if (window.visualViewport.pageTop <= document.getElementById("projects").offsetTop + document.getElementById("projects").offsetHeight / 2) {
            this.Focus = "projects";
        } else if (window.visualViewport.pageTop <= document.getElementById("contact").offsetTop + document.getElementById("contact").offsetHeight / 2) {
            this.Focus = "contact";
        }
    }
    get Focus() {
        return this.focus;
    }
    set Focus(value) {
        this.focus = value;
        document.querySelectorAll("a.tr").forEach(element => {
            element.dataset.tr == this.Focus ? element.classList.add("active") : element.classList.remove("active");
        });
    }
}

class Language {
    constructor() {
        this.language = navigator.language || navigator.userLanguage;
        this.language = this.language.startsWith("zh") ? "zh" : this.language.startsWith("ja") ? "jp" : "en";
        this.language = localStorage.getItem("language") || this.language;
        this.selector = document.querySelectorAll("#language");
        this.en = {
            "title": "YueAgar_c's website",
            "about": "About",
            "coursework": "Coursework",
            "projects": "Projects",
            "contact": "Contact",
            "profile-text-1": "Console says: Hello World.",
            "profile-text-2": "I'm YueAgar_c.",
            "profile-btn-resume": "View my resume"
        };
        this.zh = {
            "title": "YueAgar_c的網站",
            "about": "關於我",
            "coursework": "已修課業",
            "projects": "專案",
            "contact": "聯絡",
            "profile-text-1": "控制台：你好世界。",
            "profile-text-2": "我是YueAgar_c。",
            "profile-btn-resume": "查看我的履歷"
        };
        this.jp = {
            "title": "YueAgar_cのウェブサイト",
            "about": "プロフィール",
            "coursework": "課題",
            "projects": "プロジェクト",
            "contact": "連絡",
            "profile-text-1": "コンソール：こんにちは、世界。",
            "profile-text-2": "YueAgar_cと申します。",
            "profile-btn-resume": "履歴書を閲覧する"
        };
        this.load();
    }
    load() {
        this.selector.forEach(element => {
            element.value = this.language;
            element.addEventListener("change", () => {
                this.language = element.value;
                this.selector.forEach(ele => { ele.value = this.language; });
                localStorage.setItem("language", this.language);
                this.translate();
            });
        });
        this.translate();
    }
    translate() {
        document.querySelectorAll(".tr").forEach(element => {
            this[this.language][element.dataset.tr] && (element.innerText = this[this.language][element.dataset.tr]);
        });
        document.querySelector(".menu-links").style.width = this.language == "jp" ? "180px": this.language == "zh" ? "140px" : "auto"; 
    }
}

console.log("Hello World. This is only for debugging purposes.");
console.log(new Navigation());
console.log(new Language());