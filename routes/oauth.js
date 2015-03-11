var express = require('express');
var passport = require('passport');
var googleStrat = require('passport-google');

var router = express.Router();
var util = require('util');
var cId = process.env.CLIENT_ID || '372516786880-mgkj8fh3arto5ife2ma57i6uil5npusr.apps.googleusercontent.com';
var cSecret = process.env.CLIENT_SECRET || 'GyKAsiUbkgDFiBk9gtfjKuhF';
var rUri = process.env.REDIRECT_URI || 'http://localhost:3000/oauth/callback';



//
// OAuth2 client information 
//
var oauth2 = new googleStrat.Strategy({
  clientID : cId,
  clientSecret : cSecret,
  returnURL : rUri},
  function(accessToken, refreshToken, profile, done) {
    console.log("callback, profile: ", util.inspect(profile, false, null));
    var user = {};
    var err = "oauth callback error";
    if (profile.url) {
        err = null;
        user.id = profile.url;
    }
    done (err, user);
    
});

passport.use('google', oauth2);



/* GET login salesforce page. */
router.get('/google', passport.authenticate('google'));
 

router.get('/callback', passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/login' }))

// This gets run upon successful authentication to Salesforce.
// Save the users accessToken and instanceURL for usage across
// the app.
// router.get('/callback', function(req, res) {
//     var conn = new jsforce.Connection({oauth2: oauth2});
//     var code = req.query.code;
//     conn.authorize(code, function(err, userInfo) {
//         if (err) { return console.error(err); }
 
//         console.log('Access Token: ' + conn.accessToken);
//         console.log('Instance URL: ' + conn.instanceUrl);
//         console.log('User ID: ' + userInfo.id);
//         console.log('Org ID: ' + userInfo.organizationId);

//         req.session.accessToken = conn.accessToken;
//         req.session.instanceUrl = conn.instanceUrl;
//         req.session.userId = userInfo.id;
//         req.session.orgId = userInfo.organizationId;

//         // Redirect to home page
//         res.redirect('/');
//     });
// });

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if(err) {
            return console.error(err);
        }
        
        console.log('User logged out');
        res.redirect('/');
    });
});

module.exports = router;
