// import { 
//     inputName,
//     inputEmail,
//     inputPhoneNumber,
//     inputOldPassword,
//     inputNewPassword,
//     inputConfirmNewPassword 
// } from "./perfil.js"

const btnLogin = document.querySelector("#btn-login");
const btnCadastro = document.querySelector("#btn-cadastro");
const btnLogOut = document.querySelector("#btn-logout");
const btnMenuPerfil = document.querySelector("#btn-perfil");
const btnMenuMeusPedidos = document.querySelector("#btn-meus-pedidos");

/**
 * Callback para quando o usuário logar.
 */
export function userHasLogged() { // Está logado
    console.log("Usuário Logou!");
    localStorage.setItem("hasLogged", true);
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
    console.log("Usuário Deslogou!");
    localStorage.setItem("hasLogged", false);
    btnMenuPerfil.classList.remove("active");
    btnMenuMeusPedidos.classList.remove("active");
    btnLogin.classList.add("active");
    btnCadastro.classList.add("active");
    btnLogOut.classList.remove("active");
}
