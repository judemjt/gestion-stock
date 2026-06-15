const Mouvement = require('../models/Mouvement');
const Entrepot = require('../models/Entrepot');

// =========================
// 🔥 ENTREE STOCK
// =========================
exports.entreeStock = async (req, res) => {
    try {
        console.log(req.body);

        const {
            article,
            entrepotId,
            quantite,
            fournisseur
        } = req.body;

        if (!fournisseur) {
            return res.status(400).json({
                message: "Le fournisseur est obligatoire pour une entrée de stock"
            });
        }

        if (!quantite || quantite <= 0) {
            return res.status(400).json({
                message: "La quantité doit être supérieure à 0"
            });
        }

        const entrepot = await Entrepot.findById(entrepotId);

        if (!entrepot) {
            return res.status(404).json({
                message: "Entrepôt introuvable"
            });
        }

        const stockItem = entrepot.stock.find(
            s => s.article.toString() === article
        );

        if (stockItem) {
            stockItem.quantite += quantite;
        } else {
            entrepot.stock.push({
                article,
                quantite
            });
        }

        await entrepot.save();

        const mouvement = await Mouvement.create({
            type: 'ENTREE',
            article,
            fournisseur,
            quantite,
            destination: entrepotId,
            utilisateur: req.user.id   // 👈 AJOUTÉ
        });
        return res.status(201).json({
            message: "Entrée de stock effectuée",
            mouvement
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

// =========================
// 🔥 SORTIE STOCK
// =========================
exports.sortieStock = async (req, res) => {
    try {

        const {
            article,
            entrepotId,
            quantite,
            destinataire
        } = req.body;

        if (!quantite || quantite <= 0) {
            return res.status(400).json({
                message: "La quantité doit être supérieure à 0"
            });
        }

        const entrepot = await Entrepot.findById(entrepotId);

        if (!entrepot) {
            return res.status(404).json({
                message: "Entrepôt introuvable"
            });
        }

        const stockItem = entrepot.stock.find(
            s => s.article.toString() === article
        );

        if (!stockItem || stockItem.quantite < quantite) {
            return res.status(400).json({
                message: "Stock insuffisant"
            });
        }

        stockItem.quantite -= quantite;

        await entrepot.save();

        const mouvement = await Mouvement.create({
            type: 'SORTIE',
            article,
            quantite,
            source: entrepotId,
            destinataire,
            utilisateur: req.user.id   // 👈 AJOUTÉ
        });
        return res.status(201).json({
            message: "Sortie de stock effectuée",
            mouvement
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

// =========================
// 🔥 TRANSFERT ENTRE ENTREPÔTS
// =========================
exports.transfertStock = async (req, res) => {
    try {

        const {
            article,
            sourceId,
            destinationId,
            quantite
        } = req.body;

        if (!quantite || quantite <= 0) {
            return res.status(400).json({
                message: "La quantité doit être supérieure à 0"
            });
        }

        const source = await Entrepot.findById(sourceId);
        const destination = await Entrepot.findById(destinationId);

        if (!source || !destination) {
            return res.status(404).json({
                message: "Entrepôt source ou destination introuvable"
            });
        }

        const stockSource = source.stock.find(
            s => s.article.toString() === article
        );

        if (!stockSource || stockSource.quantite < quantite) {
            return res.status(400).json({
                message: "Stock insuffisant dans l'entrepôt source"
            });
        }

        // Décrémentation source
        stockSource.quantite -= quantite;

        // Incrémentation destination
        const stockDest = destination.stock.find(
            s => s.article.toString() === article
        );

        if (stockDest) {
            stockDest.quantite += quantite;
        } else {
            destination.stock.push({
                article,
                quantite
            });
        }

        await source.save();
        await destination.save();

        const mouvement = await Mouvement.create({
            type: 'TRANSFERT',
            article,
            quantite,
            source: sourceId,
            destination: destinationId,
            utilisateur: req.user.id   // 👈 AJOUTÉ
        });

        return res.status(201).json({
            message: "Transfert effectué avec succès",
            mouvement
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

// =========================
// 🔥 LISTE MOUVEMENTS
// =========================
exports.getAllMouvements = async (req, res) => {
    try {

        const mouvements = await Mouvement.find()
            .populate('article')
            .populate('fournisseur')
            .populate('source')
            .populate('destination')
            .populate('utilisateur', 'nom email role')
            .sort({ createdAt: -1 });

        res.json(mouvements);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};