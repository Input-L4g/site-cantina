
if (localStorage.getItem("hasLogged") === null) localStorage.setItem("hasLogged", false);

export const userHasLoggedEvent = new Event("userHasLoggedEvent");
export const userHasLeftEvent = new Event("userHasLeftEvent");
export const homePageFileName = "index.html";
export const rootPath = "/public";
export const fallBackProductIcon = "./img/enroladinho-de-salsicha.jpg";
export const offStockIcon = "./img/sem-estoque.webp";
export const functionResponseCodeMap = {
    0: "Nada de errado ocorreu.",
    "-1": "Um erro inesperado ocorre.",
    "-2": "Esse usuário já existe.",
    "-3": "As senhas não coincidem.",
    "-4": "Usuário não encontrado."
}
