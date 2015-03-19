var map;
var origin = {};
var resorts = [];
var markers = [];
var currentResortName = "";

function Resort (resortName, latitude, longitude, openRuns, totalRuns, recentSnowfall, operatingStatus, weather, summitTemp, baseTemp, snowQuality, openLifts, pipesAndParks, easyTrails, intermediateTrails, advancedTrails, address, website, phoneNumber, snowPhoneNumber, email, trailMap, weekdayHours, weekendHours) {
   this.resortName = resortName.trim();
   this.latitude = latitude;
   this.longitude = longitude;
   this.openRuns = isNaN(openRuns) ? "" : openRuns;
   this.totalRuns = isNaN(totalRuns) ? "" : totalRuns;
   this.recentSnowfall = isNaN(recentSnowfall) ? "" : recentSnowfall;
   this.operatingStatus = (operatingStatus.toString().trim() === "") ? "Open" : operatingStatus;
   this.weather = weather;
   this.summitTemp = summitTemp;
   this.baseTemp = baseTemp;
   this.snowQuality = snowQuality;
   this.openLifts = isNaN(openLifts) ? "Unknown" : openLifts;
   this.pipesAndParks = pipesAndParks;
   this.easyTrails = easyTrails;
   this.intermediateTrails = intermediateTrails;
   this.advancedTrails = advancedTrails;
   this.address = address;
   this.website = website;
   this.phoneNumber = phoneNumber;
   this.snowPhoneNumber = snowPhoneNumber;
   this.email = email.toString().trim();
   this.trailMap = trailMap;
   this.weekdayHours = weekdayHours;
   this.weekendHours = weekendHours;

   console.log("email: \"" + this.email + "\"");

   this.toString = function() {
      return this.resortName + " => (" + this.latitude + ", " + this.longitude + ")";
   };

   this.getWindowHTML = function () {
      return '<h3>' + this.resortName + '</h3>' +
         '<ul>' +
         '   <li>' + this.openRuns + '/' + this.totalRuns + ' runs </li>' + 
         '   <li>' + recentSnowfall + '" snow in last 24 hours</li>'
         '</ul>'
   };
}

function Origin (latitude, longitude) {
   this.latitude = latitude;
   this.longitude = longitude;
}


function getRouteTime(element, index, array){

   var directionsService = new google.maps.DirectionsService();
 
   var resortLat = resorts[index].latitude.toString();
   var resortLong = resorts[index].longitude.toString();

   var request = {
      origin: origin.latitude + "," + origin.longitude,
      destination: resortLat + "," + resortLong,
      travelMode: google.maps.TravelMode.DRIVING
   };

   directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
         resorts[index].duration = parseTime(result.routes[0].legs[0].duration.text);
         resorts[index].durationText = result.routes[0].legs[0].duration.text;
      }
   });

}

function parseTime(time){
   var totalMins = 0;
   var tokens = time.split(" ");
   for(var i = 0; i < tokens.length - 1; i += 2){
      if(tokens[i+1] == "hours"){
         totalMins += (parseFloat(tokens[i]) * 60);
      }
      else if(tokens[i+1] == "mins"){
         totalMins += parseFloat(tokens[i]);
      }
   }
   return totalMins;
}

function getRouteTimes(){
   resorts.forEach(getRouteTime);
}

$(document).ready(function() {
   setContentSize();
   getResortData();
   getOrigin();
   getRouteTimes();
   initializeMap();
   initializeMouseovers();
   initializeUserButtons();
   fixClosedResorts();
});

function fixClosedResorts () {
   $('.runs-open').each(function() {

    var contents = $(this).html().trim();
    if(contents.startsWith("/")) {
      $(this).html("0" + contents);
    }
 });
}

function initializeUserButtons() {
   $('.star').click(function() {
      var star = $(this);
      var resortId = star.data("resort-id");
      var userId = star.parent().parent().data('userid');
      var baseurl = window.location.href.split('/').slice(0, -1).join('/') + '/';

      console.log('In star fav, userid: ' + userId + ', ' + resortId);

      if (star.hasClass('favorite')) {
         star.toggleClass('favorite');
         //if logged in, delete from user favorites 
      } else {
         star.toggleClass('favorite');
         // if loged in, Add this resort to user favorites Only partially implemented for now
         
         // $.post(baseurl + 'user/' + userId + '/resorts?resId=' + resortId, 
         //    function(data) {
         //       console.log('posted new favorite, data: ' + JSON.stringify(data));
         //    });   

      }
   });
}


function setContentSize () {
   var height = $(window).height();
   var width = $(window).width();
   $("#content").css("height", (height - 100).toString() + "px");
   $("#content").css("width", width.toString() + "px");

   $("#map-canvas").css("width", (width-400).toString() + "px");
   $("#search-bar").css("width", (width-300).toString() + "px");
   $("#search-collumn").css("height", (height-100).toString() + "px");
   
   $("#search-info").css("height", (height-100).toString() + "px");
   $("#search-info").css("width", (400).toString() + "px");
   $("#search-info").css("left", (width-400).toString() + "px");

   $("#result-extended-info").css("height", (height-100).toString() + "px");
   $("#result-extended-info").css("width", (width-800).toString() + "px");

   $("#result-extended-info").css("display", "none");
}

function toggleResultsSlider(resortName) {
   var searchInfo = $('#search-info');
   var resultExtendedInfo = $("#result-extended-info");
   var width = $(window).width();

   if (searchInfo.hasClass('visible')) {
      // If the current resort is clicked, close the extended info
      if (currentResortName === resortName) {

         searchInfo.animate({"left":(width-400).toString()+"px"}, "slow",hideResultExtendedInfo).removeClass('visible');
         currentResortName = "";
      }
      // Otherwise switch the data of the extended info
      else {
         fillResortExtendedInfo(resortName);
         currentResortName = resortName;
      }
    } // Open
    else {
      $("#search-info").css("width", (width-400).toString() + "px");
      resultExtendedInfo.css("display", "block");
      searchInfo.animate({"left":"400px"}, "slow").addClass('visible');
      fillResortExtendedInfo(resortName);
      currentResortName = resortName;
    }
}

function hideResultExtendedInfo() {
   var resultExtendedInfo = $("#result-extended-info");
   resultExtendedInfo.css("display", "none");
   $("#search-info").css("width", "400px");
}

function closeResultsSlider() {
   var searchInfo = $('#search-info');

   if (searchInfo.hasClass('visible')) {
      var width = $(window).width();
      searchInfo.animate({"left":(width-400).toString()+"px"}, "slow").removeClass('visible');
      currentResortName = "";
   }
}

function fillResortExtendedInfo(resortName) {
   var resort = getResort(resortName);

   var mon = resort.weekdayHours;
   var tues = resort.weekdayHours;
   var wed = resort.weekdayHours;
   var thur = resort.weekdayHours;
   var fri = resort.weekdayHours;
   var sat = resort.weekendHours;
   var sun = resort.weekendHours;

   console.log("\n" + resortName + ": " + resort.operatingStatus);

   // Fill with actual data!!!
   setResortTitle(resort.resortName);
   setDrivingTime(resort.durationText);
   setOperatingStatus(resort.operatingStatus);
   setWeather(resort.weather);
   setSummitTemp(resort.summitTemp);
   setBaseTemp(resort.baseTemp);
   setSnowQuality(resort.snowQuality);
   setSnowfallChart(resort.recentSnowfall);
   setTrailsChart(resort.openRuns, resort.totalRuns);
   setLiftsChart(resort.openLifts);
   setPipesAndParks(resort.pipesAndParks);
   setTrailsBreakdownChart(resort.easyTrails,resort.intermediateTrails,resort.advancedTrails);
   setContactInfo(resort.address, resort.website, resort.phoneNumber, resort.snowPhoneNumber, resort.email, resort.trailMap);
   //setHours(mon,tues,wed,thur,fri,sat,sun);
   setHours(resort.weekdayHours, resort.weekendHours);

}

function setResortTitle(resortName) {
   $("#srei-resort-title").text(resortName);  
}

function setOperatingStatus(status) {
   var color;
   status = status.trim();
   console.log("\"" + status + "\"");
   
   if (status == "Open") {
      color = "green";
      //$("#open-resort-info").removeClass("invisible");
   } else if (status=="Closed for Snow Sports") {
      color = "red";
      //$("#open-resort-info").addClass("invisible");
   } else if (status.startsWith("Plan To Open")) {
      color = "red";
      //$("#open-resort-info").addClass("invisible");
   } else if (status.startsWith("Reopen")) {
      color = "red";
      // $("#open-resort-info").addClass("invisible");
   } else if (status.toLowerCase()=="No Recent Info".toLowerCase()) {
      color = "red";
      // $("#open-resort-info").addClass("invisible");
   } else if (status.toLowerCase()=="Operating, No Details".toLowerCase()) {
      color = "orange";
      // $("#open-resort-info").addClass("invisible");
   } else if (status.toLowerCase()=="Open for Summer Fun".toLowerCase()) {
      color = "red";
      // $("#open-resort-info").addClass("invisible");
   } else {
      status = "Unknown";
      color = "red";
      // $("#open-resort-info").addClass("invisible");
   }
   
   $("#srei-operatingStatus").html(status);
   $("#srei-operatingStatus").css("color",color);
}

function setDrivingTime(drivingTime) {
   $("#srei-driving-time").html(drivingTime);
}

function setSnowfallChart(snowfall) {
   var maxSnowfall = 24.0;
   var percentage = (snowfall/maxSnowfall);

   if (percentage > 1.0) 
   {
      percentage = 1.0;
   };

   var inversePercentage = (1.0 - percentage) * 100.0;
   $("#srei-snowfall-graph-fill").css("height", "100%")
   $("#srei-snowfall-graph-fill").animate({"height":(inversePercentage.toString() + "%")}, "slow");

   $("#srei-snowfall-data").html(snowfall.toString() + " IN");
}

function setLiftsChart(openLifts) {
   var totalLifts = 36; // ******************** REPLACE LATER WITH RESORT DATA ********************
   var percentage = (openLifts/totalLifts);

   if (percentage > 1.0) 
   {
      percentage = 1.0;
   };

   var inversePercentage = (1.0 - percentage) * 100.0;
   $("#srei-lifts-graph-fill").css("height", "100%")
   $("#srei-lifts-graph-fill").animate({"height":(inversePercentage.toString() + "%")}, "slow");

   $("#srei-lifts-data").html(openLifts.toString());
}

function setTrailsChart(openTrails, totalTrails) {
   if (isNaN(totalTrails) || totalTrails === 0) {
      totalTrails = 1;
   };
   var percentage = (openTrails/totalTrails);

   if (percentage > 1.0) 
   {
      percentage = 1.0;
   };

   var inversePercentage = (1.0 - percentage) * 100.0;
   $("#srei-trails-graph-fill").css("height", "100%")
   $("#srei-trails-graph-fill").animate({"height":(inversePercentage.toString() + "%")}, "slow");

   $("#srei-trails-data").html(openTrails.toString());
}

function setTrailsBreakdownChart(easyTrails, intermediateTrails, advancedTrails) {
   // Reset the width and height so the graph does not zoom on subsequent calls of method
   $("#srei-trail-breakdown").attr({width: "259px", height: "300px"});
   var doughnutData = [
      {
         value : easyTrails,
         color: "#669933",
         title : "Easy Trails",
      },
      {
         value : intermediateTrails,
         color: "#006699",
         title : "Intermediate Trails",
      },
      {
         value : advancedTrails,
         color: "#000000",
         title : "Advanced Trails",
      },
   ];

   var options = {
         animateRotate : true,
         animateScale : false,
         animationByData : false,
         animationSteps : 50,
         graphTitle : "Trail Breakdown",
         legend : true,
         legendBorders : false,
         legendBlockSize : 12,
         inGraphDataShow : true,
         inGraphDataTmpl : "<%=v2%>",
         inGraphDataFontColor : "#333333",
         animationEasing: "linear",
         annotateDisplay : false,
         spaceBetweenBar : 5,
         graphTitleFontSize: 18,
   }
   var trailBreakdown= document.getElementById("srei-trail-breakdown").getContext("2d");
   var myDoughnut = new Chart(trailBreakdown).Doughnut(doughnutData,options);
}

function setWeather(weather) {
   //Change the image based on the weather
   var weatherImage = "";
   switch (weather) {
      case 'Sunny':
      case 'Clear':
      case 'Fair':
         weatherImage = "../images/sunny.png";
         break;

      case 'Cloudy':
      case 'Increasing Clouds':
      case 'Overcast':
      case 'Fog':
         weatherImage = "../images/cloudy.png";
         break;

      case 'Partly Cloudy':
      case 'Mostly Cloudy':
      case 'Clearing':
      case 'Mostly Clear':
      case 'Mixed Cloud/Sun':
      case 'Mostly Sunny':
      case 'Partly Sunny':
         weatherImage = "../images/partly-cloudy.png";
         break;

      case 'Rain':
      case 'Drizzle':
      case 'Freezing Rain':
      case 'Light Rain':
      case 'Rain Showers':
      case 'Mixed Precip':
         weatherImage = "../images/rain.png";
         break;

      case 'Snow':
      case 'Flurries':
      case 'Heavy Snow':
      case 'Light Snow':
      case 'Snow Showers':
      case 'Snow Squalls':
         weatherImage = "../images/snow.png";
         break;

      case 'Sleet':
         weatherImage = "../images/sleet.png";
         break;
   }

   $("#srei-weather-icon").css("background-image", "url(" + weatherImage + ")");
   $("#srei-weather-text").html(weather);                 
}

function setSummitTemp(temp) {
   $("#srei-summit-temp").html(temp.toString() + "°F");
}

function setBaseTemp(temp) {
   $("#srei-base-temp").html(temp.toString() + "°F");
}

function setSnowQuality(snowQuality) {
   $("#srei-snow-quality").html(snowQuality);
}

function setPipesAndParks(text) {
   $("#srei-pipes-and-parks").html(text);
}

function setContactInfo(address, website, phoneNumber, snowPhoneNumber, email, trailMap) {
   var addressHtml = "";
   var addressLines = address.split("\n");
   for (var i = 0; i < addressLines.length; i++) {
      addressHtml += "<p>" + addressLines[i] + "</p>";
   };
   
   $("#srei-address").html(addressHtml);
   $("#srei-website").html("<a href=\"" + website + "\">" + website + "</a>");
   $("#srei-phone-number").html(phoneNumber);
   $("#srei-snow-phone-number").html(snowPhoneNumber);
   $("#srei-email").html("<a href=\"mailto:" + email + "\">" + email + "</a>");
   $("#srei-trail-map").html("<a href=\"" + trailMap + "\">Resort Trail Map</a>");
}

// function setHours(mon,tues,wed,thur,fri,sat,sun) {
//    $("#srei-hours-mon").html(mon);
//    $("#srei-hours-tues").html(tues);
//    $("#srei-hours-wed").html(wed);
//    $("#srei-hours-thur").html(thur);
//    $("#srei-hours-fri").html(fri);
//    $("#srei-hours-sat").html(sat);
//    $("#srei-hours-sun").html(sun);
// }

function setHours(weekday, weekend) {
   $("#srei-hours-weekday").html(weekday);
   $("#srei-hours-weekend").html(weekend);
}

function resize (argument) {
   setContentSize();
}


function getResortData () {
   $('div#resortData>div').each(function() { 
      var operatingStatus = "";
      var weather = "Cloudy";
      var summitTemp = 20;
      var baseTemp = 30;
      var snowQuality = "Variable Conditions";
      var snowfall = 10;
      var openTrails = 90;
      var openLifts = 12;
      var pipesAndParks = "Halfpipe open. Last cut 12/22/2014.";
      var easyTrails = 8;
      var intermediateTrails = 12;
      var advancedTrails = 3;


      var address = "4545 Blackcomb Way\nWhistler, British Columbia V0N 1B4\nCanada";
      var website = "whistlerblackcomb.com";
      var phoneNumber = "1 (800) 766-0449";
      var snowPhoneNumber = "1 (604) 687-7507";
      var email = "wbres@whistlerblackcomb.com";
      var trailMap = "http://www.whistlerblackcomb.com/mountain/maps/index.htm";

      var weekdayHours = "8:00am - 3:00pm";
      var weekendHours = "8:00am - 3:00pm";

      var resort = new Resort(
         $(this).find(".resortName").text(),
         parseFloat($(this).find(".latitude").text()),
         parseFloat($(this).find(".longitude").text()),
         parseInt($(this).find(".openRuns").text()),
         parseInt($(this).find(".totalRuns").text()),
         parseFloat($(this).find(".recentSnowfall").text()),
         $(this).find(".operatingStatus").text(),
         $(this).find(".weather").text(),
         parseFloat($(this).find(".summitTemp").text()),
         parseFloat($(this).find(".baseTemp").text()),
         $(this).find(".snowQuality").text(),
         parseInt($(this).find(".openLifts").text()),
         $(this).find(".pipesAndParks").text(),
         parseInt($(this).find(".easyTrails").text()),
         parseInt($(this).find(".intermediateTrails").text()),
         parseInt($(this).find(".advancedTrails").text()),
         $(this).find(".address").text(),
         $(this).find(".website").text(),
         $(this).find(".phoneNumber").text(),
         $(this).find(".snowPhoneNumber").text(),
         $(this).find(".email").text(),
         $(this).find(".trailMap").text(),
         $(this).find(".weekdayHours").text(),
         $(this).find(".weekendHours").text() 
      );

      //alert($(this).find(".weather").text());

      console.log($(this).find(".resortName").text() + ": " + $(this).find(".email").text());
      
      resorts[resorts.length] = resort;
   });
}

 function getOrigin () {
   origin = new Origin(
         $(".originLat").text(),
         $(".originLong").text()
   );
 }

function getSearchResultDiv(resortName) {
   return $( "h2:contains('" + resortName + "')" ).parent().parent();
}

function initializeMap () {
   var mapCanvas = document.getElementById('map-canvas');
   var mapOptions = {
      center: new google.maps.LatLng(35.282752, -120.659616),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   map = new google.maps.Map(mapCanvas, mapOptions);
   var infowindow = new google.maps.InfoWindow();

   var latlngbounds = new google.maps.LatLngBounds();
   
   for (var i = resorts.length - 1; i >= 0; i--) {
      var myLatlng = new google.maps.LatLng(resorts[i].latitude, resorts[i].longitude);
      var marker = new google.maps.Marker({
         position: myLatlng,
         title: resorts[i].resortName,
         content: resorts[i].getWindowHTML()
      });
      marker.setMap(map);
      markers[markers.length] = marker;
      latlngbounds.extend( marker.getPosition() );
 

      // On click of marker show infobox and set search result background color
      google.maps.event.addListener(marker, 'click', function() {
         infowindow.setContent(this.content);
         infowindow.open(map, this);
         var resortName = this.title;
         var resortDiv = getSearchResultDiv(resortName);
         resortDiv.css("background-color", "#ecf0f1");
      });

      // On close of marker, clear search result background colors
      google.maps.event.addListener(infowindow,'closeclick', function() {
         $(".search-results").css("background-color", "transparent");
      });

   };

   // Show user location
   var image = "../images/user-location.png";
   var myLatlng = new google.maps.LatLng(origin.latitude, origin.longitude);
   var marker = new google.maps.Marker({
      position: myLatlng,
      title: "My Location",
      icon: image
   });
   marker.setMap(map);
   markers[markers.length] = marker;
   latlngbounds.extend( marker.getPosition() );

   if (resorts.length == 0 ){
      var tempStr = latlngbounds.toUrlValue();
      var arrayLatLng = tempStr.split(",",2);

      var noResortLat = parseFloat(arrayLatLng[0]);
      var noResortLng = parseFloat(arrayLatLng[1]);

      console.log("noResortLat: ", noResortLat);
      console.log("noResortLng: ", noResortLng);

      var nrSW = new google.maps.LatLng(noResortLat - 0.4, noResortLng - 0.7);
      var nrNE = new google.maps.LatLng(noResortLat + 0.4, noResortLng + 0.7);
      latlngbounds.extend( nrSW );
      latlngbounds.extend( nrNE );
   }   

   map.fitBounds( latlngbounds );

   google.maps.event.addListener(map, 'click', function() {
      closeResultsSlider();
  });
}

function getMarker(resortName) {
   for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == resortName)
         return markers[i];
   }
}

function getResort(resortName) {
   var result = $.grep(resorts, function(r){ return r.resortName === resortName; });
   return result[0];
}

function initializeMouseovers () {
   for (var i = 0; i < resorts.length; i++) {
      var resortName = resorts[i].resortName;
      var resortDiv = getSearchResultDiv(resortName);
      var infowindow = new google.maps.InfoWindow();
      
      resortDiv.mouseover(function() {
         $(this).css("background-color", "#ecf0f1");
         var resortName = $(this).find("h2").text();
         //alert(resortName);
         var marker = getMarker(resortName);
         infowindow.setContent(marker.content);
         infowindow.open(map, marker);
      });
      resortDiv.mouseleave(function() {
         $(this).css("background-color", "transparent");
         infowindow.close();
      });
   };
}

var newAddress;
var newRange;
var criteria;
var isOpen;

$('#basic_search_input').change(function() {
      newAddress = $("#basic_search_input").val();
      console.log("new address: ", newAddress);
});

$('#range').change(function() {
      textRange = $( "#range option:selected" ).text();

      if (textRange == "50 mi") {
         newRange = 50; 
      } else if (textRange == "100 mi") {
         newRange = 100;
      } else if (textRange == "200 mi") {
         newRange = 200;
      } else {
         newRange = 50;
      }

      console.log("range selected: ", newRange);
});

$('#search-by').change(function() {
      criteria = $( "#search-by option:selected" ).text();

      if (criteria == "Open Runs") {
         criteria = "runs";
      } else if (criteria == "Recent Snowfall") {
         criteria = "snow";
      }

      console.log("range selected: ", criteria);
});

$('#open-resorts-checkbox').change(function(){
    isOpen = this.checked ? true : false;
    console.log("checkbox: ", isOpen);
});


$('#basic_search_input').keypress(function (e) {
    var key = e.which;
    if(key == 13) {
      advancedResortSearch();
    }    
});

$('#advanced-search').click(function() {
   console.log("advanced search");
   advancedResortSearch();
});

function getAddress() {
   newAddress = $("#basic_search_input").val();
}

function advancedResortSearch() {
   getAddress();
   console.log("advancedResortSearch()");

   // Replace all instances of non alphanumeric characters with '+'
   address = newAddress.replace(/[\W_]+/g, "+");
   console.log('advancedResortSearch, using address: ', address);

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

      var queryURI = '/resort_search' + '?latitude=' +  lat + '&longitude=' + lng + '&state=' + state + '&range=' + newRange + 
                                          '&address=' + newAddress + '&criteria=' + criteria + '&resStatus=' + isOpen;
      locationRedirect(queryURI);
   }); 
}

// Redirect to the user's location query
function locationRedirect(queryURI){
  var baseURL = window.location.origin;
  var fullURL = baseURL + queryURI;

  window.location.href = fullURL;
}

$(window).resize(resize);
