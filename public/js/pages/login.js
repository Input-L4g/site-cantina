import { 
    phoneNumberExceptionsCharsRegex, 
    loggedUserStorageName,
    hasLoggedStorageName
} from "../global.js";
import { 
    toPage, 
    setElementValueTemporarily, 
    objectHasValue, 
    setLocalStorage, 
    formatPhoneNumber 
} from "../utils.js"
import { authUser, getUserId } from "../userCrud.js";

const formLogin = document.querySelector("#form-login");
const warningText = document.querySelector("#mensagem-aviso");
const inputEmail = document.querySelector("#email");
const inputPhoneNumber = document.querySelector("#phoneNumber");
const inputPassword = document.querySelector("#password");


formatPhoneNumber(inputPhoneNumber);

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = {
        email: inputEmail.value,
        phoneNumber: inputPhoneNumber.value.replace(phoneNumberExceptionsCharsRegex, ""),
        password: inputPassword.value
    };
    /** @type {number | undefined} Id do timeout de `warningText` . */
    let timeoutId;
    if (objectHasValue(userData, "")) { 
        clearTimeout(timeoutId);
        timeoutId = setElementValueTemporarily(warningText, "Complete todos os campos acima.", 5000);
        return;
    }
    clearTimeout(timeoutId);
    const authResult = authUser(userData);
    if (authResult.code !== 0) {
        let message;
        if (authResult.code === -3) message = "Senha incorreta.";
        clearTimeout(timeoutId);
        timeoutId = setElementValueTemporarily(warningText, message || authResult.message, 5000);
        return;
    }
    clearTimeout(timeoutId);
    warningText.textContent = "";
    setLocalStorage(hasLoggedStorageName, true);
    setLocalStorage(loggedUserStorageName, getUserId(userData));
    toPage();
});
