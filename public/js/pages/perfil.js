import {
    toPage,
    createRootPath
} from "../utils.js"
import {
    homePageFileName
} from "../global.js"

const rawUserData = {
    name: document.querySelector("#nome").value,
    email: document.querySelector("#email").value,
    phoneNumber: document.querySelector("#telefone").value,
    oldPassword: document.querySelector("#senha-original").value,
    newPassword: document.querySelector("#nova-senha").value,
    confirmNewPassword: document.querySelector("#confirmar-senha").value
};

const homePagePath = createRootPath(homePageFileName);
const activeButtonClassName = "active";
const btnBackPage = document.getElementById("btn-back-page");
const menuForms = document.querySelectorAll(".card");
const menuButtons = document.querySelector(".menu").querySelectorAll("*");

const sectionMap = {
    PERFIL: document.getElementById("section-perfil"),
    SENHA:  document.getElementById("section-senha")
};
function isActiveButton(button) {
    return button.className == activeButtonClassName;
}
function getCurrentActiveButton() {
    let return_;
    menuButtons.forEach((e) => {
        if (e.className == activeButtonClassName) {
            return_ =  e;
        }
    });
    return return_;
}
function getDesactiveButton() {
    let return_;
    menuButtons.forEach((e) => {
        if (e.className != activeButtonClassName) {
            return_ = e;
        }
    });
    return return_;
}
function getCurrentSection() {
    const activeButtonName = getCurrentActiveButton().textContent;
    for (const key in sectionMap) {
        let section = sectionMap[key];
        if (key !== activeButtonName) {
            return section;
        }
    }
}

function toggleMenuButtons() {
    const activeButton = getCurrentActiveButton();
    const other = getDesactiveButton();
    if (activeButton instanceof Element && other instanceof Element) {
        other.className = activeButtonClassName;
        activeButton.className = "";
    }
}
function toggleMenuSections() {
    const activeButtonName = getCurrentActiveButton().textContent;
    for (const key in sectionMap) {
        let section = sectionMap[key];
        if (key !== activeButtonName) {
            section.classList.remove("active");
        } else {
            section.classList.add("active");
        }
    }
}

btnBackPage.addEventListener("click", () => {
    toPage(homePagePath);
});

menuForms.forEach(element => {
    element.addEventListener("submit", (e) => {
        e.preventDefault();
    });
});
menuButtons.forEach(element => {
    element.addEventListener("click", () => {
        if (!isActiveButton(element)) {
            toggleMenuButtons();
            toggleMenuSections();
        }
    });
});
