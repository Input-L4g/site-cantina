import {
    bindOverlay,
    closeModal
} from "./utils.js"

const sobreModal = document.querySelector(".sobre-modal");
const btnCloseSobreModal = document.querySelector(".btn-fechar-sobre");
const btnOpenSobreModal = document.querySelector("#btn-sobre");
let hasBinded = false;

export function showSobreModal(menuModal) {
    if (hasBinded) return;
    bindOverlay(sobreModal, btnOpenSobreModal, btnCloseSobreModal, () => {
        closeModal(menuModal);
        sobreModal.style.zIndex = 10;
    });
    hasBinded = true;
}
