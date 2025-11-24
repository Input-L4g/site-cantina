import {} from "./aside-menu.js";
import {} from "./cardapio.js";
import {} from "./ver-mais-menu.js";
import { toPage, getLocalStorage } from "./utils.js";
import { userHasLogged, userHasLeft } from "./pages/homePage.js";
import { userHasLeftEvent, userHasLoggedEvent, hasLoggedStorageName } from "./global.js";
import { clearUsersTable, showUsers } from "./userCrud.js"

document.addEventListener("userHasLeftEvent", userHasLeft);
document.addEventListener("userHasLoggedEvent", userHasLogged);

if (getLocalStorage(hasLoggedStorageName))
window.clearUsersTable = clearUsersTable;
window.showUsers = showUsers;

const btnLogin = document.querySelector("#btn-login");
const btnCadastro = document.querySelector("#btn-cadastro");
const btnLogOut = document.querySelector("#btn-logout");
const pagamentoBoxs = document.querySelectorAll(".sobre-formas-pagamento div p");

pagamentoBoxs.forEach((e) => {
    e.addEventListener("mouseenter", (e) => { 
        e.target.querySelectorAll("p img").forEach((icon) => {
            icon.classList.add("active");
        });
    });
    e.addEventListener("mouseleave", (e) => {
        e.target.querySelectorAll("p img").forEach((icon) => {
            icon.classList.remove("active");
        });
    });
});

btnLogin.addEventListener("click", () => {
    toPage(".", "pages", "login", "login.html");
});
btnCadastro.addEventListener("click", () => {
    toPage(".", "pages", "cadastro", "cadastro.html");
});

btnLogOut.addEventListener("click", userHasLeft);

// Não deixa pegar as imagens
document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", e => e.preventDefault());
        img.addEventListener("dragstart", function (e) {
        e.preventDefault();
    });
});

if (!getLocalStorage(hasLoggedStorageName))
    document.dispatchEvent(userHasLeftEvent);
else
    document.dispatchEvent(userHasLoggedEvent);
