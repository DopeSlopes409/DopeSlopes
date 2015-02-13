var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {


	var dustVars = {
    	title: 'DopeSlopes',
    	cssFiles: [{css: 'index.css'}],
    	javascriptFiles: [{javascript: 'index.js'}],
    };
  	res.render('index', dustVars);
});

/* GET search page */
router.get('/location_search/:query', function (req, res, next) {
   //var client_query = req.;
   
   // Get location results of search query from gmaps api
   
   

   //  Figure out how to get GMaps to render location on client-side
   // with geolocation as a dust variable.

   // Get Results of SnoCountry API for the given geolocation  



   var dustVars = {
      title: 'DopeSlopes',
      cssFiles: [{css: 'index.css'},
         {css: 'search.css'}],
      javascriptFiles: [{javascript: 'search.js'}]
   };
   res.render('resort_search', dustVars);
});

module.exports = router;
