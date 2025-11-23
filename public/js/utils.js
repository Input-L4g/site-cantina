import { homePageFileName, rootPath } from "./global.js";

const overlayMenu = document.querySelector("#overlay-menu");
const body = document.querySelector("body");


/**
 * Verifica se um objeto tem alguma chave com um certo valor.
 * @param {*} o Objeto que será verificado.
 * @param {*} value Valor procurado.
 * @returns {boolean} Se o objeto tem o valor procurado.
 */
export function objectHasValue(o, value) {
    for (const key in o) {
        if (o[key] === value) return true;
    }
    return false;
}

/**
 * Mescla objetos.
 * @param  {...object} objs Objetos que serão mesclados, prevalece as informações dos últimos.
 * @returns {object} Objeto mesclado.
 */
export function mergeObjects(...objs) {
    return Object.assign({}, ...objs);
}

/**
 * Filtra um objeto, retornando apeneas chaves especificadas.
 * @param {object} o Objeto.
 * @param {Array<string>} searchedKeys Arrays das chaves procuradas.
 * @returns {object} Objeto com as chaves filtradas. 
 * Se não tiver nenhuma chave buscada, retornará um objeto vazio.
 */
export function filterObject(o, searchedKeys) {
    let i = false;
    searchedKeys.forEach((v) => {
        if (!i && Object.hasOwn(v)){
            i = true;
        }
    });
    if (!i) return {};
    return Object.fromEntries(
        Object.entries(o).filter(([key]) => searchedKeys.includes(key))
    );
}

/**
 * Remove todas as acentuações das letras de uma string, mantendo a letra.
 * @param {string} t Texto com acentuação.
 * @returns {string} Texto sem acentuação.
 */
export function removeAccentuation(t) {
    return t
        .normalize("NFD") // Separa as acentuações das palavras
        .replace(/[\u0300-\u036f]/g, ""); // Remove os caracteres de acentuação
}

/**
 * Define texto para um elemento HTML temporariamente.
 * Após esse tempo, o texto anterior voltará, caso nenhum outro tenha sido definido.
 * @param {Element} element Elemento que terá seu valor alterado temporariamente.
 * @param {string} newValue Texto que substituirá o texto do elemento.
 * @param {number} interval Duração em ms que o novo texto ficará.
 * @param {string} defaultValue Texto que aparecerá quando o tempo acabar.
 * Se null, será usado o texto anterior.
 * @param {Function} callback Função que será chamada quando o tempo terminar. 
 * @returns {number} Id do Timeout usado.
 */
export function setElementValueTemporarily(
    element,
    newValue,
    interval = 1000,
    defaultValue = null,
    callback = null
) {
    if (defaultValue === null) {
        defaultValue = element.textContent;
    }
    element.textContent = newValue;
    const id = setTimeout(() => {
        if (callback !== null) {
            callback();
        }
        element.textContent = defaultValue;
    }, interval);
    return id;
}

export function getCurrentPageName() {
    return window.location.pathname.split("/").pop();
}

export function formatPrice(price) {
    return price.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatStock(stock) {
    if (stock > 0) {
        return `${stock} DISPONÍVE${stock === 1 ? "L" : "IS"}`;
    }
    return "INDISPONÍVEL";
}

export function printArray(arr, level = 0) {
    const sep = ", ";
    let buffer = "";
    let hasSubArray = false;
    arr.forEach((element, i) => {
        if (element instanceof Array) {
            console.log(`${"\t".repeat(level)}${buffer}`);
            printArray(element, level + 1);
            hasSubArray = true;
        } else {
            buffer += i === lastIndex(arr) ? element : element + sep;
        }
    });
    if (!hasSubArray) {
        console.log(`${"\t".repeat(level)}${buffer}`);
    }
}

export function lastIndex(arr) {
    return arr.length - 1;
}

export function clearArray(arr) {
    arr.splice(0, arr.length);
}

export function removeElementFromArray(arr, element) {
    const index = arr.indexOf(element);
    if (index !== -1) {
        arr.splice(index, 1);
        return true;
    }
    return false;
}

export function capitalize(text) {
    if (text.split(" ").length == 1) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}
/**
 * Completa um caminho partindo do root.
 * @param  {...string} paths Caminhos para unir com o root.
 * @returns {string} Caminho completo com o root.
 */
export function createRootPath(...paths) {
    return join(rootPath, ...paths);
}
/**
 * Une caminhos aplicando um separador corretamente.
 * @param  {...string} path Caminho para unir.
 * @returns {string} Caminho unido. Ex: "exemplo/caminho/unido"
 */
export function join(...path) {
    path = path.filter((value) => value.trim() !== "");
    const firstPath = path.shift();
    path = path.map((v) => v.replace(/^\/|\/$/g, ""));
    return [
        (firstPath.charAt(0) === "/" ? "/" : "") +
            firstPath.replace(/^\/|\/$/g, ""),
        ...path,
    ].join("/");
}
/**
 * Redireciona para uma página indicada.
 * @param  {...string} pagePath Caminho para a página.
 * Se vazio, será usado o caminho para o index.html.
 */
export function toPage(...pagePath) {
    if (pagePath.length > 0) {
        if (pagePath.length > 1) {
            pagePath = join(...pagePath);
        } else {
            pagePath = pagePath[0];
        }
        window.location.href = pagePath;
        return;
    }
    toPage(createRootPath("index.html"));
}

export function bindOverlay(
    modal,
    btnOpenOverlay,
    btnCloseOverlay = null,
    callback = null
) {
    bindOpenOverlay(modal, btnOpenOverlay, callback);
    bindCloseOverlay(modal, btnCloseOverlay, callback);
}

export function closeModal(modal, callback = null) {
    modal.classList.remove("active");
    if (typeof callback === "function") {
        callback(false);
    }
}

export function closeOverlay(modal, callback = null) {
    overlayMenu.classList.remove("active");
    modal.classList.remove("active");
    body.style.overflowY = "visible";
    if (callback) {
        callback(false);
    }
}

export function bindOpenOverlay(modal, btnOpenOverlay, callback = null) {
    btnOpenOverlay.addEventListener("click", () => {
        overlayMenu.classList.add("active");
        modal.classList.add("active");
        body.style.overflowY = "hidden";
        if (callback) {
            callback(true);
        }
    });
}

export function bindCloseOverlay(
    modal,
    btnCloseOverlay = null,
    callback = null
) {
    if (btnCloseOverlay) {
        btnCloseOverlay.addEventListener("click", () => {
            closeOverlay(modal);
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeOverlay(modal);
        }
    });
    overlayMenu.addEventListener("click", () => {
        closeOverlay(modal);
    });
}
