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

<<<<<<< HEAD

=======
/* GET Sign in */

/* GET Sign up */


/* GET trip itinerary */
>>>>>>> 19b4843470ae8199d0f1f2be56274596cbaa347e

module.exports = router;
