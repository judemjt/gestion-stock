const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        // 🔥 VERIFICATION SESSION STRICTE
        if (!user.sessionId || user.sessionId !== decoded.sessionId) {
            return res.status(401).json({
                message: "Session invalide ou expirée"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Token invalide" });
    }
};