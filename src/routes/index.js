const { Router } = require('express');
const scrapeRoute = require('./scrape.routes');
const userRoute = require('./user.routes');
const appraisalRoute = require('./appraisal.routes');

// Importar todos los routers;

const router = Router();

// Configurar los routers

router.use('/user', userRoute);
router.use('/scrape', scrapeRoute);
// router.use('/appraisal', appraisalRoute);

module.exports = router;
