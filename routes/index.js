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

   
   //

   var dustVars = {
      title: 'DopeSlopes',
      cssFiles: [{css: 'index.css'},
         {css: 'search.css'}],
      javascriptFiles: [{javascript: 'search.js'}]
   };
   res.render('resort_search', dustVars);
});


/* GET request for searching resorts based on geolocation */
router.get('/resort_search/:geolocation', function (req, res, next) 
{
  // Request Snocountry API for southwest region
  // var reqResults; //repsonse from API  
  var dustVars = {
    title: 'DopeSlopes',
    cssFiles: [{css: 'index.css'},
     {css: 'search.css'}],
    resorts : []
  };

  //for each result resort (elt)
  /*
  dustVars.resorts.push({
    name: ,
    geolocation: ,
    open_runs: ,
    total_runs: ,
    recent_snowfall: 
  });

  //render results
  res.render('resort_search', dustVars);
  */
});

/** 
 * GET search page. 
 * This is just temporary so I (Brent) can work on getting a front-end up.
 */
router.get('/search', function(req, res, next) {


   var dustVars = {
      title: 'Search',
      cssFiles: [{css: 'search.css'}],
      javascriptFiles: [{javascript: 'search.js'}],
    };
   res.render('search', dustVars);
});

/** 
 * GET search2 page. 
 * This is just temporary so I (Brent) can work on a second version of the front end.
 */
router.get('/search2', function(req, res, next) {


   var dustVars = {
      title: 'Search2',
      cssFiles: [{css: 'search2.css'}],
      javascriptFiles: [{javascript: 'search2.js'}],
    };
   res.render('search2', dustVars);
});

module.exports = router;
