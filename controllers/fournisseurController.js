const Fournisseur = require('../models/Fournisseur');

// CREATE
exports.createFournisseur = async (req, res) => {
    try {
        const data = await Fournisseur.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
exports.getAllFournisseurs = async (req, res) => {
    try {
        const data = await Fournisseur.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};