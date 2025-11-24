import { 
    toPage, 
    getLocalStorage, 
    formatPhoneNumber, 
    setLocalStorage,
    valideUserDataFields,
    objectHasValue
} from "../utils.js"
import { 
    hasLoggedStorageName, 
    loggedUserStorageName, 
    phoneNumberExceptionsCharsRegex,
    minCharacteresInSignUp
} from "../global.js"
import { readUser, updateUser, showUsers, getUserId } from "../userCrud.js"

export const inputName = document.querySelector("#nome");
export const inputEmail = document.querySelector("#email");
export const inputPhoneNumber = document.querySelector("#telefone");
export const inputOldPassword = document.querySelector("#senha-original");
export const inputNewPassword = document.querySelector("#nova-senha");
export const inputConfirmNewPassword = document.querySelector("#confirmar-senha");

if (!getLocalStorage(hasLoggedStorageName)) {
    toPage();
}

const btnUpdatePerfil = document.querySelector("#update-perfil");
const btnUpdatePassword = document.querySelector("#update-password");
const btnDeleteAccount = document.querySelector("#delete-account");
/** @type {HTMLElement} */
const warningOldPassword = document.querySelector(".warning.old-password");
const warningNewPassword = document.querySelector(".warning.new-password");
const warningConfirmPassword = document.querySelector(".warning.confirm-password");

function formatUserInputs() {
    if (!getLocalStorage(hasLoggedStorageName))
        return;
    try {
        const user = readUser(getLocalStorage(loggedUserStorageName));
        inputName.value = user.name;
        inputEmail.value = user.email;
        inputPhoneNumber.value = user.phoneNumber;
        inputPhoneNumber.dispatchEvent(new Event("input"));
    } catch (err) {
        console.log("Erro ao formatar inputs:", err.message || err);
    }
}

window.showUsers = showUsers;
formatPhoneNumber(inputPhoneNumber);
formatUserInputs();

btnUpdatePerfil.addEventListener("click", () => {
    const oldId = getLocalStorage(loggedUserStorageName)
    const newUserData = {
        name: inputName.value,
        email: inputEmail.value,
        phoneNumber: inputPhoneNumber.value.replace(phoneNumberExceptionsCharsRegex, "")
    };
    const response = updateUser(oldId, newUserData);
    if (response.code < 0) {
        console.log("Erro:", response.message);
        return;
    }
    setLocalStorage(loggedUserStorageName, getUserId(newUserData));
});



btnUpdatePassword.addEventListener("click", () => {
    warningConfirmPassword.classList.remove("green");
    const passwordFormValues = {
        oldPassword: inputOldPassword.value.trim(),
        newPassword: inputNewPassword.value.trim(),
        confirmNewPassword: inputConfirmNewPassword.value.trim()
    };

    if (objectHasValue(passwordFormValues, "")) {
        warningConfirmPassword.textContent = "Preencha todos os campos."
        return;
    }
    
    const validationResponse = valideUserDataFields(
        passwordFormValues, ["password"], [null, null, "newPassword"]);

    if (validationResponse.code < 0){
        warningConfirmPassword.textContent = validationResponse.message;
        return;
    }

    if (passwordFormValues.newPassword !== passwordFormValues.confirmNewPassword){
        warningConfirmPassword.textContent = "As senhas não se coincidem.";
        return;
    }
    warningConfirmPassword.textContent = "";
    warningNewPassword.textContent = "";
    warningOldPassword.textContent = "";

    delete passwordFormValues.confirmNewPassword;
    const response = updateUser(getLocalStorage(hasLoggedStorageName), passwordFormValues);
    if (response.code === 0) {
        warningConfirmPassword.classList.add("green");
        warningConfirmPassword.textContent = "Senha atualizada!";
    }
});

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
    toPage();   
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