var map;
var origin = {};
var resorts = [];
var markers = [];
var currentResortName = "";

function Resort (resortName, latitude, longitude, openRuns, totalRuns, recentSnowfall) {
   this.resortName = resortName.trim();
   this.latitude = latitude;
   this.longitude = longitude;
   this.openRuns = isNaN(openRuns) ? "unknown" : openRuns;
   this.totalRuns = isNaN(totalRuns) ? "unknown" : totalRuns;
   this.recentSnowfall = isNaN(recentSnowfall) ? "unknown" : recentSnowfall;
   this.duration = "";

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
   initializeCharts();
   
   var resultExtendedInfo = $("#result-extended-info");
   resultExtendedInfo.css("display", "none");
});

function initializeCharts () {
   var doughnutData = [
      {
         value : 20,
         color: "#669933",
         title : "Easy Trails",
      },
      {
         value : 40,
         color: "#006699",
         title : "Intermediate Trails",
      },
      {
         value : 10,
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
   $("#srei-resort-title").text(resort.resortName);
}

function resize (argument) {
   setContentSize();
}

function getResortData () {
   $('div#resortData>div').each(function() { 
      var resort = new Resort(
         $(this).find(".resortName").text(),
         parseFloat($(this).find(".latitude").text()),
         parseFloat($(this).find(".longitude").text()),
         parseInt($(this).find(".openRuns").text()),
         parseInt($(this).find(".totalRuns").text()),
         parseFloat($(this).find(".recentSnowfall").text())
      );
      
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

$('#advanced-search').click(function() {
   console.log("advanced search");
   advancedResortSearch();
});

function advancedResortSearch() {
   console.log("advancedResortSearch()");

   // Replace all instances of non alphanumeric characters with '+'
   address = newAddress.replace(/[\W_]+/g, "+");

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

      var queryURI = '/resort_search' + '?latitude=' +  lat + '&longitude=' + lng + '&state=' + state + '&range=' + newRange;
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