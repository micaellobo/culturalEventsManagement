const express = require('express');
const router = express.Router();

const eventRoutes = require('../controllers/eventControler');
const { isPromoter, isClient } = require('../controllers/permissionsController');

//Open a page to create an event
router.get('/create', isPromoter, eventRoutes.formCreate);

//Saves em database an especific event
router.post('/save', isPromoter, eventRoutes.save);

//Open a page  to edit an especific event
router.get('/edit/:id', isPromoter, eventRoutes.formEdit);

//Saves changes in database from an especific event
router.post('/edit/:id', isPromoter, eventRoutes.edit);

//Allows you to see the details of an event
router.get('/view/:id', isPromoter, eventRoutes.viewDetails);

//Delete an expecific event from database
router.post('/delete/:id', isPromoter, eventRoutes.delete);

//Page to list all the Events associated to the current user
router.get('/list', isPromoter, eventRoutes.list);

//Get all events
router.get('/listAll', eventRoutes.listHomePage);

router.get('/event-view-details/:id', eventRoutes.getEvent);

//Allows you to see the details from the Client side
router.get('/viewDetails/:id', (req, res) => {
	res.redirect(`http://localhost:4200/event-view-details/${req.params.id}`);
});

module.exports = router;
