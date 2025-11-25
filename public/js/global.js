

export const hasLoggedStorageName = "hasLogged";
export const loggedUserStorageName = "loggedUser";

if (localStorage.getItem(hasLoggedStorageName) === null)
    localStorage.setItem(hasLoggedStorageName, false);


export const minCharacteresInSignUp = { name: 5, password: 8 };
export const hasAlphabetRegex = /[A-Za-z]/;
export const hasOnlyAlphabetAndInternalSpacesRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
export const hasAccentuationRegex = /[À-ÖØ-öø-ÿ]/;
export const hasSpecialCharactersRegex = /[^A-Za-z0-9]/;
export const hasNumberCharactersRegex = /\d/;
export const hasValideEmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const phoneNumberExceptionsCharsRegex = /[()\-\s]/g;

export const userHasLoggedEvent = new Event("userHasLoggedEvent");
export const userHasLeftEvent = new Event("userHasLeftEvent");
export const homePageFileName = "index.html";
export const rootPath = "/public";
export const fallBackProductIcon = "./img/enroladinho-de-salsicha.jpg";
export const offStockIcon = "./img/sem-estoque.webp";
export const functionResponseCodeMap = {
    0: "OK.",
    "-1": "Um erro inesperado ocorre.",
    "-2": "Esse usuário já existe.",
    "-3": "As senhas não coincidem.",
    "-4": "Usuário não encontrado.",
    "-5": `O nome deve ter no mínimo ${minCharacteresInSignUp.name} caracteres.`,
    "-6": "O nome não deve conter números ou caracteres especiais.",
    "-7": `A senha deve ter no mínimo ${minCharacteresInSignUp.password} caracteres.`,
    "-8": "A senha de ter pelo menos uma letra.",
    "-9": "A senha não deve ter letras acentuadas.",
    "-10": "A senha de ter pelo menos uma número.",
    "-11": "A senha deve ter ao menos um caractere especial.",
    "-12": "Coloque um email válido.",
    "-13": "As informações de usuário não se alteraram",
    "-14": "O produto já existe."
};
