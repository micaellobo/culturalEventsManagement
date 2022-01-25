const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/promoters', adminController.getPromoters);

router.get('/promotersByStatus/:status', adminController.getPromotersByStatus);

router.put('/changePromoterStatus/:id', adminController.updatePromoterStatus);

module.exports = router;
