import {} from "./aside-menu.js";
import {} from "./cardapio.js";
import {} from "./ver-mais-menu.js";
import { toPage, getLocalStorage, bindOverlay } from "./utils.js";
import { userHasLogged, userHasLeft } from "./pages/homePage.js";
import { userHasLeftEvent, userHasLoggedEvent, hasLoggedStorageName } from "./global.js";
import { clearUsersTable, showUsers } from "./userCrud.js"

document.addEventListener("userHasLeftEvent", userHasLeft);
document.addEventListener("userHasLoggedEvent", userHasLogged);

if (getLocalStorage(hasLoggedStorageName))
    window.clearUsersTable = clearUsersTable;
window.showUsers = showUsers;

const btnLogin = document.querySelector("#btn-login");
const btnCadastro = document.querySelector("#btn-cadastro");
const btnLogOut = document.querySelector("#btn-logout");
const pagamentoBoxs = document.querySelectorAll(".sobre-formas-pagamento div p");
const btnCardapio = document.querySelector("#btn-cardapio");
const btnMeusPedidos = document.querySelector("#btn-meus-pedidos");
const  btnPerfil = document.querySelector("#btn-perfil");
const  btnMais= document.querySelector("#btn-mais");

pagamentoBoxs.forEach((e) => {
    e.addEventListener("mouseenter", (e) => { 
        e.target.querySelectorAll("p img").forEach((icon) => {
            icon.classList.add("active");
        });
    });
    e.addEventListener("mouseleave", (e) => {
        e.target.querySelectorAll("p img").forEach((icon) => {
            icon.classList.remove("active");
        });
    });
});

btnLogin.addEventListener("click", () => {
    toPage(".", "pages", "login", "login.html");
});
btnCadastro.addEventListener("click", () => {
    toPage(".", "pages", "cadastro", "cadastro.html");
});

btnCardapio.addEventListener("click", () => {
    toPage();
});

btnMeusPedidos.addEventListener("click", () => {
    toPage(".", "pages", "meus-pedidos", "meus-pedidos.html");
});
btnPerfil.addEventListener("click", () => {
    toPage(".", "pages", "perfil", "perfil.html");
});
btnMais.addEventListener("click", () => {
    toPage(".", "pages", "editar-cardapio", "adicionar-item.html");
});


btnLogOut.addEventListener("click", userHasLeft);

// Não deixa pegar as imagens
document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("contextmenu", e => e.preventDefault());
        img.addEventListener("dragstart", function (e) {
        e.preventDefault();
    });
});

    // --- Speed Dial ---
    const main = document.getElementById("fab-main");
    const options = document.getElementById("fab-options");

    main.addEventListener("click", () => {
        options.classList.toggle("open");
    });

    // --- Variáveis dos Modais ---
    const btnEdit = document.getElementById('btn-edit');
    const btnLixeira = document.getElementById('btn-lixeira');

    const overlayEdit = document.getElementById('overlayCheckboxEdit');
    const fecharEdit = overlayEdit.querySelector('.fechar-edit');

    const overlayDelete = document.getElementById('overlayCheckboxDelete');
    const fecharDelete = overlayDelete.querySelector('.fechar-delete');

    document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Variáveis de Elementos (DOM)
    // ----------------------------------------------------
    const fabMain = document.getElementById('fab-main');
    const fabOptions = document.getElementById('fab-options');
    const btnLixeira = document.getElementById('btn-lixeira');
    const btnEdit = document.getElementById('btn-edit');

    const overlayDelete = document.getElementById('overlayCheckboxDelete');
    const fecharDelete = document.querySelector('.fechar-delete');
    const btnConfirmarDelete = document.querySelector('.btn-confirmar-delete');

    const overlayEdit = document.getElementById('overlayCheckboxEdit');
    const fecharEdit = document.querySelector('.fechar-edit');
    const formEdit = document.querySelector('.form-edit');


    // ----------------------------------------------------
    // 2. Funções Modulares para Modais
    // ----------------------------------------------------

    /**
     * Abre um modal específico.
     * @param {HTMLElement} modalElement O elemento overlay do modal.
     */
    function openModal(modalElement) {
        if (modalElement) {
            modalElement.classList.add('ativo');
            // Fechar o Speed Dial ao abrir um modal
            fabOptions.classList.remove('visible');
        }
    }

    /**
     * Fecha um modal específico.
     * @param {HTMLElement} modalElement O elemento overlay do modal.
     */
    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('ativo');
        }
    }

    /**
     * Adiciona ouvintes de eventos para fechar o modal.
     * @param {HTMLElement} overlayElement O elemento overlay do modal.
     * @param {HTMLElement} fecharButton O botão de fechar (x) do modal.
     */
    function setupModal(overlayElement, fecharButton) {
        if (!overlayElement) return;

        // Fecha ao clicar no 'x'
        if (fecharButton) {
            fecharButton.addEventListener('click', () => closeModal(overlayElement));
        }

        // Fecha ao clicar fora do conteúdo do modal (no overlay)
        overlayElement.addEventListener('click', (event) => {
            // Verifica se o clique foi diretamente no overlay (e não em um filho do modal-conteudo)
            if (event.target === overlayElement) {
                closeModal(overlayElement);
            }
        });

        // Fecha ao pressionar ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && overlayElement.classList.contains('ativo')) {
                closeModal(overlayElement);
            }
        });
    }


    // ----------------------------------------------------
    // 3. Lógica do Speed Dial
    // ----------------------------------------------------

    /**
     * Alterna a visibilidade das opções do Speed Dial.
     */
    fabMain.addEventListener('click', () => {
        fabOptions.classList.toggle('visible');
    });

    // ----------------------------------------------------
    // 4. Configuração e Ações dos Modais
    // ----------------------------------------------------

    // --- Modal de Deletar (Lixeira) ---

    // Abre o modal de deletar
    btnLixeira.addEventListener('click', () => {
        openModal(overlayDelete);
    });

    // Configura o fechamento do modal de deletar
    setupModal(overlayDelete, fecharDelete);

    // Lógica de Confirmação de Exclusão (Exemplo)
    btnConfirmarDelete.addEventListener('click', () => {
        const checkboxes = overlayDelete.querySelectorAll('input[type="checkbox"]:checked');
        const itensParaDeletar = Array.from(checkboxes).map(cb => cb.value);

        if (itensParaDeletar.length > 0) {
            console.log("Itens selecionados para exclusão:", itensParaDeletar);
            alert(`Confirmada a exclusão de ${itensParaDeletar.length} item(ns).`);
            // Lógica real de exclusão viria aqui (ex: chamada de API)
        } else {
            alert("Nenhum item selecionado para exclusão.");
        }

        closeModal(overlayDelete); // Fecha o modal após a ação
    });


    // --- Modal de Edição (Editar) ---

    // Abre o modal de edição
    btnEdit.addEventListener('click', () => {
        // Exemplo: Simular o carregamento de dados de um item para edição
        document.getElementById('edit-nome').value = "Coxinha de Frango";
        document.getElementById('edit-preco').value = "5.50";

        openModal(overlayEdit);
    });

    // Configura o fechamento do modal de edição
    setupModal(overlayEdit, fecharEdit);

    // Lógica de Salvar Edição
    formEdit.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const novoNome = document.getElementById('edit-nome').value;
        const novoPreco = document.getElementById('edit-preco').value;

        if (novoNome && novoPreco) {
            console.log("Dados de Edição Salvos:", { nome: novoNome, preco: novoPreco });
            alert(`Edição salva: ${novoNome} - R$${parseFloat(novoPreco).toFixed(2).replace('.', ',')}`);
            // Lógica real de salvamento viria aqui (ex: chamada de API)
        } else {
            alert("Preencha todos os campos para salvar a edição.");
        }

        closeModal(overlayEdit); // Fecha o modal após a ação
    });

});



if (!getLocalStorage(hasLoggedStorageName))
    document.dispatchEvent(userHasLeftEvent);
else
    document.dispatchEvent(userHasLoggedEvent);
