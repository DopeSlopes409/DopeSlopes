var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST new user account */
router.post('/users', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET trip itinerary */
router.get('/users/:id/trips', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET the register account page */
router.get('/register', function(req, res) {
	var dustVars = {
		title: 'Register Acccount',
		cssFiles: [
			/* no css for this page  yet */

			//{css: 'register account.css'},
			{css: 'formValidation.min.css'},
		],
		javascriptFiles: [
			{javascript: 'bootstrap-datetimepicker.min.js'},
			{javascript: 'formValidation.min.js'},
			{javascript: 'formValidation-bootstrap.min.js'},
			{javascript: 'register_account.js'}
		]
	};
	res.render('register_account', dustVars);
});

module.exports = router;
