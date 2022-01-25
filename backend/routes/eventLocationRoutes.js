const express = require('express');
const router = express.Router();
const eventLocationRoutes = require('../controllers/eventLocationControler');

const { isPromoter, isClient } = require('../controllers/permissionsController');

//Open a page to create an event Location
router.get('/create', eventLocationRoutes.formCreate);

//Saves em database an especific eventLocation
router.post('/save', eventLocationRoutes.save);

//Open a page  to edit an especific event Location
router.get('/edit/:id', eventLocationRoutes.formEdit);

//Saves changes in database from an especific event
router.post('/edit/:id', eventLocationRoutes.edit);

//Allows you to see the details of an event location
router.get('/view/:id', eventLocationRoutes.viewDetails);

//Delete an expecific even location from database
router.post('/delete/:id', eventLocationRoutes.delete);

//Page to list all the eventLocations
router.get('/list', eventLocationRoutes.list);

router.get('/infoLocations', eventLocationRoutes.info);

module.exports = router;
