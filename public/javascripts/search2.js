var map;
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

$(document).ready(function() {
   setContentSize();
   getResortData();
   initializeMap();
   initializeMouseovers();
});

function setContentSize () {
   var height = $(window).height();
   var width = $(window).width();
   $("#content").css("height", (height - 100).toString() + "px");
   $("#content").css("width", width.toString() + "px");

   $("#map-canvas").css("width", (width-400).toString() + "px");
   $("#search-bar").css("width", (width-300).toString() + "px");
   $("#search-collumn").css("height", (height-100).toString() + "px");
   
   $("#search-info").css("height", (height-100).toString() + "px");
   $("#search-info").css("width", (width-400).toString() + "px");
   $("#search-info").css("left", (width-400).toString() + "px");

   $("#result-extended-info").css("height", (height-100).toString() + "px");
   $("#result-extended-info").css("width", (width-800).toString() + "px");
}

function toggleResultsSlider(resortName) {
   var searchInfo = $('#search-info');

   if (searchInfo.hasClass('visible')) {
      // If the current resort is clicked, close the extended info
      if (currentResortName === resortName) {
         var width = $(window).width();
         searchInfo.animate({"left":(width-400).toString()+"px"}, "slow").removeClass('visible');
         currentResortName = "";
      }
      // Otherwise switch the data of the extended info
      else {
         fillResortExtendedInfo(resortName);
         currentResortName = resortName;
      }
    } 
    else {
      searchInfo.animate({"left":"400px"}, "slow").addClass('visible');
      fillResortExtendedInfo(resortName);
      currentResortName = resortName;
    }
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
   $("#sr-resort-title").text(resort.resortName);
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


$(window).resize(resize);