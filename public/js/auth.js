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
async function login() {
    try {
        const email = document.getElementById("email").value;
        const motDePasse = document.getElementById("password").value;

        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, motDePasse })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Erreur login");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "dashboard.html";

    } catch (err) {
        console.error(err);
        alert("Erreur serveur");
    }
}

// =========================
// 🚀 AUTO INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

    checkAuth();
    afficherUtilisateur();

});
