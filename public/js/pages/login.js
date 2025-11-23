import { toPage, setElementValueTemporarily, objectHasValue } from "../utils.js"
import { authUser, getUserId, getInUsersTable } from "../userCrud.js";

const formLogin = document.querySelector("#form-login");
const warningText = document.querySelector("#mensagem-aviso");
const inputEmail = document.querySelector("#email");
const inputPhoneNumber = document.querySelector("#phoneNumber");
const inputPassword = document.querySelector("#password");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = { 
        email: inputEmail.value,
        phoneNumber: inputPhoneNumber.value,
        password: inputPassword.value
    }
    /** @type {number | undefined} Id do timeout de `warningText` . */
    let timeoutId;
    if (objectHasValue(userData, "")) { 
        clearTimeout(timeoutId);
        timeoutId = setElementValueTemporarily(warningText, "Complete todos os campos acima.", 5000);
    }
    clearTimeout(timeoutId);
    const authResult = authUser(userData);
    if (authResult.code !== 0) {
        let message;
        if (authResult.code === -3) message = "Senha incorreta.";
        else message = authResult.message;
        clearTimeout(timeoutId);
        timeoutId = setElementValueTemporarily(warningText, message, 5000);
        return;
    }
    clearTimeout(timeoutId);
    warningText.textContent = "";
    localStorage.setItem("hasLogged", true);
    localStorage.setItem("loggedUser", getInUsersTable(getUserId(userData)));
    toPage("..", "..", "index.html");
});
