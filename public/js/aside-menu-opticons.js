import {
    changePage
} from "./utils.js"

const allMenuOptions = document.querySelectorAll("ops-aside");
const optionsPages = new Map([
    ["btn-perfil", "./pages/perfil/perfil.html"]
])

allMenuOptions.forEach((button) => {
    button.addEventListener("click", () => {
        changePage(optionsPages.get(button.id));
    });
});
