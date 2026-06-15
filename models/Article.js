const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true
    },

    reference: {
        type: String,
        required: true,
        unique: true
    },

    prix: {
        type: Number,
        required: true,
        min: 0
    },

    seuilAlerte: {
        type: Number,
        default: 5,
        min: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);