import { toPage, valideUserDataFields, formatPhoneNumber } from "../utils.js";
import { createUser } from "../userCrud.js";

const formCadastro = document.querySelector("#form-cadastro");
const inputName = document.querySelector("#name");
const inputEmail = document.querySelector("#email");
const inputPhoneNumber = document.querySelector("#phone-number");
const inputPassword = document.querySelector("#password");
const inputConfirmPassword = document.querySelector("#confirm-password");
const warningText = document.querySelector("#mensagem-aviso");

formatPhoneNumber(inputPhoneNumber);

document.querySelectorAll("#form-cadastro input").forEach((input) => {
    input.addEventListener("input", () => {
        const userData = {
            name: inputName.value,
            email: inputEmail.value,
            phoneNumber: inputPhoneNumber.value,
            password: inputPassword.value,
            confirmPassword: inputConfirmPassword.value,
        };
        const validationResponse = valideUserDataFields(userData);
        console.log("Code:", validationResponse.code);
        if (validationResponse.code < 0)
            warningText.textContent = validationResponse.message;
        else
            warningText.textContent = "";
    });
});


formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawUserData = {
        name: inputName.value,
        email: inputEmail.value,
        phoneNumber: inputPhoneNumber.value,
        password: inputPassword.value,
        confirmPassword: inputConfirmPassword.value,
    };
    const response = createUser(rawUserData);
    if (response.code < 0) {
        warningText.textContent = response.message || "Erro não reconhecido.";
        return;
    }
    warningText.textContent = "";
    toPage("/public", "pages", "login", "login.html");
});
