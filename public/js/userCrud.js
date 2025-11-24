import { filterObject, mergeObjects, createFunctionResponse } from "./utils.js";

//! ========== GLOBAL variables ==========
const tableName = "users";

//! ========== UTILS functions ==========

/**
 * Verifica se os dados de um usuário existem.
 * @param {{ name: string, email: string, phoneNumber: string, password: string}
 * } userData Dados de usuário.
 * @returns {{ code: number, message: string, err: string | Error }
 * } Se o usuário foi autenticado.
 */
export function authUser(userData) {
    const id = getUserId(userData);
    if (!hasExistsUser(id)) return createFunctionResponse(-4);
    const gettedUser = getInUsersTable(id);
    if (gettedUser.password !== userData.password) return createFunctionResponse(-3);
    return createFunctionResponse(0);
}

/**
 * Exibe os usuários no console, com a formatação:
 * ID - Object
 */
export function showUsers() {
    const users = loadUsersTable();
    delete users["tableIntialized"];
    if (Object.keys(users).length === 0) {
        console.log("Nenhum usuário adicionado.");
        return;
    }
    for (const id in users) {
        const user = users[id];
        console.log(`${id} -`, user.name, user.email, user.phoneNumber, user.password);
    }
}

/**
 * Embaralha dois valores em um único.
 *
 * É um algoritmo determinístico, logo, as mesmas entradas
 * resultam em mesmos resultado.
 * @param {any} t1 Primeiro valor.
 * @param {any} t2 Segundo valor.
 * @returns {string} Valores embaralhados
 */
function encodeEntry(t1, t2) {
    /** @type {string} */
    t1 = String(t1);
    /** @type {string} */
    t2 = String(t2);

    const id = [];
    /** @type {string} */
    let b_text;
    /** @type {string} */
    let s_text;

    if (t1.length >= t2.length) {
        b_text = t1;
        s_text = t2;
    } else {
        b_text = t2;
        s_text = t1;
    }

    let s_index = 0;
    while (s_index < s_text.length) {
        id.push(b_text.charAt(s_index));
        id.push(s_text.charAt(s_index));
        s_index++;
    }

    const remainingText = b_text.slice(s_index);
    const center = Math.trunc(remainingText.length / 2);

    const p1 = remainingText.slice(0, center);
    const p2 = remainingText.slice(center);

    return p1 + id.join("") + p2;
}

/**
 * Pega o Id de um usuário.
 * @param {{ email: string, phoneNumber: string } | string
 * } userData Informações do usuário. Deve conter, pelo menos, email e telefone.
 * @param {boolean} identifyId
 * Se deve identificar automaticamente se a entrada é um Id por si só. Por padrão é true.
 * @returns {string} Id do usuário.
 */
export function getUserId(userData, identifyId = true) {
    if (identifyId && typeof userData === "string") return userData;
    return encodeEntry(userData.email, userData.phoneNumber);
}

/**
 * Reduz o conteúdo cru do usuário, retornando apenas o que será armazenado.
 * @param {{ name: string, email: string, phoneNumber: string, password: string, confirmPassword: string}} rawUserData Conteúdo cru do usuário.
 * @returns {{ name: string, email: string, phoneNumber: string, password: string}} Informações
 * relevantes do usuário.
 */
function getUserDataFromRawData(rawUserData) {
    const { name, email, phoneNumber, password } = rawUserData;
    return { name, email, phoneNumber, password };
}

/**
 * Sanitiza (purifica) as informações em um conteúdo cru de usuário.
 * @param {{ name: string, email: string, phoneNumber: string, password: string, confirmPassword: string}
 * } rawUserData Informações cruas do usuário
 * @returns
 */
function sanitizeRawUserData(rawUserData) {
    return Object.fromEntries(
        Object.entries(rawUserData).map(([k, v]) => {
            if (k === "phoneNumber") v = v.replace(/[()\-\s]/g, "");
            else v = v.trim();
            return [k, v];
        })
    );
}

/**
 * Verifica se um usuário já existe na tabela de usuário.
 * @param {string} userId Id do usuário.
 * @param {object} userTable Tabela usada para verificar. Se null,
 * será carregada a tabela `users`, no localStorage.
 * @returns {boolean} Se o usuário já existe.
 */
export function hasExistsUser(userId, userTable = null) {
    let table;
    if (userTable !== null) table = userTable;
    else table = loadUsersTable();
    return Object.hasOwn(table, userId);
}

/**
 * Valida a criação e inserção de um usuário à tabela de usuarios.
 * @param {{ name: string, email: string, phoneNumber: string, password: string, confirmPassword: string}
 * } rawUserData Conteúdo bruto do usuário.
 * @returns
 */
function valideRawUserData(rawUserData) {
    if (hasExistsUser(getUserId(rawUserData))) return -2;
    if (rawUserData.password !== rawUserData.confirmPassword) return -3;
    return 0;
}

//! ========== DB functions ==========

/**
 * Sobrescreve a tabela de usuário com uma nova tabela.
 * @param {object} data Nova tabela.
 */
function setInAllUsersTable(data) {
    localStorage.setItem(tableName, JSON.stringify(data));
}

/**
 * Define um novo conteúdo para um usuário na tabela de usuários.
 * @param {string} id Id do usuário.
 * @param {{ name: string, email: string, phoneNumber: string, password: string }
 * } newUserData Novo conteúdo.
 */
function setInUsersTable(id, newUserData) {
    const users = loadUsersTable();
    users[id] = newUserData;
    setInAllUsersTable(users);
}

/**
 * Apaga um usuário da tabela pelo Id.
 * @param {string} id Id do usuário que será deletado.
 */
function deleteInUsersTable(id) {
    const users = loadUsersTable();
    if (!hasExistsUser(id, users)) return; // Usuário não existe
    delete users[id]; // Apaga o usuário pelo Id
    setInAllUsersTable(users); // Sobrescreve com as novas informações
}

/**
 * Adiciona um novo conteúdo na tabela de usuário.
 * @param {string} id Id do conteúdo.
 * @param {object} data Nova tabela.
 */
function addInUsersTable(id, data) {
    const loadedUsers = loadUsersTable();
    loadedUsers[id] = data;
    setInAllUsersTable(loadedUsers);
}

/**
 * Pega um usuário da tabela de usuário.
 * @param {string} id Id do usuário.
 * @param {any} default_ Retorno padrão caso o usuário não seja encontrado.
 * @returns {object | null} O usuário buscado ou null.
 */
function getInUsersTable(id, default_ = null) {
    const loadedUsers = loadUsersTable();
    if (!hasExistsUser(id, loadedUsers)) return default_;
    return loadedUsers[id];
}

/**
 * Carrega e retorna toda a tabela de usuários.
 * @returns {object} Tabela de usuário.
 */
function loadUsersTable() {
    const users = localStorage.getItem(tableName);
    return Boolean(users) ? JSON.parse(users) : {};
}

/**
 * Inicia a tabela Users.
 */
function initUsersTable() {
    if (localStorage.getItem(tableName) !== null) return;
    setInAllUsersTable({ tableIntialized: true });
}

/**
 * Limpa toda a tabela de usuário.
 */
export function clearUsersTable() {
    setInAllUsersTable({ tableIntialized: true });
}

//! ========== CRUD functions ==========

//* ----- CREATE -----
/**
 * Cria um novo usuário na tabela de usuários.
 * @param {{ name: string, email: string, phoneNumber: string, password: string, confirmPassword: string}
 * } rawUserData Informações cruas e sem formatação do usuário.
 * @returns {{ code: number, message?: string, err?: string | Error }} Resposta da função.
 */
export function createUser(rawUserData) {
    try {
        rawUserData = sanitizeRawUserData(rawUserData); // Sanitiza as informações
        const validation = valideRawUserData(rawUserData); // Valida as informações
        if (validation < 0) return createFunctionResponse(validation); // Algum erro na validação
        const user = getUserDataFromRawData(rawUserData); // Pega apenas o que será armazenado
        addInUsersTable(getUserId(user), user); // Armazena na tabela
        return createFunctionResponse(0); // Código de sucesso
    } catch (error) {
        return createFunctionResponse(-1, null, error); // Erro inesperado
    }
}

//* ----- READ -----
/**
 *
 * @param {{ email: string, phoneNumber: string } | string
 * } userIdOrData Pode ser o email e telefone ou o Id direto do usuário.
 * @param {Array<string>} searchedKeys Chaves para filtrar a busca. Se null, será retornado todo o conteúdo. Por padrão é null.
 * @param {any} default_ Retorno padrão caso o usuário não seja encontrado. Por padrão é null.
 * @returns {{ name: string, email: string, phoneNumber: string, password: string}
 * } Informações do usuário buscado. Caso o usuário não exista, será retornado o `default_`
 */
export function readUser(userIdOrData, searchedKeys = null, default_ = null) {
    try {
        const id = getUserId(userIdOrData);
        const user = getInUsersTable(id, default_); // Retorna o usuário ou default_
        if (user === default_) 
            return default_;
        if (searchedKeys !== null) 
            return filterObject(user, searchedKeys);
        return user;
    } catch (error) {
        return createFunctionResponse(-1, null, error); // Erro inesperado
    }
}

//* ----- UPDATE -----
/**
 * @param {{ email: string, phoneNumber: string } | string
 * } oldUserIdOrData Id do usuário ou email e telefone antes da atualização.
 * @param {{ name: string, email: string, phoneNumber: string, password: string}
 * } newUserData Novas informações do usuário.
 * @returns {{ code: number, message?: string, err?: string | Error }} Resposta da função.
 */
export function updateUser(oldUserIdOrData, newUserData) {
    try {
        const oldUserId = getUserId(oldUserIdOrData);
        if (!hasExistsUser(oldUserId)) return createFunctionResponse(-4); // Usuário não existe
        const newId = getUserId(newUserData); // Pega o novo Id
        const idHasChanged = oldUserId !== newId; // Verifica se mudou, ou seja, email ou telefone mudaram
        const oldUserData = getInUsersTable(oldUserId);
        const newUserInfos = mergeObjects(
            // Mecla as informações antigas com as novas
            oldUserData, // Informações antigas
            newUserData // Informações novas
        );
        if (oldUserId !== newId && oldUserData === newUserInfos) 
            return createFunctionResponse(-13);
        if (idHasChanged) deleteInUsersTable(oldUserId); // Apaga o Id antigo se tiver mudado
        setInUsersTable(newId, newUserInfos); // Coloca as novas informações com o Id novo ou antigo
        return createFunctionResponse(0);
    } catch (error) {
        return createFunctionResponse(-1, null, error); // Erro inesperado
    }
}

//* ----- DELETE -----
/**
 * Apaga um usuário por Id.
 * @param {{ email: string, phoneNumber: string } | string
 * } userIdOrData Id do usuário que será apagado.
 * @returns {{ code: number, message?: string, err?: string | Error }} Resposta da função.
 */
export function deleteUser(userIdOrData) {
    try {
        const id = getUserId(userIdOrData);
        if (!hasExistsUser(id)) return createFunctionResponse(-4);
        deleteInUsersTable(id);
        return createFunctionResponse(0);
    } catch (error) {
        return createFunctionResponse(-1, null, error); // Erro inesperado
    }
}

initUsersTable(); // Inicia a tabela de usuários
