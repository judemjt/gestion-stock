const API = "https://gestion-stock-production-0630.up.railway.app/api";

// =====================
// 📦 CHARGER ARTICLES
// =====================
async function loadArticles() {
    try {

        const res = await fetch(`${API}/articles`);
        const articles = await res.json();

        let html = "";

        articles.forEach(a => {

            const lowStock = a.seuilAlerte <= 5;

            html += `
                <tr>
                    <td>${a.nom}</td>
                    <td>${a.reference}</td>
                    <td>${a.prix}</td>
                    <td>
                        ${lowStock ? `<span class="badge bg-danger">${a.seuilAlerte}</span>` : a.seuilAlerte}
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm"
                        onclick="deleteArticle('${a._id}')">
                            🗑 Supprimer
                        </button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("articlesTable").innerHTML = html;

    } catch (error) {
        console.error("Erreur chargement articles:", error);
        alert("❌ Erreur chargement articles");
    }
}

// =====================
// ➕ AJOUT ARTICLE
// =====================
async function addArticle() {

    const article = {
        nom: document.getElementById("nom").value,
        reference: document.getElementById("reference").value,
        prix: Number(document.getElementById("prix").value),
        seuilAlerte: Number(document.getElementById("seuilAlerte").value)
    };

    try {

        const res = await fetch(`${API}/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(article)
        });

        if (!res.ok) {
            throw new Error("Erreur ajout article");
        }

        showMessage("✔ Article ajouté avec succès", "success");

        loadArticles();
        clearForm();

    } catch (error) {
        console.error(error);
        showMessage("❌ Erreur lors de l'ajout", "danger");
    }
}

// =====================
// 🗑 SUPPRESSION ARTICLE
// =====================
async function deleteArticle(id) {

    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

    try {
        await fetch(`${API}/articles/${id}`, {
            method: "DELETE"
        });

        showMessage("🗑 Article supprimé", "success");

        loadArticles();

    } catch (error) {
        console.error(error);
        showMessage("❌ Erreur suppression", "danger");
    }
}

// =====================
// 🧹 RESET FORM
// =====================
function clearForm() {
    document.getElementById("nom").value = "";
    document.getElementById("reference").value = "";
    document.getElementById("prix").value = "";
    document.getElementById("seuilAlerte").value = "";
}

// =====================
// 🔔 MESSAGE UI
// =====================
function showMessage(message, type) {

    const div = document.createElement("div");

    div.className = `alert alert-${type}`;
    div.innerText = message;

    document.body.prepend(div);

    setTimeout(() => div.remove(), 2500);
}

// init
loadArticles();
