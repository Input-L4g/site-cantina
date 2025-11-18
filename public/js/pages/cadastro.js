import {
    toPage
} from "../utils.js";

const formCadastro = document.getElementById("form-cadastro");

formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "../login/login.html";
    toPage("..", "login", "login.html")
}); 