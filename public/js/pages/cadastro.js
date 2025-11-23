import { toPage } from "../utils.js";
import { createUser } from "../userCrud.js";

const formCadastro = document.getElementById("form-cadastro");
const warningText = document.querySelector("#mensagem-aviso");

formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawUserData = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        phoneNumber: document.querySelector("#phone-number").value,
        password: document.querySelector("#password").value,
        confirmPassword: document.querySelector("#confirm-password").value,
    }
    const response = createUser(rawUserData);
    if (response.code < 0) {
        warningText.textContent = response.message || "Erro não reconhecido.";
        return;
    }
    warningText.textContent = "";
    toPage("/public", "pages", "login", "login.html");
}); 
