const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { isPromoter, isClient, isClientBanned } = require('../controllers/permissionsController');

router.get('/', [isClient], clientController.findOne);

router.put('/', [isClient, isClientBanned], clientController.update);

router.put('/pwd/', [isClient, isClientBanned], clientController.updatePassword);

router.post('/submitCovidTest/', [isClient], clientController.addCovidTeste);

module.exports = router;
