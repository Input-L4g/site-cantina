import {
    capitalize,
    lastIndex,
    bindOverlay,
    formatPrice,
    formatStock,
    setElementValueTemporarily,
    removeAccentuation
} from "./utils.js";

import {
    fallBackProductIcon,
    offStockIcon
} from "./global.js";

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
        div.insertAdjacentHTML("beforeend", `
            <h1>${capitalized? capitalize(title) : title}</h1>
            <hr>
        `);
        return div;
    }

    renderCardapio(clearOldCardapio = true) {
        this.cardapioSection.innerHTML = "";
        const modalCloseBtn = modal.querySelector("#btn-add-product");
        const modalHead = document.querySelector(".ver-mais-head");
        for (const key in this.cardapio) { // Itera em cada categoria
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
                    const itemDiv = item.div // Div do item
                    // Adiciona ação ao clicar no botão "VER MAIS"
                    bindOverlay(modal, itemDiv.querySelector(".btn-ver-mais"), modalCloseBtn, (isOpened) => {
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
                        document.querySelector("#product-name").textContent = item.name;
                        document.querySelector("#product-icon").textContent = item.icon;
                        document.querySelector("#product-stock").textContent = formatStock(item.stock);
                        document.querySelector("#product-description").textContent = item.description;
                        document.querySelector("#product-price").textContent = formatPrice(item.price);
                    });
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
            items: items ? items : []
        };
    }

    #createItemDiv(item) {
        const itemDiv = document.createElement("div");
        itemDiv.id = item.id;
        itemDiv.classList.add("card");
        itemDiv.classList.add(item.stock > 0 ? "verde" : "vermelho");
        itemDiv.insertAdjacentHTML("beforeend", `
            <span class="icone">${item.stock > 0 ? '+' : `<img src="${this.#offStockIcon}">`}</span>
            <img src="${item.icon || this.#fallbackIcon}" alt="${item.name}">
            <div class="card-title"><h3>${item.name}</h3></div>
            <button class="btn-ver-mais">VER MAIS</button>
        `);
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
            stock
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

    addItem(name, category, description, price, stock = 0, icon = this.#fallbackIcon) {
        const catKey = category.toLowerCase();
        const item = this.#createItem(name, description, Math.max(price, 0), icon, Math.max(stock, 0));
        if (this.#hasItem(item.id)) {
            console.log("O produto já existe!!");
            return false;
        }
        this.#itemsIds[item.id] = item;
        this.#itemsIds[item.id].category = catKey
        if (!this.#hasCategory(catKey)) {
            const categorySection = this.#createCategorySection(capitalize(category));
            this.cardapio[catKey] = categorySection;
        }

        if (this.#canAddInRow(catKey)) {
            this.#addItemInCategory(catKey, item);
        } else {
            this.#addNewRow(catKey, item);
        }
        return true;
    }

    getItem(itemId) {
        return this.#itemsIds[itemId];
    }

    getAllItems() {
        const items = [];
        for (const category in this.cardapio) {
            const rows = this.cardapio[category]["items"];
            rows.forEach((row) => {
                row.forEach(item => items.push(item));
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
            rowIndex === -1 ? this.cardapio[catKey]["items"].length - 1 : rowIndex);
        const index = row.indexOf(item);
        if (index !== -1) row.splice(index, 1);
    }

    removeItemFromAll(item) {
        for (const catKey of Object.keys(this.cardapio)) {
            this.cardapio[catKey]["items"].forEach(row => {
                const index = row.indexOf(item);
                if (index !== -1) row.splice(index, 1);
            });
        }
    }

    removeItemFromCategory(category, item) {
        const catKey = category.toLowerCase();
        if (!this.#hasCategory(catKey)) return;
        this.cardapio[catKey]["items"].forEach(row => {
            const index = row.indexOf(item);
            if (index !== -1) row.splice(index, 1);
        });
    }

    clearRow(category, rowIndex = -1) {
        const catKey = category.toLowerCase();
        if (!this.#hasCategory(catKey)) return;
        const idx = rowIndex === -1 ? lastIndex(this.cardapio[catKey]["items"]) : rowIndex;
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
            category.items.forEach(row => console.log("\t", row));
        }
    }
}

// export default Cardapio;
const cardapio = new Cardapio();

// Salgados

cardapio.addItem(
    "Coxinha de Frango",
    "salgados",
    "Coxinha crocante com recheio de frango desfiado, " +
    "temperado com ervas e especiarias. A massa dourada " +
    "envolve um recheio cremoso e bem equilibrado, " +
    "criando uma combinação clássica e muito saborosa.",
    5.50,
    1
);
cardapio.addItem(
    "Kibe",
    "salgados",
    "Kibe frito recheado com carne temperada, preparado com trigo hidratado, " +
    "hortelã e especiarias tradicionais. A casquinha crocante contrasta com o " +
    "interior macio e suculento, trazendo um sabor típico do Oriente Médio.",
    4.50
);
cardapio.addItem(
    "Risoles de Presunto e Queijo",
    "salgados",
    "Risoles crocante recheado com presunto e queijo derretido, envolvido por uma massa fina " +
    "e dourada. O recheio cremoso e salgado se destaca pelo equilíbrio entre o sabor suave do " +
    "queijo e o toque levemente defumado do presunto.",
    4.00
);
cardapio.addItem(
    "Empada de Frango",
    "salgados",
    "Empada assada com recheio de frango temperado, cremosa por dentro e envolvida por uma massa " +
    "amanteigada que desmancha ao morder. O sabor é intenso e bem distribuído, proporcionando uma " +
    "experiência tradicional de empada caseira.",
    5.00,
    8
);
cardapio.addItem(
    "Enroladinho de Salsicha",
    "salgados",
    "Massa folhada recheada com salsicha, assada até dourar, resultando em camadas leves e crocantes. " +
    "A salsicha aquecida libera seu aroma característico, " +
    "criando um lanche simples, clássico e muito prático.",
    3.50
);
cardapio.addItem(
    "Pastel de Carne",
    "salgados",
    "Pastel crocante recheado com carne moída temperada," +
    "preparada com cebola, alho e temperos selecionados. " +
    "A massa fina realça o sabor do recheio suculento, trazendo o tradicional gosto de pastelaria.",
    4.50
);
cardapio.addItem(
    "Esfiha de Queijo",
    "salgados",
    "Esfiha assada com recheio de queijo cremoso, equilibrado com " +
    "temperos suaves que ressaltam o sabor do queijo. " +
    "A massa macia e levemente dourada completa a experiência.",
    5.00
);
cardapio.addItem(
    "Bolinha de Queijo",
    "salgados",
    "Bolinha frita recheada com queijo derretido, envolvida por uma " +
    "casquinha crocante que contrasta com o interior " +
    "elástico e cremoso. Um clássico irresistível para quem gosta de queijo.",
    4.00,
    4
);
// DOCES
cardapio.addItem(
    "Bombom",
    "doces",
    "Uma bola de chocolate quente, com textura cremosa e sabor intenso. " +
    "O interior derrete levemente ao ser mordido, " +
    "liberando um aroma marcante de cacau e proporcionando uma doçura equilibrada.",
    4.00,
    4
);
cardapio.addItem(
    "Brigadeiro",
    "doces",
    "Doce tradicional feito com chocolate cremoso e textura macia, enrolado " +
    "em pequenas porções e coberto com granulados que trazem o contraste " +
    "perfeito entre suavidade e crocância.",
    3.00,
    12
);
cardapio.addItem(
    "Quindim",
    "doces",
    "Sobremesa clássica de origem brasileira, preparada com gema, açúcar e " +
    "coco ralado, resultando em uma textura brilhante, macia e extremamente " +
    "saborosa, com aroma característico.",
    4.50,
    6
);
cardapio.addItem(
    "Pudim de Leite",
    "doces",
    "Pudim cremoso feito com leite condensado, leite e ovos, " +
    "coberto por uma calda de caramelo suave e brilhante. " +
    "A textura lisa e delicada proporciona um sabor marcante e equilibrado.",
    5.00,
    5
);

cardapio.renderCardapio();