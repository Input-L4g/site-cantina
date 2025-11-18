import {
    bindCloseOverlay,
    bindOpenOverlay
} from "./utils.js";

function addListenerInVerMaisButtons() {
    const allBtnVerMais = document.querySelectorAll(".btn-ver-mais");
    const verMaisMenu = document.querySelector(".ver-mais-menu");
    const btnSairVerMais = document.querySelector(".ver-mais-menu button");

    allBtnVerMais.forEach((button) => {
        bindOpenOverlay(verMaisMenu, button);
        bindCloseOverlay(verMaisMenu, btnSairVerMais);
    });
}
addListenerInVerMaisButtons();