require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// =========================
// DB CONNECTION
// =========================
(async () => {
  try {
    await connectDB();
    console.log("MongoDB connecté avec succès");
  } catch (err) {
    console.error("Erreur MongoDB:", err);
    process.exit(1);
  }
})();

// =========================
// MIDDLEWARE
// =========================
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// SERVE FRONTEND (IMPORTANT)
// =========================
app.use(express.static("public"));

// =========================
// ROUTES API
// =========================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/entrepots', require('./routes/entrepotRoutes'));
app.use('/api/fournisseurs', require('./routes/fournisseurRoutes'));
app.use('/api/mouvements', require('./routes/mouvementRoutes'));

// =========================
// HEALTH CHECK (RAILWAY)
// =========================
app.get("/", (req, res) => {
  res.send("API StockPro OK 🚀");
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur port ${PORT}`);
});
