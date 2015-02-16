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

  function apiCall() {
    var REGION = "northwest";
    var url = "http://feeds.snocountry.net/conditions.php?regions="+REGION+"&apiKey=api8932.test5643&output=json";
    var id, name, latitude, longitude, open_runs, total_runs, recent_snowfall, numItems;

    $.ajax({
        url: url,
        dataType: 'json',
        success: function(response) {
            //numItems = response.totalItems;
            numItems = 5;
            for(var i = 0; i < numItems; i++) {
                id = response.items[i].id;
                name = response.items[i].resortName;
                latitude = response.items[i].latitude;
                longitude = response.items[i].longitude;
                open_runs = response.items[i].openDownHillTrails;
                total_runs = response.items[i].maxOpenDownHillTrails;
                recent_snowfall = (response.items[i].newSnowMax + response.items[i].newSnowMin) / 2;
                window.alert ("resort: " + name + " lat: " + latitude + " lon: " + longitude + " open_runs: " + open_runs 
                    + " total_runs: " + total_runs + " snow: " + recent_snowfall)
            }        
        },
        error : function() { window.alert("error"); }
   });
}
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
