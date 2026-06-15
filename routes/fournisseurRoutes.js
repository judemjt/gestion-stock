const router = require('express').Router();
const fournisseurController = require('../controllers/fournisseurController');

router.post('/', fournisseurController.createFournisseur);
router.get('/', fournisseurController.getAllFournisseurs);

module.exports = router;