document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadDashboard();
    afficherUtilisateur();
    setInterval(loadDashboard, 10000); // refresh propre
});

// 🔐 protection page
function checkAuth() {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    }
}

// 📊 dashboard principal
async function loadDashboard() {

    try {

        const [articles, entrepots, mouvements] = await Promise.all([
            apiGet("/articles"),
            apiGet("/entrepots"),
            apiGet("/mouvements")
        ]);

        // KPI
        document.getElementById("kpiArticles").innerText = articles.length;
        document.getElementById("kpiEntrepots").innerText = entrepots.length;

        // 🚨 ALERTES STOCK
        let alertes = [];

        entrepots.forEach(e => {
            (e.stock || []).forEach(s => {

                if (
                    s.article &&
                    s.article.seuilAlerte &&
                    s.quantite < s.article.seuilAlerte
                ) {
                    alertes.push({
                        article: s.article.nom,
                        quantite: s.quantite,
                        seuil: s.article.seuilAlerte,
                        entrepot: e.nom
                    });
                }
            });
        });

        document.getElementById("kpiAlertes").innerText = alertes.length;

        document.getElementById("alertes").innerHTML =
            alertes.map(a => `
                <div class="alert alert-danger">
                    ⚠ ${a.article}<br>
                    Stock : ${a.quantite} / Seuil : ${a.seuil}<br>
                    📍 ${a.entrepot}
                </div>
            `).join("");

        // 🔁 MOUVEMENTS
        const derniers = mouvements
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        document.getElementById("mouvements").innerHTML =
            derniers.map(m => `
                <tr>
                    <td>${m.type}</td>
                    <td>${m.article?.nom || "-"}</td>
                    <td>${formatSource(m)}</td>
                    <td>${m.quantite}</td>
                     <td>${m.utilisateur?.nom || "Ancien mouvement"}</td>
                    <td>${new Date(m.createdAt).toLocaleString()}</td>
                </tr>
            `).join("");

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

// 📌 source format
function formatSource(m) {

    if (m.type === "ENTREE") {
        return m.fournisseur?.nom || "Fournisseur";
    }

    if (m.type === "SORTIE") {
        return m.source?.nom || "-";
    }

    if (m.type === "TRANSFERT") {
        return (m.source?.nom || "?") + " ➜ " + (m.destination?.nom || "?");
    }

    return "-";
}
function afficherUtilisateur() {

    const user = JSON.parse(localStorage.getItem("user"));
    const el = document.getElementById("userInfo");

    console.log("USER:", user);
    console.log("EL:", el);

    if (!el) return;

    if (user) {
        el.innerHTML = `
            👤 ${user.nom}<br>
            <small>${user.role}</small>
        `;
    } else {
        el.innerHTML = "Utilisateur non connecté";
    }
}