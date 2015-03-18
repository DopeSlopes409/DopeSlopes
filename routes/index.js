var express = require('express');
var request = require('request');
var util = require('util');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var seshUser = req.session.passport.user;
	var dustVars = {
    	title: 'DopeSlopes',
    	cssFiles: [{css: 'index.css'}],
    	javascriptFiles: [{javascript: 'index.js'}],
    };
  if (seshUser && seshUser.profile) {
    console.log('GET Index session: ', JSON.stringify(seshUser, false, null));
    dustVars.displayName = seshUser.profile['_json'].displayName;
    dustVars.userId = req.session.objectId;
  }
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
  var seshUser = req.session.passport.user;
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  var state = req.query.state;
  var range = req.query.range;
  var address = req.query.address;

  range = !range ? 500 : range;   // if no range selected, use value big enough to include all region results
  address = !address ? "" : address;
  
  console.log('latitude: ' + latitude + ', longitude: ' + longitude + ', state: ' + state + ', range: ' + range);

  // var reqResults; //repsonse from API

  // get region for supplied state arg
  var region = stateToRegion(state);
  console.log("region by geolocation: " + region);

  // url for API request
  var url = "http://feeds.snocountry.net/conditions.php?regions="+ region +"&apiKey=api8932.test5643&output=json";
  var numItems;

  request.get({
      url: url,
      json: true},
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("body items: ", body.items[0]);
          
            numItems = body.totalItems;
            //numItems = 10;   //  remove once testing finished
            console.log("num resorts found: ", numItems)

            var dustVars = {
              title: 'DopeSlopes',
              cssFiles: [{css: 'search2.css'}],
              javascriptFiles: [{javascript: 'search2.js'}],
              originLat: latitude,
              originLong: longitude,
              basic_search_input: address,
              resortEntries : []
            };

            if (seshUser && seshUser.profile) {
              console.log('GET Index session: ', util.inspect(seshUser, false, null));
              dustVars.displayName = seshUser.profile['_json'].displayName;
              dustVars.userId = req.session.objectId;
            }

            console.log("range scope check: ", range);

            dustVars.resortEntries = body.items.map(function (entry) {
              console.log('traversign resort: ' + JSON.stringify(entry));
              return {
                id: entry["id"],
                name: entry.resortName,
                latitude: entry.latitude,
                longitude: entry.longitude,
                openRuns: entry.openDownHillTrails,
                totalRuns: entry.maxOpenDownHillTrails,
                baseTemp: entry.forecastBaseTemp,
                summitTemp: entry.forecastTopTemp,
                operatingStatus: entry.operatingStatus,
                weather: entry.weather,
                snowQuality: entry.snowQuality,
                openLifts: entry.openLifts,
                pipesAndPark: entry.pipesAndPark,
                easyTrails: entry.easyTrails,
                intermediateTrails: entry.intermediateTrails,
                advancedTrails: entry.advancedTrails,
                address: entry.address,
                website: entry.website,
                phoneNumber: entry.phoneNumber,
                snowPhoneNumber: entry.snowPhoneNumber,
                email: entry.email,
                trailMap: entry.trailMap,
                weekdayHours: entry.weekdayHours,
                weekendHours: entry.weekendHours,
                recentSnowfall: (entry.newSnowMax + entry.newSnowMin) / 2};
            });

            console.log("dustVars lat/long: ", dustVars.originLat, dustVars.originLong)

            //TODO: Sort resortEntries by travel time from current geolocation

            //truncate resortEntries length 
            dustVars.resortEntries.splice(numItems);
            
            filteredResorts = [];
            dustVars.resortEntries.forEach(function (elt) {
              // console.log("resort: " + elt.name + " lat: " + elt.latitude + " lon: " + elt.longitude + " open_runs: " + elt.open_runs 
              //       + " total_runs: " + elt.total_runs + " snow: " + elt.recent_snowfall);

              // add resort if within specified range
              var distance = haversine(latitude, longitude, elt.latitude, elt.longitude);
              if (distance <= range) {
                filteredResorts.push(elt); 
              }
            }); 

            if (filteredResorts.length > 0) {
               dustVars.resortEntries = filteredResorts;
            } else {
              dustVars.resortEntries = [];
            }
         
            res.render('search2', dustVars); 
          } else {
            console.log("Unable to access REST API.");
            console.log("Error: " + error);

            var dustVars = {
              title: 'DopeSlopes',
              cssFiles: [{css: 'index.css'}],
              javascriptFiles: [{javascript: 'index.js'}],
              resortEntries : []
            };

            if (seshUser && seshUser.profile) {
              console.log('GET Index session: ', util.inspect(seshUser, false, null));
              dustVars.displayName = seshUser.profile['_json'].displayName;;
            }

            res.render('index', dustVars);
          }
        });

  console.log('left ajax call');
  //render results
  //res.render('resort_search', dustVars);

});

// credit to http://rosettacode.org/wiki/Haversine_formula for haversine function
function haversine(lat1,lon1,lat2,lon2) {
   console.log("haversine");
   console.log("lat1: ", lat1, "lon1: ", lon1, "lat2: ", lat2, "lon2: ", lon2);
   lat1 = deg(lat1);
   lon1 = deg(lon1);
   lat2 = deg(lat2);
   lon2 = deg(lon2);
   var R = 6372.8; // km
   var kmToMiles = 0.621371;
   var dLat = lat2 - lat1;
   var dLon = lon2 - lon1;
   var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
   var c = 2 * Math.asin(Math.sqrt(a));
   return R * c * kmToMiles;
}

function deg(deg) { return deg/180.0 * Math.PI; }

function stateToRegion(state) {
  console.log("stateToRegion");
  var region;
    var sw = state.toUpperCase();
    switch(sw) {
        case "AK": case "ID": case "OR": case "WA": region = "northwest"; break;
        case "AZ": case "CA": case "HI": case "NV": region = "southwest"; break;
        case "CO": case "MT": case "NM": case "UT": case "WY": region = "rockies"; break;
        case "AR": case "IA": case "IL": case "IN": case "MI": case "MN": case "MO": case "ND":
        case "OH": case "SD": case "WI": case "TX": case "KS": case "NE": region = "midwest"; break;
        case "CT": case "MA": case "ME": case "NH": case "NJ": case "NY": case "PA":
        case "DE": case "RI": case "VT": region = "northeast"; break;
        case "AL": case "FL": case "GA": case "MD": case "NC": case "TN": case "OK": case "SC":
        case "VA": case "WV": case "KY": case "LA": case "MS": region = "southeast"; break;    
        default: region = "southwest";
    }
    return region;
}

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
