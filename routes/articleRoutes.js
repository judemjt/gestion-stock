const router = require('express').Router();
const articleController = require('../controllers/articleController');

// GET all articles
router.get('/', articleController.getAllArticles);

// POST article
router.post('/', articleController.creerArticle);

// DELETE article
router.delete('/:id', articleController.supprimerArticle);

module.exports = router;