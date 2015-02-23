var map;
var resorts = [];

function Resort (resortName, latitude, longitude, openRuns, totalRuns, recentSnowfall) {
   this.resortName = resortName;
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

});

function setContentSize () {
   var height = $(window).height();
   var width = $(window).width();
   $("#content").css("height", (height - 100).toString() + "px");
   $("#content").css("width", width.toString() + "px");

   $("#map-canvas").css("width", (width-400).toString() + "px");
   $("#search-bar").css("width", (width-300).toString() + "px");
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

function initializeMap () {
   var mapCanvas = document.getElementById('map-canvas');
   var mapOptions = {
      center: new google.maps.LatLng(35.282752, -120.659616),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   map = new google.maps.Map(mapCanvas, mapOptions);
   var infowindow = new google.maps.InfoWindow();

   for (var i = resorts.length - 1; i >= 0; i--) {
      var myLatlng = new google.maps.LatLng(resorts[i].latitude, resorts[i].longitude);
      var marker = new google.maps.Marker({
         position: myLatlng,
         title: resorts[i].resortName,
         content: resorts[i].getWindowHTML()
      });
      marker.setMap(map);

      google.maps.event.addListener(marker, 'click', function() {
         infowindow.setContent(this.content);
         infowindow.open(map, this);
      });

   };
}


$(window).resize(resize);