const db = "Users";

// Utils

/**
 * Adiciona um usuário no DB, se existir, substitui seus dados pelos novos dados.
 * @param {*} id Id do usuário.
 * @param {*} userData Dados do usuário.
 * @param {*} newId Novo Id do usuário, caso tenha sido alterado.
 */
function addUser(id, userData, newId = null) {
    const users = getSafeDBData();
    if (newId === null && newId !== id) users[id] = userData; // Adiciona o id (email) e content no banco
    else {
        delete users[id];
        users[newId] = userData;
    }
    setNewDataDB(users);
}

/**
 * Verifica se um usuário já foi cadastrado (existe);
 * @param {number} id Id do usuário.
 * @returns {boolean} Se o usuário existe.
 */
function hasExistsUser(id) {
    return Object.hasOwn(readAllUsers(), id);
}

/**
 * Gera um ID com base no email e número de telefone do usuário.
 * @param {string} email Email do usuário.
 * @param {number} phoneNumber Número de telefone do usuário.
 * @returns {string} Id gerado.
 */
export function generateId(email, phoneNumber) {
    /** @type {string} */
    const phoneString = String(phoneNumber);
    const id = [];
    /** @type {string} */
    let b_text;
    /** @type {string} */
    let s_text;

    if (email.length >= phoneString.length) {
        b_text = email;
        s_text = phoneString;
    } else {
        b_text = phoneString;
        s_text = email;
    }
    let s_index = 0;
    while (s_index < s_text.length) {
        id.push(b_text.charAt(s_index));
        id.push(s_text.charAt(s_index));
        s_index += 1;
    }
    const remainingText = b_text.slice(s_index);
    const center = Math.trunc(remainingText.length / 2);
    const p1 = remainingText.slice(0, center);
    const p2 = remainingText.slice(center);
    return p1 + id.join("") + p2;
}

/**
 * Retorna o conteúdo do DB de forma segura, ou seja, 
 * um objeto vazio se não tiver conteúdo.
 * @returns {object} Objeto com todos os usuários ou um objeto vazio.
 */
function getSafeDBData() {
    const users = readAllUsers();
    return Boolean(users)? users : {};
}

//! Funções do DataBase
/**
 * Inicia o Banco de Dados `'Users'`.
 */
function initDB() {
    setNewDataDB({});
}

/**
 * Reescreve o conteúdo do DataBase.
 * @param {object} newData Novo conteúdo para o DataBase.
 */
function setNewDataDB(newData) {
    localStorage.setItem(db, JSON.stringify(newData));
}

/**
 * Limpa o Banco de Dados.
 */
export const clearDB = initDB;

//! CRUD

//* Create
/**
 * Cria e adiciona um usuário ao Banco de Dados.
 * @param {string} email Email do usuário, usado como ID.
 * @param {string} name Nome do usuário.
 * @param {number} phoneNumber Número de telefone do usuário.
 * @param {string} password Senha do usuário.
 * @returns {boolean} True se o usuário foi 
 * adicionado com sucesso, False caso ele já exista.
 */
export function createUser(email, name, phoneNumber, password) {
    if (hasExistsUser(email)) return false;
    addUser(generateId(email, phoneNumber), {name, email, phoneNumber, password});
    return true;
}

//* Read
export function readAllUsers() {
    return  JSON.parse(localStorage.getItem(db));
}

export function readUser(email, phoneNumber) {
    return getSafeDBData()[generateId(email, phoneNumber)];
}

//* Update
export function updateUser(oldEmail, oldPhoneNumber, newData) {
    const { email, phoneNumber} = newData;
    const oldId = generateId(oldEmail, oldPhoneNumber);
    if (!hasExistsUser(oldId)) return false;
    let users = getSafeDBData();
    const updatedUser = {
        ...users[oldId],
        ...newData
    };
    const newId = generateId(newData.email, newData.phoneNumber);
    addUser(oldId, updatedUser, newId !== oldId? newId:null);
    return true;
}

//* Delete
export function deleteUser(email, phoneNumber) {
    const users = getSafeDBData();
    if (!Boolean(users)) return;
    delete users[generateId(email, phoneNumber)];
    setNewDataDB(users);
}

initDB(); // Inicia o Banco de Dados Users