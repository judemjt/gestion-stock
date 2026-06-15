const mongoose = require('mongoose');

const entrepotSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true,
        unique: true
    },

    localisation: {
        type: String,
        required: true
    },

    stock: [{
        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: true
        },

        quantite: {
            type: Number,
            default: 0,
            min: 0
        }
    }]

}, { timestamps: true });

module.exports = mongoose.model('Entrepot', entrepotSchema);