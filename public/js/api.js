const API_URL = "http://localhost:3000/api";

// 🔐 token
function getToken() {
    return localStorage.getItem("token");
}

// 🚨 headers sécurisés
function authHeaders() {

    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": "Bearer " + token })
    };
}

// 🚨 gestion réponse globale
async function handleResponse(res) {

    const data = await res.json();

    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
        return null;
    }

    if (!res.ok) {
        throw new Error(data.message || "Erreur API");
    }

    return data;
}

// GET sécurisé
async function apiGet(endpoint) {

    const res = await fetch(API_URL + endpoint, {
        method: "GET",
        headers: authHeaders()
    });

    return handleResponse(res);
}

// POST sécurisé
async function apiPost(endpoint, data) {

    const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data)
    });

    return handleResponse(res);
}