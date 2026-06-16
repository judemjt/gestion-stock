const API = "https://gestion-stock-production-0630.up.railway.app/api";

// =====================
// 📦 LOAD ENTREPÔTS
// =====================
async function loadEntrepots() {

    const res = await fetch(`${API}/entrepots`);
    const data = await res.json();

    let html = "";

    data.forEach(e => {

        html += `
        <div class="card p-3 mb-3">
            <h5>🏢 ${e.nom}</h5> 
            <h5>📍 ${e.localisation}</h5>

            <button class="btn btn-danger btn-sm mb-2"
            onclick="deleteEntrepot('${e._id}')">
                Supprimer
            </button>

            <h6>📦 Stock :</h6>

            <ul>
                ${e.stock.map(s => `
                    <li>
                        ${s.article?.nom || "Article"} : 
                        <b>${s.quantite}</b>
                    </li>
                `).join("")}
            </ul>
        </div>
        `;
    });

    document.getElementById("entrepotsList").innerHTML = html;
}

// =====================
// ➕ ADD ENTREPOT
// =====================
async function addEntrepot() {

    const nom =
        document.getElementById("nom").value;

    const localisation =
        document.getElementById("localisation").value;

    if (!nom || !localisation) {

        alert("Veuillez remplir tous les champs");
        return;
    }

    const res = await fetch(`${API}/entrepots`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nom,
            localisation
        })

    });

    const data = await res.json();

    console.log(data);

    document.getElementById("nom").value = "";
    document.getElementById("localisation").value = "";

    loadEntrepots();
}

// =====================
// 🗑 DELETE ENTREPOT
// =====================
async function deleteEntrepot(id) {

    if (!confirm("Supprimer cet entrepôt ?")) return;

    await fetch(`${API}/entrepots/${id}`, {
        method: "DELETE"
    });

    loadEntrepots();
}

loadEntrepots();
