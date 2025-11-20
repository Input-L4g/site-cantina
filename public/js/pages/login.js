import {
    toPage,
    getLocalStorage,
    setLocalStorage
} from "../utils.js"

const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    toPage("..", "..", "index.html");
});