var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST new user account */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

/* GET the register account page */
router.get('/', function(req, res) {
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
