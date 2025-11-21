import {
    toPage,
    serverLessFunction,
    createRequestOptions
} from "../utils.js";

const formCadastro = document.getElementById("form-cadastro");
const warningText = document.querySelector("#mensagem-aviso");

formCadastro.addEventListener("submit", async (e) => {
    const userData = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        confirmPassword: document.querySelector("#confirm-password").value,
    }
    e.preventDefault();
    const response = await serverLessFunction("usersAdd", createRequestOptions("POST", userData));
    const statusCode = response.statusCode;
    console.log(response);
    const message = response.body.message;
    if (statusCode === 200) {
        toPage("../../pages/login/login.html");
        return;
    } if (statusCode === 500) {
        console.log(message);
    } else {
        warningText.textContent = message;
    }
}); 
