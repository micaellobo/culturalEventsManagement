const express = require('express');
const router = express.Router();

const ticketsController = require('../controllers/ticketsController');
const { isPromoter, isClient, isClientBanned } = require('../controllers/permissionsController');

router.get('/', ticketsController.find);

router.get('/byClientAndStatus/:status', isClient, ticketsController.getTicketsByClientAndStatus);

router.get('/:id', isClient, ticketsController.findOneByClient);

router.get('/byClient', isClient, ticketsController.getTicketsByClient);

router.post('/', [isClient, isClientBanned], ticketsController.create);

router.put('/cancel/:id', [isClient, isClientBanned], ticketsController.cancelTicket);

module.exports = router;
