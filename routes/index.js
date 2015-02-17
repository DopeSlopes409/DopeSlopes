var express = require('express');
var request = require('request');

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
   // with geolocation as a dust variable.b

   
   //

   var dustVars = {
      title: 'DopeSlopes',
      cssFiles: [{css: 'index.css'},
         {css: 'search.css'}],
      javascriptFiles: [{javascript: 'search.js'}]
   };
   res.render('search2', dustVars);
});


/* GET request for searching resorts based on geolocation */
router.get('/resort_search', function (req, res, next) 
{
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  var state = req.query.state;
  
  console.log('latitude: ' + latitude + ', longitude: ' + longitude + ', state: ' + state);
  // Request Snocountry API for southwest region
  // var reqResults; //repsonse from API  
 
  // TODO: get region for supplied state arg
  
  var region = "northwest";
  var url = "http://feeds.snocountry.net/conditions.php?regions="+ region +"&apiKey=api8932.test5643&output=json";
  var numItems;

  request.get({
      url: url,
      json: true},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body.items[0]);
          
            //numItems = response.totalItems;
            numItems = 10;   //  remove once testing finished

            var dustVars = {
              title: 'DopeSlopes',
              cssFiles: [{css: 'search2.css'}],
              javascriptFiles: [{javascript: 'search2.js'}],
              resortEntries : []
            };


            dustVars.resortEntries = body.items.map(function (entry) {
              return {id: entry.id,
                name: entry.resortName,
                latitude: entry.latitude,
                longitude: entry.longitude,
                openRuns: entry.openDownHillTrails,
                totalRuns: entry.maxOpenDownHillTrails,
                recentSnowfall: (entry.newSnowMax + entry.newSnowMin) / 2};
            });

            //TODO: Sort resortEntries by travel time from current geolocation

            //truncate resortEntries length 
            dustVars.resortEntries.splice(numItems);
            
            dustVars.resortEntries.forEach(function (elt) {
              console.log("resort: " + elt.name + " lat: " + elt.latitude + " lon: " + elt.longitude + " open_runs: " + elt.open_runs 
                    + " total_runs: " + elt.total_runs + " snow: " + elt.recent_snowfall);
            }); 

            res.render('search2', dustVars);        
          }
          else {
            console.log("Unable to access REST API.");
            console.log("Error: " + error);

            var dustVars = {
              title: 'DopeSlopes',
              cssFiles: [{css: 'index.css'}],
              javascriptFiles: [{javascript: 'index.js'}],
              resortEntries : []
            };

            res.render('index', dustVars);
          }
        });

  console.log('left ajax call');
  //render results
  //res.render('resort_search', dustVars);

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
