var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {


	var dustVars = {
    	title: 'DopeSlopes',
    	cssFiles: [{css: 'index.css'}],
    	javascriptFiles: [{javascript: 'index.js'}],
    }
  	res.render('index', dustVars);
});



/* GET Sign in */

/* GET Sign up */


/* GET trip itinerary */

module.exports = router;
