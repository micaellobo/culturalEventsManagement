const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { listHomePage } = require('../controllers/eventControler');
const { redirectFrontogin, aboutUsPage, redirectFrontRegister } = require('../controllers/indexControler');

// Home page
router.get('/', listHomePage);

// GET Register
router.get('/login', redirectFrontogin);

//POST Login
router.post('/login', authController.loginHandler);

// GET Register
router.get('/register', redirectFrontRegister);

//POST Register
router.post('/register', authController.registerHandler);

//GET Logout
router.get('/logout', authController.logoutHandler);

//About Us page
router.get('/aboutUs', aboutUsPage);

module.exports = router;
