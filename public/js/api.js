const API_URL = "https://gestion-stock-production-0630.up.railway.app/api";

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token && {
            Authorization: `Bearer ${token}`
        })
    };
}

async function handleResponse(res) {

    const data = await res.json();

    if (res.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";

        return;
    }

    if (!res.ok) {
        throw new Error(data.message || "Erreur API");
    }

    return data;
}

async function apiGet(endpoint) {

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: authHeaders()
    });

    return handleResponse(res);
}

async function apiPost(endpoint, body) {

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body)
    });

    return handleResponse(res);
}

async function apiDelete(endpoint) {

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: authHeaders()
    });

    return handleResponse(res);
}
