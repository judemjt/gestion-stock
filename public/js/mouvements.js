const API = "http://localhost:3000/api";

let articles = [];
let entrepots = [];
let fournisseurs = [];
let allMouvements = [];

// =====================
// FORMAT SOURCE
// =====================

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

function formatSource(m) {

    if (m.type === "ENTREE") {
        return m.fournisseur?.nom || "Fournisseur inconnu";
    }

    if (m.type === "SORTIE") {
        return `${m.source?.nom || "-"} ➜ ${m.destinataire || "Client"}`;
    }

    if (m.type === "TRANSFERT") {
        return `${m.source?.nom || "-"} ➜ ${m.destination?.nom || "-"}`;
    }

    return "-";
}

// =====================
// CHARGER DONNEES
// =====================
async function chargerDonnees() {

    try {

        articles = await fetch(`${API}/articles`, {
            headers: authHeaders()
        }).then(r => r.json());
        
        entrepots = await fetch(`${API}/entrepots`, {
            headers: authHeaders()
        }).then(r => r.json());
        
        fournisseurs = await fetch(`${API}/fournisseurs`, {
            headers: authHeaders()
        }).then(r => r.json());
        document.getElementById("article").innerHTML =
            articles.map(a => `
                <option value="${a._id}">
                    ${a.nom}
                </option>
            `).join("");

        changerType();

    } catch (error) {
        console.error(error);
    }
}

// =====================
// CHANGEMENT TYPE
// =====================
function changerType() {

    const type =
        document.getElementById("type").value;

    const zone =
        document.getElementById("zoneDynamique");

    // ENTREE
    if (type === "ENTREE") {

        zone.innerHTML = `
        <div class="col-md-4">
            <label>Fournisseur</label>

            <select id="fournisseur" class="form-control">

                ${fournisseurs.map(f => `
                    <option value="${f._id}">
                        ${f.nom}
                    </option>
                `).join("")}

            </select>
        </div>

        <div class="col-md-4">
            <label>Destination</label>

            <select id="destination" class="form-control">

                ${entrepots.map(e => `
                    <option value="${e._id}">
                        ${e.nom}
                    </option>
                `).join("")}

            </select>
        </div>
        `;
    }

    // SORTIE
    if (type === "SORTIE") {

        zone.innerHTML = `
        <div class="col-md-4">
            <label>Entrepôt source</label>

            <select id="source" class="form-control">

                ${entrepots.map(e => `
                    <option value="${e._id}">
                        ${e.nom}
                    </option>
                `).join("")}

            </select>
        </div>

        <div class="col-md-4">
            <label>Destinataire</label>

            <input
                id="destinataire"
                class="form-control"
                placeholder="Client ou service"
                required
            >
        </div>
        `;
    }

    // TRANSFERT
    if (type === "TRANSFERT") {

        zone.innerHTML = `
        <div class="col-md-4">
            <label>Source</label>

            <select id="source" class="form-control">

                ${entrepots.map(e => `
                    <option value="${e._id}">
                        ${e.nom}
                    </option>
                `).join("")}

            </select>
        </div>

        <div class="col-md-4">
            <label>Destination</label>

            <select id="destination" class="form-control">

                ${entrepots.map(e => `
                    <option value="${e._id}">
                        ${e.nom}
                    </option>
                `).join("")}

            </select>
        </div>
        `;
    }
}

// =====================
// EXECUTER MOUVEMENT
// =====================
async function executerMouvement() {

    try {

        const type =
            document.getElementById("type").value;

        const article =
            document.getElementById("article").value;

        const quantite =
            Number(document.getElementById("quantite").value);

        let url = "";
        let body = {};

        // ENTREE
        if (type === "ENTREE") {

            url = `${API}/mouvements/entree`;

            body = {
                article,
                quantite,
                fournisseur:
                    document.getElementById("fournisseur").value,
                entrepotId:
                    document.getElementById("destination").value
            };
        }

        // SORTIE
// SORTIE
if (type === "SORTIE") {

    url = `${API}/mouvements/sortie`;

    body = {
        article,
        quantite,
        entrepotId:
            document.getElementById("source").value,

        destinataire:
            document.getElementById("destinataire").value
    };
}

        // TRANSFERT
        if (type === "TRANSFERT") {

            const source =
                document.getElementById("source").value;

            const destination =
                document.getElementById("destination").value;

            if (source === destination) {
                alert("Source et destination doivent être différentes");
                return;
            }

            url = `${API}/mouvements/transfert`;

            body = {
                article,
                quantite,
                sourceId: source,
                destinationId: destination
            };
        }

        const res = await fetch(url, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(body)
        });

        const data = await res.json();

        alert(data.message);

        loadMouvements();

    } catch (error) {
        console.error(error);
    }
}

// =====================
// HISTORIQUE
// =====================
async function loadMouvements() {

    try {

        const res = await fetch(`${API}/mouvements`, {
            headers: authHeaders()
        });
        const data = await res.json();

        allMouvements = data; // 👈 IMPORTANT

        renderMouvements(data);

    } catch (error) {
        console.error("Erreur chargement mouvements :", error);
    }
}
function renderMouvements(data) {

    let html = "";

    data.forEach(m => {

        let color = "";

        if (m.type === "ENTREE") color = "table-success";
        if (m.type === "SORTIE") color = "table-danger";
        if (m.type === "TRANSFERT") color = "table-warning";

        html += `
        <tr class="${color}">
        
            <td>${m.type}</td>
        
            <td>
                ${
                    m.article
                        ? m.article.nom
                        : '<span class="badge bg-danger">Article supprimé</span>'
                }
            </td>
        
            <td>${m.quantite}</td>
        <td>${m.utilisateur?.nom || "Ancien mouvement"}</td>
            <td>
                ${
                    m.type === "ENTREE"
                        ? (m.fournisseur?.nom || "Fournisseur inconnu")
                        : (m.source?.nom || "-")
                }
            </td>
        
            <td>
                ${
                    m.type === "SORTIE"
                        ? (m.destinataire || "Client")
                        : (m.destination?.nom || "-")
                }
            </td>
        
            <td>
                ${new Date(
                    m.createdAt || m.date
                ).toLocaleString()}
            </td>
        
        </tr>
        `;
    });

    document.getElementById("mouvementsTable").innerHTML = html;
}
function filtrerMouvements() {

    const type = document.getElementById("filterType")?.value.toLowerCase() || "";
    const article = document.getElementById("filterArticle")?.value.toLowerCase() || "";
    const entrepot = document.getElementById("filterEntrepot")?.value.toLowerCase() || "";

    const resultats = allMouvements.filter(m => {

        // TYPE
        const matchType = !type || m.type.toLowerCase() === type;

        // ARTICLE
        const matchArticle =
            !article ||
            (m.article?.nom || "").toLowerCase().includes(article);

        // ENTREPOT (source + destination + fournisseur)
        const source = (m.source?.nom || m.fournisseur?.nom || "").toLowerCase();
        const destination = (m.destination?.nom || m.destinataire || "").toLowerCase();

        const matchEntrepot =
            !entrepot ||
            source.includes(entrepot) ||
            destination.includes(entrepot);

        return matchType && matchArticle && matchEntrepot;
    });

    renderMouvements(resultats);
}

// =====================
// INIT
// =====================
chargerDonnees();
loadMouvements();

setInterval(async () => {

    const res = await fetch(`${API}/mouvements`, {
        headers: authHeaders()
    });

    const data = await res.json();

    allMouvements = data;

    filtrerMouvements();

}, 5000);