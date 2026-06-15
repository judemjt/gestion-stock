const mongoose = require('mongoose');

const mouvementSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ['ENTREE', 'SORTIE', 'TRANSFERT'],
        required: true
    },

    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    fournisseur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        default: null
    },

    destinataire: {
        type: String,
        default: null
    },

    quantite: {
        type: Number,
        required: true,
        min: 1
    },

    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrepot',
        default: null
    },

    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrepot',
        default: null
    },

    date: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model(
    'Mouvement',
    mouvementSchema
);