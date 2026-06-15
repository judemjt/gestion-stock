const router = require('express').Router();
const entrepotController = require('../controllers/entrepotController');

router.get('/', entrepotController.listerEntrepots);
router.post('/', entrepotController.creerEntrepot);
router.delete('/:id', entrepotController.supprimerEntrepot);

// 🔥 alertes stock faible
router.get('/alertes-stock', entrepotController.stockAlerte);

module.exports = router;