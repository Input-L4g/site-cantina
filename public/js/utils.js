import { homePageFileName, rootPath } from "./global.js";

const overlayMenu = document.querySelector("#overlay-menu");
const body = document.querySelector("body");

/**
 * Cria uma resposta HTTP.
 * @param {number} statusCode Código de resposta.
 * @param {object} body Conteúdo da reposta.
 */
export function createHTTPResponse(statusCode, body = null, headers = null) {
    const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
    const shallowOpts = {
        statusCode,
        headers: headers || defaultHeaders
    };
    if (body !== null) {
        shallowOpts.body = JSON.stringify(body);
    }
    return shallowOpts;
}

/**
 * Cria uma requisição HTTP.
 * @param {string} method Método da requisição. Por padrão é "GET".
 * @param {BodyInit} body Corpo da requisição.
 * @param {HeadersInit} headers Header da requisição.
 * @returns {object} Requesição criada com os parâmetros válidos.
 * Os parâmetros inválidos foram substituidos por valores padrões.
 */
export function createRequestOptions(
    method = "GET",
    body = null,
    headers = null
) {
    const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
    const shallowOpts = {
        method,
        headers: headers || defaultHeaders,
    };
    if (body !== null && method !== "GET") {
        shallowOpts.body = JSON.stringify(body);
    }
    return shallowOpts;
}

/**
 * Executa uma requisição HTTP com fetch.
 * @param {string} endpoint Endpoint da requisição.
 * @param {object | null } content Conteúdo da requisição. Por padrão é null.
 * @returns {Promise<Response>} Resposta da requisição.
 */
export async function fetchRequest(endpoint, content = null) {
    if (content) {
        console.log("Usando content:", content);
        return await fetch(endpoint, content);
    }
    return await fetch(endpoint);
}

/**
 * Executa uma função serverless do Netlify, passando o método, header e body.
 * Essa função aplica automáticamente a stringficação de objetos.
 * @param {string} functionEndpoint Nome e endpoint da função serverless.
 * @param {object | null} content Conteúdo da requisição. Por padrão é null.
 * @returns {Promise | Response} Apenas o body já parseado ou o objeto Response inteiro.
 */
export async function serverLessFunction(functionEndpoint, content = null) {
    const response = await fetchRequest(
        join("/.netlify", "functions", functionEndpoint),
        content
    );
    return await (response.body !== undefined? response.json() : response);
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
    setTimeout(() => {
        if (callback !== null) {
            callback();
        }
        element.textContent = defaultValue;
    }, interval);
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
    if (pagePath) {
        if (pagePath.length > 1) {
            pagePath = join(...pagePath);
        } else {
            pagePath = pagePath[0];
        }
        window.location.href = pagePath;
        return;
    }
    toPage(createRootPath(homePageFileName));
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
