$(document).ready(function() {
  //hide the login popup on document load
  //$('#popup').hide();

   //init login/logout links
   $('#login-link').click(function() {
    
    console.log('login-link clicked');
    $("#popup").toggleClass('hide');
    $("#mask").toggleClass('hide');
   });
   $('#logout-link').click(function() {

      console.log('logout-link clicked');
      $('#session').hide();
      $('#login').show();
   });

});


/**
* Handler for the signin callback triggered after the user selects an account.
*/
function onSignInCallback(resp) {
   gapi.client.load('plus', 'v1', apiClientLoaded);
   $('#popup').toggleClass('hide');
   $('#mask').toggleClass('hide');
   
}

/**
* Sets up an API call after the Google API client loads.
*/
function apiClientLoaded() {
   gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
}

/**
* Response callback for when the API client receives a response.
*
* @param resp The API response object with the user email and profile information.
*/
function handleEmailResponse(resp) {
   var primaryEmail;

   if (resp.code === 403) {
      return;
   }
   console.log('email response: ' + JSON.stringify(resp));
   $('#gConnect').hide();
   for (var i=0; i < resp.emails.length; i++) {
     if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
   }

   //hide login links
   $('#login').hide();
   $('#session').toggleClass('hide');
   $('#session #username').text('user: ' + primaryEmail);
        // + '\n\nFull Response:\n' + JSON.stringify(resp);
    //hide popup
    $('#popup').hide();
   //load session data for logged-in user
}