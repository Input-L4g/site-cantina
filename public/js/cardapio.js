import {
    capitalize,
    lastIndex,
    bindOverlay,
    formatPrice,
    formatStock,
    setElementValueTemporarily,
    removeAccentuation,
    createFunctionResponse,
    createRootPath,
} from "./utils.js";

import { fallBackProductIcon, offStockIcon } from "./global.js";

const modal = document.querySelector("#ver-mais-menu");
const modalDescriptionProductDiv = document.querySelector(".ver-mais-body");

class Cardapio {
    /* Estrutura do cardápio:
    {
        "salgados": {
            name: "Salgados",
            items: [
                [
                    {
                        id: "coxinha",
                        name: "Coxinha",
                        description: "Coxinha crocante de frango.",
                        price: 5.50,
                        icon: "./img/coxinha.jpg",
                        stock: 10,
                        div: <div class="card verde">...</div>
                    },
                    {
                        id: "pastel-de-queijo",
                        name: "Pastel de Queijo",
                        description: "Pastel recheado com queijo derretido.",
                        price: 4.00,
                        icon: "./img/pastel-queijo.jpg",
                        stock: 12,
                        div: <div class="card verde">...</div>
                    },
                    {
                        id: "pao-de-queijo",
                        name: "Pão de Queijo",
                        description: "Pão de queijo quentinho e macio.",
                        price: 3.50,
                        icon: "./img/pao-de-queijo.jpg",
                        stock: 8,
                        div: <div class="card verde">...</div>
                    },
                    {
                        id: "enroladinho-de-salsicha",
                        name: "Enroladinho de Salsicha",
                        description: "Massa leve com salsicha e molho especial.",
                        price: 4.50,
                        icon: "./img/enroladinho-de-salsicha.jpg",
                        stock: 0,
                        div: <div class="card vermelho">...</div>
                    }
                ],
                [
                    {
                        id: "empada-de-frango",
                        name: "Empada de Frango",
                        description: "Empada artesanal recheada com frango e catupiry.",
                        price: 6.00,
                        icon: "./img/empada-frango.jpg",
                        stock: 6,
                        div: <div class="card verde">...</div>
                    }
                ]
            ]
        }
    }
    */
    #fallbackIcon = fallBackProductIcon;
    #offStockIcon = offStockIcon;
    #elementPerRow = 4;
    #itemsIds = {};

    constructor() {
        this.cardapioSection = document.querySelector("#cardapio");
        this.cardapio = {};
    }

    #createSectionTitle(title, capitalized = true) {
        const div = document.createElement("div");
        div.classList.add("titulo-section");
        div.insertAdjacentHTML(
            "beforeend",
            `
            <h1>${capitalized ? capitalize(title) : title}</h1>
            <hr>
        `
        );
        return div;
    }

    renderCardapio(clearOldCardapio = true) {
        if (clearOldCardapio) this.cardapioSection.innerHTML = "";
        const modalCloseBtn = modal.querySelector("#btn-add-product");
        const modalHead = document.querySelector(".ver-mais-head");
        for (const key in this.cardapio) {
            // Itera em cada categoria
            const value = this.cardapio[key];
            const categorySection = document.createElement("section");
            categorySection.id = key;
            categorySection.appendChild(this.#createSectionTitle(value.name));
            const produtosSection = document.createElement("section");
            produtosSection.classList.add("produtos");
            value.items.forEach((row) => {
                const rowDiv = document.createElement("div");
                rowDiv.classList.add("linha");
                row.forEach((item) => {
                    const itemDiv = item.div; // Div do item
                    // Adiciona ação ao clicar no botão "VER MAIS"
                    bindOverlay(
                        modal,
                        itemDiv.querySelector(".btn-ver-mais"),
                        modalCloseBtn,
                        (isOpened) => {
                            if (!isOpened) {
                                modalDescriptionProductDiv.scrollTop = 0;
                                return;
                            }
                            if (item.stock === 0) {
                                modalHead.classList.remove("active");
                                modalCloseBtn.classList.remove("active");
                                modalCloseBtn.textContent = "INDISPONÍVEL";
                            } else {
                                modalHead.classList.add("active");
                                modalCloseBtn.classList.add("active");
                                modalCloseBtn.textContent = "ADICIONAR";
                            }
                            document.querySelector(
                                "#product-name"
                            ).textContent = item.name;
                            document.querySelector(
                                "#product-icon"
                            ).src = item.icon;
                            document.querySelector(
                                "#product-stock"
                            ).textContent = formatStock(item.stock);
                            document.querySelector(
                                "#product-description"
                            ).textContent = item.description;
                            document.querySelector(
                                "#product-price"
                            ).textContent = formatPrice(item.price);
                        }
                    );
                    rowDiv.appendChild(itemDiv);
                });
                produtosSection.appendChild(rowDiv); // Colocar uma linha em produtos
            });
            categorySection.appendChild(produtosSection);
            this.cardapioSection.appendChild(categorySection);
        }
    }

    #createCategorySection(category, items = null) {
        return {
            name: category,
            items: items ? items : [],
        };
    }

    #createItemDiv(item) {
        const itemDiv = document.createElement("div");
        itemDiv.id = item.id;
        itemDiv.classList.add("card");
        itemDiv.classList.add(item.stock > 0 ? "verde" : "vermelho");
        itemDiv.insertAdjacentHTML(
            "beforeend",
            `
            <span class="icone">${
                item.stock > 0 ? "+" : `<img src="${this.#offStockIcon}">`
            }</span>
            <img class="product-image" src="${item.icon}" alt="${item.name}">
            <div class="card-title"><h3>${item.name}</h3></div>
            <button class="btn-ver-mais">VER MAIS</button>
        `
        );
        if (item.stock > 0) {
            itemDiv.querySelector(".icone").addEventListener("click", (e) => {
                setElementValueTemporarily(e.target, "✓");
            });
        }
        return itemDiv;
    }

    #createItem(name, description, price, icon, stock = 0) {
        const item = {
            id: removeAccentuation(name.replaceAll(" ", "-").toLowerCase()),
            name,
            description,
            price,
            icon,
            stock,
        };
        item.div = this.#createItemDiv(item);
        return item;
    }

    #hasCategory(category) {
        return this.cardapio.hasOwnProperty(category);
    }

    #hasItem(itemId) {
        return Object.hasOwn(this.#itemsIds, itemId);
    }

    #addItemInCategory(category, item) {
        const items = this.cardapio[category]["items"];
        items[lastIndex(items)].push(item);
    }

    #canAddInRow(category) {
        const arrItems = this.cardapio[category]["items"];
        if (arrItems.length === 0) return false;
        return arrItems[lastIndex(arrItems)].length < this.#elementPerRow;
    }

    #addNewRow(category, item = null) {
        const row = item ? [item] : [];
        this.cardapio[category]["items"].push(row);
    }

    addItem(
        name,
        category,
        description,
        price,
        stock = 0,
        icon = this.#fallbackIcon
    ) {
        const catKey = category.toLowerCase();
        const item = this.#createItem(
            name,
            description,
            Math.max(price, 0),
            icon,
            Math.max(stock, 0)
        );
        if (this.#hasItem(item.id)) {
            return createFunctionResponse(-14);
        }
        this.#itemsIds[item.id] = item;
        this.#itemsIds[item.id].category = catKey;
        if (!this.#hasCategory(catKey)) {
            const categorySection = this.#createCategorySection(
                capitalize(category)
            );
            this.cardapio[catKey] = categorySection;
        }

        if (this.#canAddInRow(catKey)) {
            this.#addItemInCategory(catKey, item);
        } else {
            this.#addNewRow(catKey, item);
        }
        return createFunctionResponse(0);
    }

    getItem(itemId) {
        return this.#itemsIds[itemId];
    }

    getAllItems() {
        const items = [];
        for (const category in this.cardapio) {
            const rows = this.cardapio[category]["items"];
            rows.forEach((row) => {
                row.forEach((item) => items.push(item));
            });
        }
        return items;
    }

    getRow(category, rowIndex) {
        return this.cardapio[category.toLowerCase()]["items"][rowIndex];
    }

    clear() {
        this.cardapio = {};
    }

    clearCategory(category) {
        const catKey = category.toLowerCase();
        if (!this.#hasCategory(catKey)) return;
        this.cardapio[catKey]["items"] = [];
    }

    removeItemFromRow(category, rowIndex = -1, item) {
        const catKey = category.toLowerCase();
        if (!this.#hasCategory(catKey)) return;
        const row = this.getRow(
            catKey,
            rowIndex === -1
                ? this.cardapio[catKey]["items"].length - 1
                : rowIndex
        );
        const index = row.indexOf(item);
        if (index !== -1) row.splice(index, 1);
    }

    removeItemFromAll(item) {
        for (const catKey of Object.keys(this.cardapio)) {
            this.cardapio[catKey]["items"].forEach((row) => {
                const index = row.indexOf(item);
                if (index !== -1) row.splice(index, 1);
            });
        }
    }

    removeItemFromCategory(category, item) {
        const catKey = category.toLowerCase();
        if (!this.#hasCategory(catKey)) return;
        this.cardapio[catKey]["items"].forEach((row) => {
            const index = row.indexOf(item);
            if (index !== -1) row.splice(index, 1);
        });
    }

    clearRow(category, rowIndex = -1) {
        const catKey = category.toLowerCase();
        if (!this.#hasCategory(catKey)) return;
        const idx =
            rowIndex === -1
                ? lastIndex(this.cardapio[catKey]["items"])
                : rowIndex;
        this.cardapio[catKey]["items"][idx] = [];
    }

    showItem(itemId) {
        if (!this.#hasItem(itemId)) {
            return;
        }
        const item = this.getItem(itemId);
        for (const key in item) {
            console.log(`${key}: ${item[key]}`);
        }
    }

    showCategories() {
        for (const catKey of Object.keys(this.cardapio)) {
            const category = this.cardapio[catKey];
            console.log(category.name);
            category.items.forEach((row) => console.log("\t", row));
        }
    }
}

// export default Cardapio;
export const cardapio = new Cardapio();

//! Salgados

cardapio.addItem(
    "Croassaint de Presunto e Queijo",
    "salgados",
    "Croassaint assado recheado com presunto e queijo.",
    7,
    6,
    createRootPath("img", "croassaint de presunto e queijo.jpeg")
);

cardapio.addItem(
    "Esfiha de Carne",
    "salgados",
    "Esfiha assada recheada com carne temperada.",
    7,
    3,
    createRootPath("img", "efiha de carne.jpeg")
);

cardapio.addItem(
    "Esfiha de Frango",
    "salgados",
    "Esfiha assada recheada com frango temperado.",
    7,
    8,
    createRootPath("img", "efiha de frango.jpeg")
);

cardapio.addItem(
    "Enrolado de Calabresa com Catupiry",
    "salgados",
    "Massa assada recheada com calabresa e catupiry.",
    7,
    2,
    createRootPath("img", "enrrolado de calabresa com catupiry.jpeg")
);

cardapio.addItem(
    "Enrolado de Frango com Catupiry",
    "salgados",
    "Massa assada recheada com frango e catupiry.",
    7,
    10,
    createRootPath("img", "enrrolado de frango com catupiry.jpeg")
);

cardapio.addItem(
    "Enrolado de Presunto e Queijo",
    "salgados",
    "Massa assada recheada com presunto e queijo.",
    7,
    4,
    createRootPath("img", "enrrolado de presunto e queijo.jpeg")
);

cardapio.addItem(
    "Pão de Batata Calabresa e Cheddar",
    "salgados",
    "Pão de batata assado com calabresa e cheddar.",
    7,
    1,
    createRootPath("img", "pao de batata calabresa e cheedar.jpeg")
);

cardapio.addItem(
    "Pão de Batata com Requeijão",
    "salgados",
    "Pão de batata assado recheado com requeijão.",
    7,
    9,
    createRootPath("img", "pao de batata com requeijao.jpeg")
);

cardapio.addItem(
    "Pão de Queijo",
    "salgados",
    "Pão de queijo tradicional assado.",
    7,
    5,
    createRootPath("img", "pao de queijo.jpeg")
);


//! Petiscos

cardapio.addItem(
    "Batata Ondulada Lobits",
    "petiscos",
    "Batata ondulada crocante, produzida pela Milho de Ouro sob a marca Lobits.",
    4.5,
    15,
    createRootPath("img", "batata-ondulada.jpg")
);

cardapio.addItem(
    "Lobits Queijo",
    "petiscos",
    "Salgadinho de milho sabor queijo, assado, sequinho e crocante.",
    3.7,
    12,
    createRootPath("img", "lobits-azul.jpg")
);

cardapio.addItem(
    "Lobits Requeijão",
    "petiscos",
    "Salgadinho de milho sabor requeijão, assado e cremoso no tempero.",
    4.9,
    10,
    createRootPath("img", "lobits-roxo.jpg")
);

cardapio.addItem(
    "Lobits Presunto",
    "petiscos",
    "Salgadinho de milho sabor presunto, assado e com tempero equilibrado.",
    3.7,
    8,
    createRootPath("img", "lobits-verde.jpg")
);

cardapio.addItem(
    "Torcida Queijo",
    "petiscos",
    "Salgadinho de batata sabor queijo, da linha Torcida (PepsiCo).",
    4.2,
    14,
    createRootPath("img", "torcida-amarelo.jpg")
);

cardapio.addItem(
    "Torcida Cebola",
    "petiscos",
    "Salgadinho de batata sabor cebola, da linha Torcida (PepsiCo).",
    4.2,
    11,
    createRootPath("img", "torcida-roxo.jpg")
);

cardapio.addItem(
    "Torcida Churrasco",
    "petiscos",
    "Salgadinho de batata sabor churrasco, da linha Torcida (PepsiCo).",
    4.2,
    13,
    createRootPath("img", "torcida-verde.jpg")
);

///////////////////////////////////////////////////////////////
// DOCES
///////////////////////////////////////////////////////////////

cardapio.addItem(
    "Bis Xtra",
    "doces",
    "Unidade de Bis Xtra, waffer coberto com chocolate ao leite extra crocante.",
    1.0,
    12,
    createRootPath("img", "bis-xtra.jpg")
);

cardapio.addItem(
    "Bombom Dourado",
    "doces",
    "Bombom tipo Sonho de Valsa, recheio cremoso com cobertura de chocolate.",
    1.5,
    14,
    createRootPath("img", "bombom-dourado.jpg")
);

cardapio.addItem(
    "Bombom Rosa",
    "doces",
    "Bombom tipo Ouro Branco, recheio cremoso com cobertura branca.",
    1.5,
    14,
    createRootPath("img", "bombom-rosa.jpg")
);

cardapio.addItem(
    "Chokito",
    "doces",
    "Chocolate Chokito 32g, leite condensado caramelizado com flocos crocantes.",
    4.5,
    12,
    createRootPath("img", "chokito.jpg")
);

cardapio.addItem(
    "Diamante Negro",
    "doces",
    "Barra individual de Diamante Negro (Lacta), chocolate intenso e crocante.",
    4.0,
    11,
    createRootPath("img", "diamante-negro.jpg")
);

cardapio.addItem(
    "Fruit-Tella",
    "doces",
    "Bala macia Fruit-Tella com sabores variados de frutas.",
    0.5,
    20,
    createRootPath("img", "fruit-tella.jpg")
);

cardapio.addItem(
    "Halls Mentol",
    "doces",
    "Bala Halls sabor mentol, refrescância forte.",
    0.5,
    20,
    createRootPath("img", "halls-mentol.jpg")
);

cardapio.addItem(
    "Halls Morango",
    "doces",
    "Bala Halls sabor morango, doce e refrescante.",
    0.5,
    20,
    createRootPath("img", "halls-morango.jpg")
);

cardapio.addItem(
    "Jujuba",
    "doces",
    "Jujuba unitária, sabor sortido de frutas.",
    0.25,
    20,
    createRootPath("img", "jujuba.jpg")
);

cardapio.addItem(
    "Mentos",
    "doces",
    "Pastilha Mentos, sabor variado e textura macia.",
    0.5,
    18,
    createRootPath("img", "mentos.jpg")
);

cardapio.addItem(
    "Paçoca Amor",
    "doces",
    "Paçoca Amor tradicional feita com amendoim.",
    1.0,
    20,
    createRootPath("img", "pacoca-amor.jpg")
);

cardapio.addItem(
    "Prestígio",
    "doces",
    "Chocolate Prestígio pequeno, recheado com coco.",
    2.0,
    15,
    createRootPath("img", "prestigio.jpg")
);

cardapio.addItem(
    "Tortuguita",
    "doces",
    "Chocolate Tortuguita ao leite, formato de tartaruga.",
    2.0,
    18,
    createRootPath("img", "tortuguita.jpg")
);

cardapio.addItem(
    "Trident Menta",
    "doces",
    "Chiclete Trident sabor menta, refrescante.",
    0.5,
    15,
    createRootPath("img", "trident-menta.jpg")
);

cardapio.addItem(
    "Trident Morango",
    "doces",
    "Chiclete Trident sabor morango, doce e frutado.",
    0.5,
    15,
    createRootPath("img", "trident-morango.jpg")
);

cardapio.addItem(
    "Trident Tutti-Frutti",
    "doces",
    "Chiclete Trident sabor tutti-frutti, frutas misturadas.",
    0.5,
    15,
    createRootPath("img", "trident-tutti-frutti.jpg")
);

///////////////////////////////////////////////////////////////
// BEBIDAS
///////////////////////////////////////////////////////////////

cardapio.addItem(
    "Água sem gás 500 ml",
    "bebidas",
    "Água mineral sem gás, garrafa individual",
    3.0,
    12,
    createRootPath("img", "agua-sem-gas.jpg")
);

cardapio.addItem(
    "Chá Ice Tea Pêssego 300 ml",
    "bebidas",
    "Chá gelado sabor pêssego",
    4.5,
    10,
    createRootPath("img", "cha-ice-tea.jpg")
);

cardapio.addItem(
    "Chá de Lichia 300 ml",
    "bebidas",
    "Chá gelado sabor lichia",
    5.0,
    0,
    createRootPath("img", "cha-lichia.jpg")
);

cardapio.addItem(
    "Chá Mate Original 300 ml",
    "bebidas",
    "Chá mate tradicional gelado",
    4.5,
    7,
    createRootPath("img", "cha-mate-original.jpg")
);

cardapio.addItem(
    "Coca-Cola 2 L",
    "bebidas",
    "Refrigerante Coca-Cola garrafa grande",
    10.0,
    11,
    createRootPath("img", "cocacola-2l.jpg")
);

cardapio.addItem(
    "Coca-Cola 350 ml",
    "bebidas",
    "Refrigerante Coca-Cola lata",
    4.5,
    14,
    createRootPath("img", "cocacola-350ml.jpg")
);

cardapio.addItem(
    "Coca-Cola Café 250 ml",
    "bebidas",
    "Coca-Cola com café, lata pequena",
    5.5,
    0,
    createRootPath("img", "cocacola-cafe.jpg")
);

cardapio.addItem(
    "Coca-Cola Garrafinha 600 ml",
    "bebidas",
    "Coca-Cola PET individual",
    6.0,
    15,
    createRootPath("img", "cocacola-garrafinha.jpg")
);

cardapio.addItem(
    "Coca-Cola Mini 200 ml",
    "bebidas",
    "Refrigerante Coca-Cola mini-lata",
    3.5,
    5,
    createRootPath("img", "cocacola-mini.jpg")
);

cardapio.addItem(
    "Coca-Cola Zero 2 L",
    "bebidas",
    "Versão zero açúcar, garrafa grande",
    10.0,
    13,
    createRootPath("img", "cocacola-zero-2l.jpg")
);

cardapio.addItem(
    "Coca-Cola Zero Garrafinha 600 ml",
    "bebidas",
    "Coca-Cola Zero PET",
    6.0,
    12,
    createRootPath("img", "cocacola-zero-garrafinha.jpg")
);

cardapio.addItem(
    "Coca-Cola Zero 350 ml",
    "bebidas",
    "Coca-Cola Zero lata",
    4.5,
    16,
    createRootPath("img", "cocacola-zero-menor.jpg")
);

cardapio.addItem(
    "Coca-Cola Zero Mini 200 ml",
    "bebidas",
    "Coca-Cola Zero mini-lata",
    3.5,
    7,
    createRootPath("img", "cocacola-zero-mini.jpg")
);

cardapio.addItem(
    "Del Valle Maracujá 290 ml",
    "bebidas",
    "Suco Del Valle sabor maracujá lata",
    5.5,
    8,
    createRootPath("img", "del-vale-maracuja-lata.jpg")
);

cardapio.addItem(
    "Del Valle Goiaba 290 ml",
    "bebidas",
    "Suco Del Valle sabor goiaba lata",
    5.5,
    6,
    createRootPath("img", "del-valle-goiaba-lata.jpg")
);

cardapio.addItem(
    "Del Valle Laranja 1 L",
    "bebidas",
    "Suco Del Valle sabor laranja",
    7.0,
    10,
    createRootPath("img", "del-valle-laranja.jpg")
);

cardapio.addItem(
    "Del Valle Lata 290 ml",
    "bebidas",
    "Suco Del Valle diversos sabores lata",
    5.5,
    9,
    createRootPath("img", "del-valle-lata.jpg")
);

cardapio.addItem(
    "Del Valle Manga 1 L",
    "bebidas",
    "Suco Del Valle sabor manga",
    7.0,
    11,
    createRootPath("img", "del-valle-manga.jpg")
);

cardapio.addItem(
    "Del Valle Uva 1 L",
    "bebidas",
    "Suco Del Valle sabor uva",
    7.0,
    8,
    createRootPath("img", "del-valle-uva-maior.jpg")
);

cardapio.addItem(
    "Fanta Guaraná 350 ml",
    "bebidas",
    "Refrigerante Fanta Guaraná lata",
    4.5,
    14,
    createRootPath("img", "fanta-guarana.jpg")
);

cardapio.addItem(
    "Fanta Laranja 350 ml",
    "bebidas",
    "Fanta Laranja lata",
    4.5,
    13,
    createRootPath("img", "fanta-laranja-lata.jpg")
);

cardapio.addItem(
    "Fanta Mini 200 ml",
    "bebidas",
    "Fanta mini-lata",
    3.5,
    6,
    createRootPath("img", "fanta-mini.jpg")
);

cardapio.addItem(
    "Fanta Uva 2 L",
    "bebidas",
    "Refrigerante Fanta Uva garrafa grande",
    10.0,
    10,
    createRootPath("img", "fanta-uva-2-litros-1.jpg")
);

cardapio.addItem(
    "Fanta Uva 350 ml",
    "bebidas",
    "Fanta Uva lata",
    4.5,
    15,
    createRootPath("img", "fanta-uva-lata.jpg")
);

cardapio.addItem(
    "Fanta Uva Mini 200 ml",
    "bebidas",
    "Fanta Uva mini-lata",
    3.5,
    7,
    createRootPath("img", "fanta-uva-mini.jpg")
);

cardapio.addItem(
    "Guaraná 350 ml",
    "bebidas",
    "Guaraná Antarctica lata",
    4.5,
    12,
    createRootPath("img", "guarana-lata.jpg")
);

cardapio.addItem(
    "Guaraná Zero 350 ml",
    "bebidas",
    "Guaraná Antarctica Zero lata",
    4.5,
    10,
    createRootPath("img", "guarana-zero-350ml.jpg")
);

cardapio.addItem(
    "Kapo Maracujá 200 ml",
    "bebidas",
    "Suco Kapo sabor maracujá",
    2.5,
    9,
    createRootPath("img", "kapo-maracuja.jpg")
);

cardapio.addItem(
    "Kapo Morango 200 ml",
    "bebidas",
    "Suco Kapo sabor morango",
    2.5,
    11,
    createRootPath("img", "kapo-morango.jpg")
);

cardapio.addItem(
    "Kapo Uva 200 ml",
    "bebidas",
    "Suco Kapo sabor uva",
    2.5,
    10,
    createRootPath("img", "kapo-uva.jpg")
);

cardapio.addItem(
    "Pirakids 200 ml",
    "bebidas",
    "Bebida láctea Pirakids diversos sabores",
    3.0,
    8,
    createRootPath("img", "pirakids.jpg")
);

cardapio.addItem(
    "Schweppes Citrus 350 ml",
    "bebidas",
    "Schweppes Citrus lata",
    5.0,
    7,
    createRootPath("img", "schweppers-lata.jpg")
);

cardapio.addItem(
    "Schweppes Tônica Zero 350 ml",
    "bebidas",
    "Água tônica zero açúcar",
    5.0,
    6,
    createRootPath("img", "schweppers-tonico-zero.jpg")
);

cardapio.addItem(
    "Sprite 350 ml",
    "bebidas",
    "Sprite lata",
    4.5,
    14,
    createRootPath("img", "sprite 350ml.jpg")
);


cardapio.addItem(
    "Sprite 2 L",
    "bebidas",
    "Sprite garrafa grande",
    10.0,
    10,
    createRootPath("img", "sprite-2l.jpg")
);

cardapio.addItem(
    "Sprite Fresh 500 ml",
    "bebidas",
    "Sprite Fresh PET",
    5.5,
    9,
    createRootPath("img", "sprite-fresh.jpg")
);

cardapio.addItem(
    "Sprite Garrafa 600 ml",
    "bebidas",
    "Sprite PET individual",
    6.0,
    12,
    createRootPath("img", "sprite-garrafa.jpg")
);

cardapio.addItem(
    "Sprite Zero 2 L",
    "bebidas",
    "Sprite Zero garrafa grande",
    10.0,
    11,
    createRootPath("img", "sprite-zero-2l.jpg")
);


cardapio.renderCardapio();
