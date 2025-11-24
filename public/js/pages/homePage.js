import { hasLoggedStorageName } from "../global.js";
import { setLocalStorage, getLocalStorage } from "../utils.js";

const btnLogin = document.querySelector("#btn-login");
const btnCadastro = document.querySelector("#btn-cadastro");
const btnLogOut = document.querySelector("#btn-logout");
const btnMenuPerfil = document.querySelector("#btn-perfil");
const btnMenuMeusPedidos = document.querySelector("#btn-meus-pedidos");

/**
 * Callback para quando o usuário logar.
 */
export function userHasLogged() { // Está logado
    setLocalStorage(hasLoggedStorageName, true); // Define como logado
    btnMenuPerfil.classList.add("active");
    btnMenuMeusPedidos.classList.add("active");
    btnLogin.classList.remove("active");
    btnCadastro.classList.remove("active");
    btnLogOut.classList.add("active");
}
/**
 * Callback para quando o usuário deslogar.
*/
export function userHasLeft() { // Não está logado
    if (getLocalStorage(hasLoggedStorageName) === true)
        window.location.reload();
    setLocalStorage(hasLoggedStorageName, false); // Define como deslogado
    btnMenuPerfil.classList.remove("active");
    btnMenuMeusPedidos.classList.remove("active");
    btnLogin.classList.add("active");
    btnCadastro.classList.add("active");
    btnLogOut.classList.remove("active");
}
