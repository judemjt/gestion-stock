const Entrepot = require('../models/Entrepot');

// =====================
// CREATE ENTREPOT
// =====================
exports.creerEntrepot = async (req, res) => {
    try {
        const entrepot = await Entrepot.create(req.body);
        res.status(201).json(entrepot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =====================
// LIST ENTREPOTS
// =====================
exports.listerEntrepots = async (req, res) => {
    try {
        const entrepots = await Entrepot.find()
            .populate('stock.article');

        res.json(entrepots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =====================
// GET ONE ENTREPOT
// =====================
exports.getEntrepot = async (req, res) => {
    try {
        const entrepot = await Entrepot.findById(req.params.id)
            .populate('stock.article');

        if (!entrepot) {
            return res.status(404).json({
                message: 'Entrepôt introuvable'
            });
        }

        res.json(entrepot);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =====================
// UPDATE ENTREPOT
// =====================
exports.modifierEntrepot = async (req, res) => {
    try {
        const entrepot = await Entrepot.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(entrepot);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =====================
// DELETE ENTREPOT
// =====================
exports.supprimerEntrepot = async (req, res) => {
    try {
        await Entrepot.findByIdAndDelete(req.params.id);

        res.json({ message: 'Entrepôt supprimé' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =====================
// STOCK ALERTES
// =====================
exports.stockAlerte = async (req, res) => {
    try {
        const entrepots = await Entrepot.find()
            .populate('stock.article');

        let alertes = [];

        entrepots.forEach(entrepot => {
            entrepot.stock.forEach(s => {
                if (s.article && s.quantite < s.article.seuilAlerte) {
                    alertes.push({
                        entrepot: entrepot.nom,
                        article: s.article.nom,
                        quantite: s.quantite,
                        seuil: s.article.seuilAlerte
                    });
                }
            });
        });

        res.json(alertes);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};