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


// set search prompt to middle of page
function setPrompt() {
  $('.centered').position('center');
}

// make run on use-my-loc.click()
$("#use-my-loc").click(function() {
   console.log("Get Location clicked");
   if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
         function (position) {
            console.log('latitude' + position.coords.latitude + ', longitude: ' +  position.coords.longitude);
            
            // navigate to...
            var query_uri = '/resort_search/' + '?latitude=' +  position.coords.latitude + '&longitude=' + position.coords.longitude; 
            console.log(query_uri);
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
    console.log("Search Button Clicked");
    console.log($("#basic_search_input").val());
});

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