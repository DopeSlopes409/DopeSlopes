$(document).ready(function() {
	initializeClickListeners();
  //hide something about the background

  $('#background_cycler').removeClass('hide');
  $('#background_cycler').fadeIn(1500);
  // run every 7s
  setInterval('cycleImages()', 7000);

   // some geolaction function for defining region

   //initializeAutoComplete();

   setPrompt();
});

function cycleImages() {
  var $active = $('#background_cycler .active');
  var $next = ($('#background_cycler .active').next().length > 0) ? $('#background_cycler .active').next() : $('#background_cycler div:first');
      
  $next.css('z-index',2);//move the next image up the pile
  $active.fadeOut(1500,function() {//fade out the top image
    $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
    $next.css('z-index',3).addClass('active');//make the next image the top one
  });
}





// Hide the login prompt
function hideLoginPopup() {
  $("#popup").hide();
}

// set search prompt to middle of page
function setPrompt() {
  $('.centered').position('center');
}

// make run on use-my-loc.click()
$("#use-my-loc").click(function() {
   if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
         function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var latlng = lat + "," + lng;

            var geoCodeURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
            var apiKey = "&key=AIzaSyC_qmwLkxl8sUK-c3NHT5VLVt3-DgfwHSk";
            var apiURL = geoCodeURL + latlng + apiKey;

            $.getJSON(apiURL, function(json){
              var state;

              for(var i = 0; i < json.results[0].address_components.length; i++){
                if (json.results[0].address_components[i].types[0] == "administrative_area_level_1"){
                  state = json.results[0].address_components[i].short_name;
                }
              }
              
              var queryURI = '/resort_search' + '?latitude=' +  lat + '&longitude=' + lng + '&state=' + state;
              locationRedirect(queryURI);
            });
            // javascript go to new link with our URL with resource as query_uri
            //navigate to the url + uri
         },
         //make serperate error funct. 
         function (error){
            switch(error.code) {
                  case error.PERMISSION_DENIED:
                      alert("User denied the request for Geolocation.");
                      break;
                  case error.POSITION_UNAVAILABLE:
                      alert("Location information is unavailable.");
                      break;
                  case error.TIMEOUT:
                      alert("The request to get user location timed out.");
                      break;
                  case error.UNKNOWN_ERROR:
                      alert("An unknown error occurred.");
                      break;
            }
        });
    } else { 
        alert("Geolocation is not supported by this browser.");
    };
});

$("#loc-search-btn").click(function() {
  locateResorts();
});

$('#basic_search_input').keypress(function (e) {
    var key = e.which;
    if(key == 13) {
      locateResorts();
    }    
});

function locateResorts() {
    var address = $("#basic_search_input").val();

    // Replace all instances of non alphanumeric characters with '+'
    address = address.replace(/[\W_]+/g, "+");

    // Build JSON request url
    var geoCodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var apiKey = "&key=AIzaSyC_qmwLkxl8sUK-c3NHT5VLVt3-DgfwHSk";
    var apiURL = geoCodeURL + address + apiKey;

    // Get JSON object from Google GeoCoding API
    $.getJSON(apiURL, function(json){
      var lat = json.results[0].geometry.location.lat;
      var lng = json.results[0].geometry.location.lng;
      var state;

      for(var i = 0; i < json.results[0].address_components.length; i++){
        if (json.results[0].address_components[i].types[0] == "administrative_area_level_1"){
          state = json.results[0].address_components[i].short_name;
        }
      }
      
      var queryURI = '/resort_search' + '?latitude=' +  lat + '&longitude=' + lng + '&state=' + state;
      locationRedirect(queryURI);
    });
}

// Redirect to the user's location query
function locationRedirect(queryURI){
  var baseURL = window.location.origin;
  var fullURL = baseURL + queryURI;

  window.location.href = fullURL;
}

function initializeClickListeners() {
	$(".clickableRow").click(function() {
		console.log("Row clicked");
		window.document.location = $(this).attr("href");
	});
}

//get Location
function initializeAutoComplete() {
   //make request for this region

   $('#basic_search_input').autocomplete(
      //fields
      );   
}




// function cycleImages() {
//   var $active = $('#background_cycler .active');
//   var $next = ($('#background_cycler .active').next().length > 0) ? $('#background_cycler .active').next() : $('#background_cycler div:first');
      
//   $next.css('z-index',2);//move the next image up the pile
//   $active.fadeOut(1500,function() {//fade out the top image
//     $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
//     $next.css('z-index',3).addClass('active');//make the next image the top one
//   });
// }

// $(window).load( function() {
//   $('#background_cycler').fadeIn(1500);
//   // run every 7s
//   setInterval('cycleImages()', 7000);
// })