async function login() {

    const email = document.getElementById("email").value;
    const motDePasse = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, motDePasse })
    });

    const data = await response.json();

    if (data.token) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "dashboard.html";

    } else {
        alert(data.message || "Erreur connexion");
    }
}
function checkAuth() {

    const token = localStorage.getItem("token");

    const isLoginPage = window.location.pathname.includes("login.html");

    if (!token && !isLoginPage) {
        window.location.href = "login.html";
    }
}
function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";
}
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
function protectPage() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}
document.addEventListener("DOMContentLoaded", () => {

    checkAuth();
    afficherUtilisateur();

});