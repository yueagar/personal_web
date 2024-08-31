class Navigation {
    constructor() {
        this.HamburgerIcon = document.querySelector(".hamburger-icon");
        this.NavLogo = document.querySelectorAll(".nav-logo");
        this.NavLinks = document.querySelector(".nav-links");
        this.MenuLinks = document.querySelectorAll(".menu-links");
        this.Sections = document.querySelectorAll("section");
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
        this.NavLogo.forEach(element => {
            element.addEventListener("click", () => {
                this.closeMenu();
            });
        });
        this.MenuLinks.forEach(element => {
            element.childNodes.forEach(child => {
                child.nodeName == "LI" && child.addEventListener("click", () => {
                    this.closeMenu();
                });
            });
        });
        this.Sections.forEach(element => {
            element.addEventListener("click", () => {
                this.closeMenu();
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
        if (window.visualViewport.pageTop <= document.getElementById("profile").offsetTop + document.getElementById("profile").offsetHeight / 3 * 2) {
            this.Focus = "profile";
        } else if (window.visualViewport.pageTop <= document.getElementById("about").offsetTop + document.getElementById("about").offsetHeight / 3 * 2) {
            this.Focus = "about";
        } else if (window.visualViewport.pageTop <= document.getElementById("coursework").offsetTop + document.getElementById("coursework").offsetHeight / 3 * 2) {
            this.Focus = "coursework";
        } else if (window.visualViewport.pageTop <= document.getElementById("projects").offsetTop + document.getElementById("projects").offsetHeight / 3 * 2) {
            this.Focus = "projects";
        } else if (window.visualViewport.pageTop <= document.getElementById("contact").offsetTop + document.getElementById("contact").offsetHeight / 3 * 2) {
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
            "profile-btn-resume": "View my resume",
            "about-text-1": "Know more",
            "about-text-2": "About Me!",
            "about-text-3": "Education",
            "about-text-4": "The Chinese University of Hong Kong",
            "about-text-5": "Bachelor of Science in Computer Science",
            "about-text-6": "Achievements and Awards",
            "about-text-7": "Dean's List 2023-24",
            "about-text-8": "Hello World. I am YueAgar_c (or Yue Ka Leung Kelvin in real life). I am a 20 years old passionate computer science student and I look forward to becoming a professional software engineer in the future.",
            "coursework-text-1": "I took these",
            "coursework-text-2": "Courses",
            "coursework-text-3": "Introduction to Computer Science",
            "coursework-text-4": "Coursework source code",
            "coursework-text-5": "Problem Solving By Programming",
            "coursework-text-6": "Digital Logic and Systems",
            "coursework-text-7": "Digital Literacy and Computational Thinking—P",
            "coursework-text-8": "Linear Algebra for Engineers",
            "coursework-text-9": "Multivariable Calculus for Engineers",
            "coursework-text-10": "Calculus for Engineers",
            "projects-text-1": "Explore my",
            "projects-text-2": "Projects",
            "projects-text-3": "Source code is not available because others also worked in this project and they did not agree to share it.",
            "projects-text-4": "Inspired by agar.io.",
            "contact-text-1": "Interested?",
            "contact-text-2": "Contact Me!",
            "working": "Still under construction"
        };
        this.zh = {
            "title": "YueAgar_c的網站",
            "about": "關於我",
            "coursework": "已修課業",
            "projects": "專案",
            "contact": "聯絡",
            "profile-text-1": "控制台：你好世界。",
            "profile-text-2": "我是YueAgar_c。",
            "profile-btn-resume": "查看我的履歷",
            "about-text-1": "了解更多",
            "about-text-2": "關於我的履歷！",
            "about-text-3": "教育",
            "about-text-4": "香港中文大學",
            "about-text-5": "計算機科學理學士",
            "about-text-6": "成就與獎項",
            "about-text-7": "院長嘉許名單 2023-24",
            "about-text-8": "你好世界。我是YueAgar_c (現實中我的名字是Yue Ka Leung Kelvin)。我是一名20歲的計算機科學學生，正在努力學習並朝着成為專業軟件工程師的目標進發。",
            "coursework-text-1": "我修讀了這些",
            "coursework-text-2": "課程",
            "coursework-text-3": "計算機科學導論",
            "coursework-text-4": "課業源碼",
            "coursework-text-5": "程式設計與解難",
            "coursework-text-6": "數位邏輯及數字系統",
            "coursework-text-7": "數碼素養及計算思維—P",
            "coursework-text-8": "線性代數及其工程應用",
            "coursework-text-9": "多元微積分及其工程應用",
            "coursework-text-10": "微積分的工程應用",
            "projects-text-1": "探索我的",
            "projects-text-2": "專案",
            "projects-text-3": "由於其他參與了這個專案的人不同意分享源碼，因此不提供源碼連結。",
            "projects-text-4": "靈感來自agar.io。",
            "contact-text-1": "感興趣嗎？",
            "contact-text-2": "聯絡我！",
            "working": "還沒寫好"
        };
        this.jp = {
            "title": "YueAgar_cのウェブサイト",
            "about": "私について",
            "coursework": "授業と課題",
            "projects": "プロジェクト",
            "contact": "連絡",
            "profile-text-1": "コンソール：こんにちは、世界。",
            "profile-text-2": "YueAgar_cと申します。",
            "profile-btn-resume": "履歴書を閲覧する",
            "about-text-1": "私についてをもっと",
            "about-text-2": "知りたいですか？",
            "about-text-3": "教育",
            "about-text-4": "香港中文大学",
            "about-text-5": "情報工学",
            "about-text-6": "賞",
            "about-text-7": "成績優秀者 2023-24",
            "about-text-8": "こんにちは、世界。YueAgar_cです (現実の名前はYue Ka Leung Kelvinです)。私は20歳の情熱的な情報工学学生で、将来はプロのソフトウェアエンジニアになることを楽しみにしています。",
            "coursework-text-1": "受けた",
            "coursework-text-2": "授業",
            "coursework-text-3": "情報工学概論",
            "coursework-text-4": "課題のソースコード",
            "coursework-text-5": "プログラミングで問題を解決する",
            "coursework-text-6": "デジタル論理とシステム",
            "coursework-text-7": "デジタルリテラシーと計算思考—P",
            "coursework-text-8": "エンジニアのための線形代数",
            "coursework-text-9": "エンジニアのための多変数微積分",
            "coursework-text-10": "エンジニアのための微積分",
            "projects-text-1": "私の",
            "projects-text-2": "プロジェクトを見る",
            "projects-text-3": "他の人もこのプロジェクトで働いており、彼らはそれを共有することに同意していないため、ソースコードは提供されていません。",
            "projects-text-4": "agar.ioからインスピレーションを受けました。",
            "contact-text-1": "興味がありますか？",
            "contact-text-2": "連絡してください！",
            "working": "まだ建設中です。"
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
        document.title = this[this.language].title;
        document.querySelector(".menu-links").style.width = this.language == "jp" ? "180px": this.language == "zh" ? "140px" : "auto"; 
    }
}

console.log("Hello World. This is only for debugging purposes.");
console.log(new Navigation());
console.log(new Language());