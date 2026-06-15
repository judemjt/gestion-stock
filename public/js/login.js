const API = "http://localhost:3000/api";

async function login() {

    const email = document.getElementById("email").value;
    const motDePasse = document.getElementById("password").value;

    try {

        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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