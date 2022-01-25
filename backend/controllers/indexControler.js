const { frontendURL } = require('../config/businessRules');

const indexController = {
	redirectFrontogin(req, res) {
		return res.redirect(`${frontendURL}/login`);
	},

	redirectFrontRegister(req, res) {
		return res.redirect(`${frontendURL}/register`);
	},

	aboutUsPage(req, res) {
		const token = req.cookies['x-access-token'];
		const isLoggedIn = !token ? false : true;
		return res.render('aboutUs', { isLoggedIn });
	},
};

module.exports = indexController;
