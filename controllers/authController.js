const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


// =========================
// 🧾 REGISTER
// =========================
exports.register = async (req, res) => {

    try {

        const { nom, email, motDePasse, role } = req.body;

        const existe = await User.findOne({ email });

        if (existe) {
            return res.status(400).json({
                message: 'Email déjà utilisé'
            });
        }

        const hash = await bcrypt.hash(motDePasse, 10);

        const user = await User.create({
            nom,
            email,
            motDePasse: hash,
            role
        });

        res.status(201).json(user);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// =========================
// 🔐 LOGIN (SESSION UNIQUE)
// =========================
exports.login = async (req, res) => {

    try {

        const { email, motDePasse } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Utilisateur introuvable" });
        }

        const valide = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!valide) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // 🔥 TOUJOURS RESET ANCIENNE SESSION AVANT
        user.sessionId = null;
        await user.save();

        // 🔐 nouvelle session
        const sessionId = crypto.randomUUID();

        user.sessionId = sessionId;
        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                sessionId
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// =========================
// 🚪 LOGOUT
// =========================
exports.logout = async (req, res) => {

    try {

        await User.findByIdAndUpdate(req.user.id, {
            sessionId: null
        });

        return res.json({ message: "Déconnecté avec succès" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};