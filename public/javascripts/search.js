$(document).ready(function() {
   setContentSize();
   initializeMap();
});

function setContentSize () {
   var height = $(window).height();
   var width = $(window).width();
   $("#content").css("height", (height - 100).toString() + "px");
   $("#content").css("width", width.toString() + "px");

   $("#map-canvas").css("width", (width-400).toString() + "px");
}

function resize (argument) {
   setContentSize();
}

function initializeMap () {
   var mapCanvas = document.getElementById('map-canvas');
   var mapOptions = {
      center: new google.maps.LatLng(35.282752, -120.659616),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   }
   var map = new google.maps.Map(mapCanvas, mapOptions);
}


$(window).resize(resize);