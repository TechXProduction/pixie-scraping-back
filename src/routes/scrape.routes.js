const express = require('express');
const { Router } = require('express');
const { mapper, fillDb } = require('../controllers/scrape.controllers');
const { isUserLoggedIn } = require('../middlewares/auth');

const router = Router();

//////////////////////////////////

// Ruta para realizar el scraping
router.post('/', mapper);
// Ruta para llenar la db
router.post('/fillDb', fillDb);

module.exports = router;
