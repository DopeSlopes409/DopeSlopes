$(document).ready(function() {
   setContentSize();
});

function setContentSize () {
   var height = $(window).height();
   var width = $(window).width();
   $("#content").css("height", (height - 100).toString() + "px");
   $("#content").css("width", width.toString() + "px");
}

function resize (argument) {
   setContentSize();
}

$(window).resize(resize);