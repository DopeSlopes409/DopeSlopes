var express = require('express');

var request = require('request');
var util = require('util');
var parse = require('node-parse-api').Parse;

var router = express.Router();

var parseOptions = {
    app_id: process.env.PARSE_APP_ID || '2ONRJ6uzD2442S4Dn6sxpIKNMG1CDppk4upAvmDP',
    api_key: process.env.PARSE_API_KEY || 'sGOLcVBuvqL73CEQfTerjkoyY38n6HCPY4d5Qt4A'// api_key:'...' could be used too
};

/* GET favorite resorts */
router.get('/users/:id/resorts', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST favorite resort */
router.post('/:id/resorts', function(req, res) {
	var userId = req.params.id;
	var resId = req.query.resId;
	console.log('adding resort: ' + req.query.resId)
	var conn = new parse(parseOptions);

	var favData = { 
		favoriteResorts: {
		   "__op": "AddUnique",
		   "objects": [resId]
		}
	};

	//update user resorts array
	conn.update('User', userId, favData, function(err, response) {
		res.send(response);
	});
});

/* DELETE favorite resort */
router.delete('/:id/resorts', function(req, res) {
	var userId = req.params.id;
	var resId = req.query.resId;
	console.log('removing resort: ' + req.query.resId)
	var conn = new parse(parseOptions);

  var favData = { 
		favoriteResorts: {
		   "__op": "Remove",
		   "objects": [resId]
		}
	};

  //update user resorts array
	conn.update('User', userId, favData, function(err, response) {
		res.send(response);
	});
});


/* GET the register account page */
router.get('/register', function(req, res) {
	var dustVars = {
		title: 'Register Acccount',
		cssFiles: [
			/* no css for this page  yet */

			//{css: 'register account.css'},
			//{css: 'formValidation.min.css'},
		],
		javascriptFiles: [
			//{javascript: 'bootstrap-datetimepicker.min.js'},
			//{javascript: 'formValidation.min.js'},
			//{javascript: 'formValidation-bootstrap.min.js'},
			{javascript: 'register_account.js'}
		]
	};
	res.render('register_account', dustVars);
});

module.exports = router;
