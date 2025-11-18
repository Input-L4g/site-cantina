const overlayMenu = document.querySelector('#overlay-menu');
const body = document.querySelector("body");

export function removeAccentuation(t) {
    return t
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
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
        maximumFractionDigits: 2
    });
}

export function formatStock(stock) {
    if (stock > 0) {
        return `${stock} DISPONÍVE${stock === 1? "L":"IS"}`;
    }
    return "INDISPONÍVEL";
}

export function printArray(arr, level=0) {
    const sep = ", ";
    let buffer = "";
    let hasSubArray = false;
    arr.forEach((element, i) => {
        if (element instanceof Array) {
            console.log(`${"\t".repeat(level)}${buffer}`);
            printArray(element, level + 1);
            hasSubArray = true;
        } else {
            buffer += i === lastIndex(arr)? element : element + sep;
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
    };
    return false;
} 

export function capitalize(text) {
    if (text.split(" ").length == 1) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text.split(" ").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export function createRootPath(dirLevel, file="") {
    if (typeof dirLevel !== "number") {
        return;
    }
    if (!(dirLevel > 0 || dirLevel <= 2)) {
        return;
    }
    return "../".repeat(dirLevel) + file;
}

export function toPage(...pagePath) {
    if (pagePath){
        console.log(pagePath.join("/"))
        window.location.href = pagePath.join("/");
    }
}

export function bindOverlay(modal, btnOpenOverlay, btnCloseOverlay = null, callback = null) {
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

export function bindCloseOverlay(modal, btnCloseOverlay = null, callback = null) {
    if (btnCloseOverlay) {
        btnCloseOverlay.addEventListener("click", () => {closeOverlay(modal)});
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeOverlay(modal);
        }
    });
    overlayMenu.addEventListener("click", () => {closeOverlay(modal)});
}
