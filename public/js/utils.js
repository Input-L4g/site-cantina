import {
    homePageFileName,
    rootPath,
    functionResponseCodeMap,
    minCharacteresInSignUp,
    hasOnlyAlphabetAndInternalSpacesRegex,
    hasAlphabetRegex,
    hasAccentuationRegex,
    hasSpecialCharactersRegex,
    hasNumberCharactersRegex,
    hasValideEmailRegex
} from "./global.js";

const overlayMenu = document.querySelector("#overlay-menu");
const body = document.querySelector("body");

/**
 * Valida os campos de nome, email e senha.
 * @param {{ name:string, email:string, phoneNumber:string, password:string, confirmPassword:string }
 * } userData Valores dos campos.
 * @param {Array<string> | null} onlyFields
 *  Campos especificos que serão validados, fora estes, os demais serão ignorados. 
 * Se null, todos os campos serão validados. Por padrão é null.
 * @param {Array<string> | null} searchedKeys Chaves que serão usadas para procurar em
 * `userData`. Respectivamente, nome, email e senha.
 * @returns {{ code: number, message: string, err: string | Error }
 * } Resposta da função.
 */
export function valideUserDataFields(userData, onlyFields = null, searchedKeys = null) {
    const defaultArray = ["name", "email", "password"];
    if (onlyFields === null) 
        /** @type {Array} */
        onlyFields = defaultArray;
    if (searchedKeys === null)
        /** @type {Array} */
        searchedKeys = defaultArray;

    const minNameChar = minCharacteresInSignUp.name;
    const minPasswordChar = minCharacteresInSignUp.password;
    const fieldName = userData[searchedKeys[0]]?.trim();
    const fieldEmail = userData[searchedKeys[1]]?.trim();
    const fieldPassword = userData[searchedKeys[2]]?.trim();
    if (onlyFields.includes("name") && fieldName !== ""){ // Validação do nome
        if (fieldName.length < minNameChar)
            return createFunctionResponse(-5); // Não tem o mínimo de caracteres
    
        if (!hasOnlyAlphabetAndInternalSpacesRegex.test(fieldName))
            return createFunctionResponse(-6); // Não tem só letras
    }

    if (onlyFields.includes("email") && fieldEmail !== "" && !hasValideEmailRegex.test(fieldEmail))
        return createFunctionResponse(-12); // Email inválido

    if (onlyFields.includes("password") && fieldPassword !== ""){ // Validação da senha
        if (fieldPassword.length < minPasswordChar)
            return createFunctionResponse(-7); // Não tem o mínimo caracteres
    
        if (!hasAlphabetRegex.test(fieldPassword))
            return createFunctionResponse(-8); // Não tem letras
    
        if (hasAccentuationRegex.test(fieldPassword))
            return createFunctionResponse(-9); // Tem letras acentuadas
    
        if (!hasNumberCharactersRegex.test(fieldPassword))
            return createFunctionResponse(-10); // Não tem números
    
        if (!hasSpecialCharactersRegex.test(fieldPassword))
            return createFunctionResponse(-11); // Não tem caracteres especiais
    }
    return createFunctionResponse(0);
}

/**
 * Aplica formatação simultânea à escrita no input de número de telefone.
 * 
 * Atende aos padrões (XX) XXXXX-XXXX e (XX) XXXX-XXXX.
 * @param {Element} inputPhoneNumber 
 */
export function formatPhoneNumber(inputPhoneNumber) {
    inputPhoneNumber.addEventListener("blur", () => {
        if (inputPhoneNumber.value.replace(/\D/g, "") === "")
            inputPhoneNumber.value = "";
    })

    inputPhoneNumber.addEventListener("input", () => {
        let v = inputPhoneNumber.value;

        // remove tudo que não é número
        v = v.replace(/\D/g, "");

        // (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (v.length > 10) {
            v = v.replace(/(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (v.length > 6) {
            v = v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (v.length > 2) {
            v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
        } else {
            v = v.replace(/(\d{0,2})/, "($1");
        }

        inputPhoneNumber.value = v;
});
}

/**
 * Cria uma resposta de função.
 * @param {number} code Código da resposta. Consulte `functionResponseCodeMap` em `global.js`
 * @param {string} message Mensagem da resposta. Opcional
 * @param {string | Error} err Erro da resposta. Opcional
 * @param {boolean} autoMessage Indica se deve pegar uma mensagem genérica.
 * @returns {{ code: number, message: string, err: string | Error }} Resposta gerada.
 */
export function createFunctionResponse(
    code,
    message = null,
    err = null,
    autoMessage = true
) {
    const response = { code };
    if (message !== null) response["message"] = message;
    else if (autoMessage) response["message"] = functionResponseCodeMap[code];
    if (err !== null)
        response["err"] = typeof err === "string" ? err : err.response || err;
    return response;
}

/**
 * Define um valor para uma chave no localStorage.
 * @param {string} key Chave que será definida. 
 * @param {any} value Valor para a chave.
 */
export function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
/**
 * Pega e parseia um item pego do localStorage
 * @param {string} key Chave do item no localStorage.
 * @returns { any } Objeto armazenado.
 */
export function getLocalStorage(key) {
    const itemGetted = localStorage.getItem(key);
    return itemGetted !== null? JSON.parse(itemGetted) : itemGetted;
}

/**
 * Verifica se um objeto tem alguma chave com um certo valor.
 * @param {object} o Objeto que será verificado.
 * @param {any} value Valor procurado.
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
    toPage(createRootPath(homePageFileName));
}

/**
 * Aplica overlay automático para entrar e sair de um modal.
 * @param {HTMLElement} modal Modal que será exibido.
 * @param {HTMLElement} btnOpenOverlay Botão que abrirá o modal. 
 * @param {HTMLElement} btnCloseOverlay Botão que fechará o modal. Opcional.
 * @param {Function} callback Callback executado quando o modal abrir e fechar.
 */
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
            closeOverlay(modal, callback);
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeOverlay(modal, callback);
        }
    });
    overlayMenu.addEventListener("click", () => {
        closeOverlay(modal, callback);
    });
}
