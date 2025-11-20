import {
    toPage,
    createRootPath,
    bindOverlay
} from "./utils.js";

import {
    showSobreModal
} from "./sobre.js";

import {
    homePageFileName
} from "./global.js";

const btnOpenMenu = document.querySelector('.btn-open-menu');
const menuAsideModal = document.querySelector('#menu-aside');
const menuOpts = document.querySelectorAll(".opt-menu");
const mapMenuOptsPages = {
    "btn-perfil": createRootPath("pages", "perfil", "perfil.html"),
    "btn-sobre": showSobreModal,
    "btn-cardapio": createRootPath(homePageFileName),
    "btn-meus-pedidos": createRootPath(homePageFileName),
    get(key, default_ = null) {
        return this.hasOwnProperty(key)? this[key] : default_;
    }
};

bindOverlay(menuAsideModal, btnOpenMenu);

menuOpts.forEach(menuOption => {
    const action = mapMenuOptsPages.get(menuOption.id);
    if (typeof action === "function") {
        action(menuAsideModal);
    } else {
        menuOption.addEventListener("click", () => toPage(action)); //! RESOLVER AQUI
    }
});
