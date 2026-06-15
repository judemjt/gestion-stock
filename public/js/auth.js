// =========================
// 🔐 CONFIG TOKEN
// =========================
const API = "https://gestion-stock-production-0630.up.railway.app/api";


// =========================
// 🔐 PROTECTION DES PAGES
// =========================
function checkAuth() {

    const token = localStorage.getItem("token");

    const isLoginPage = window.location.pathname.includes("login.html");

    if (!token && !isLoginPage) {
        window.location.href = "login.html";
    }
}


// =========================
// 👤 AFFICHER UTILISATEUR
// =========================
function afficherUtilisateur() {

    const user = JSON.parse(localStorage.getItem("user"));
    const el = document.getElementById("userInfo");

    if (!el) return;

    if (user) {
        el.innerHTML = `
            👤 ${user.nom}<br>
            <small>${user.role}</small>
        `;
    } else {
        el.innerHTML = "Utilisateur inconnu";
    }
}


// =========================
// 🚪 LOGOUT PROPRE
// =========================
function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}


// =========================
// 🔒 PROTECTION AVANT CHARGEMENT
// =========================
function protectPage() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}


// =========================
// 🚀 AUTO INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

    checkAuth();
    afficherUtilisateur();

});
