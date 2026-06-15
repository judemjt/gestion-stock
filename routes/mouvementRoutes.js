const router = require('express').Router();

const mouvementController = require('../controllers/mouvementController');
const auth = require('../middleware/authMiddleware'); // 👈 UNE SEULE IMPORTATION

// =========================
// 🔥 ROUTES STOCK
// =========================

// Entrée de stock
router.post(
    '/entree',
    auth,
    mouvementController.entreeStock
);

// Sortie de stock
router.post(
    '/sortie',
    auth,
    mouvementController.sortieStock
);

// Transfert de stock
router.post(
    '/transfert',
    auth,
    mouvementController.transfertStock
);

// Liste des mouvements (protégée aussi recommandé)
router.get(
    '/',
    auth,
    mouvementController.getAllMouvements
);

// Route test
router.get('/ping', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;