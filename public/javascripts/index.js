$(document).ready(function() {
	initializeClickListeners();
});

function initializeClickListeners() {
	$(".clickableRow").click(function() {
		console.log("Row clicked");
		window.document.location = $(this).attr("href");
	});
}