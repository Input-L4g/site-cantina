import { setLocalStorage, getLocalStorage, valideUserDataFields, toPage } from "../utils.js";
import { encodeEntry } from "../userCrud.js";

const nameProduct = document.querySelector(".nome-produto");
const catProduct = document.querySelector(".categoria");
const descriptionProduct = document.querySelector(".descricao-texto");
const priceProducts = document.querySelector("#preco-produto");
const stockProduct = document.querySelector("#quantidade-disponivel");
const iconProduct = document.querySelector("#upload-image");

const nameWarning = document.querySelector("#warning-name");
const catWarning = document.querySelector("#warning-cat");
const descriptionWarning = document.querySelector("#warning-description");
const priceWarning = document.querySelector("#warning-price");
const qtdWarning = document.querySelector("#warning-qtd");
const imageWarning = document.querySelector("#warning-image");

const btnConfirm = document.querySelector(".btn-verde");
const btnCancel = document.querySelector(".btn-vermelho");

const formAddProduct = document.querySelector("#form-add-product");
const tableProduct = "products";
const storeProductsImage = "productImages";

if (getLocalStorage(tableProduct) === null) { // Cria se não existir
    setLocalStorage(tableProduct, {initialized: true});
}

const productsImageDB = indexedDB.open(storeProductsImage, 1);

productsImageDB.onupgradeneeded = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
    }
}
productsImageDB.onsuccess = function (event) {
    const db = event.target.result;
    console.log('Banco carregado');
};

productsImageDB.onerror = function () {
    console.error('Erro ao abrir indexedDB');
};

function saveImage(db, id, blob) {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');

    store.put({ id, blob }); // Passa o ID e o blob (arquivo)

    tx.oncomplete = () => console.log('Imagem salva.');
    tx.onerror = () => console.log('Erro ao salvar imagem.');
}

function getRawImage(db, id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('imagens', 'readonly');
        const store = tx.objectStore('imagens');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(null);
    });
}

async function getImageURL(db, id) {
    return getRawImage(db, id).then((data) => {
        if (data) {
            const url = URL.createObjectURL(data.blob);
            return url;
        }
    });
}

function deleteImage(db, id) {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    store.delete(id);
}

function setValueP(pTag, value = "") {
    if (pTag === undefined) {
        setValueP(catWarning);
        setValueP(descriptionWarning);
        setValueP(priceWarning);
        setValueP(qtdWarning);
        return;
    }
    pTag.textContent = value;
}

function readProduct(name) {
    try {
        return getLocalStorage(tableProduct)[name];
    } catch (error) {
        console.log("Erro ao ler produto:",error.message || error);
    }
}

function hasProduct(name) {
    return readProduct(name) !== null;
}

function deleteProduct(name) {
    try {
        if (!hasProduct(name)) return;
        const products = getLocalStorage(tableProduct);
        delete products[name]
        setLocalStorage(tableProduct, products);
    } catch (error) {
        console.log("Erro ao ler produto:",error.message || error);
    }
}

function existsImage(idOrData) {
    const image = getRawImage(db, getId(idOrData));
    return image !== null;
}

function formatCurrencyBR(inputCurrency) {

    inputCurrency.addEventListener("blur", () => {
        if (inputCurrency.value.replace(/[^\d]/g, "") === "") {
            inputCurrency.value = "";
            return;
        }

        // Garante prefixo R$
        if (!inputCurrency.value.startsWith("R$ ")) {
            inputCurrency.value = "R$ " + inputCurrency.value;
        }
    });

    inputCurrency.addEventListener("input", () => {
        let v = inputCurrency.value;

        // Remove prefixo antes de processar
        v = v.replace(/^R\$\s*/, "");

        // Permite: números, pontos, vírgulas → remove só o resto
        v = v.replace(/[^\d.,]/g, "");

        // Limita a UMA vírgula (decimal)
        const partesVirgula = v.split(",");
        if (partesVirgula.length > 2) {
            v = partesVirgula[0] + "," + partesVirgula.slice(1).join("");
        }

        // Remove todos os pontos para reformatar depois
        const possuiDecimal = v.includes(",");
        let inteiro, decimal;

        if (possuiDecimal) {
            [inteiro, decimal] = v.split(",");
            decimal = decimal ? decimal.slice(0, 2) : "";
        } else {
            inteiro = v;
            decimal = "";
        }

        // Remove pontos do inteiro antes de reformatar
        inteiro = inteiro.replace(/\./g, "");

        // Coloca pontos de milhar
        inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        // Monta o valor final
        if (possuiDecimal) {
            v = decimal ? `${inteiro},${decimal}` : `${inteiro},`;
        } else {
            v = inteiro;
        }

        inputCurrency.value = "R$ " + v;
    });
}


stockProduct.addEventListener("change", () => {
    let value = stockProduct.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^0+/g, "");
    if (value.replace(/0/g, "") === "")
        value = "0";
    stockProduct.value = value;
});

formatCurrencyBR(priceProducts);

formAddProduct.addEventListener("reset", () => {
    toPage();
});

formAddProduct.addEventListener("submit", async (e) => {
    e.preventDefault();

    setValueP()

    const productData = {
        name: nameProduct.value,
        category: catProduct.value,
        description: descriptionProduct.value,
        price: priceProducts.value,
        stock: stockProduct.value,
        icon: iconProduct.files
    };

    let response = valideUserDataFields(productData, ["name"]);
    if (response.code !== -5 && response.code < 0) {
        setValueP(nameWarning, response.message);
        return;
    }
    else if (productData.name.trim().length < 2) {
        setValueP(nameWarning, "O nome deve ter pelo menos 3 caracteres.");
        return;
    }
    setValueP(nameWarning);
    if (productData.description.trim().length < 50) {
        setValueP(descriptionWarning, "A descrição deve ter pelo menos 50 caracteres,");
        return;
    }
    setValueP(descriptionWarning);
    if (productData.price < 0) {
        setValueP(priceWarning, "O preço deve ser positivo");
        return;
    }
    setValueP(priceWarning);
    if (productData.icon.length === 0) {
        setValueP(imageWarning, "Selecione uma imagem para o produto.");
        return;
    }
    setValueP(imageWarning);

    productData.icon = productData.icon[0];
    const id = productData.name;
    if (hasProduct(id)) {
        console.log(id);
        console.log(getLocalStorage(tableProduct));
        setValueP(nameWarning, "Esse produto já existe.");
        return;
    }
    setValueP();
    saveImage(db, id, productData.icon);
    productData.icon = getImageURL(db, id);
    console.log(productData.icon);

    const { cardapio } = await import('../cardapio.js');
    response = cardapio.addItem(...productData);
    if (response.code < 0) {
        setValueP(nameWarning, response.message);
    }
    setValueP();
    cardapio.renderCardapio();
});
