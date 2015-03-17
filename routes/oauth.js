var express = require('express');
var passport = require('passport');
var googleStrat = require('passport-google-openidconnect').Strategy;

var router = express.Router();
var util = require('util');
var googleId = process.env.GOOGLE_CLIENT_ID || '372516786880-mgkj8fh3arto5ife2ma57i6uil5npusr.apps.googleusercontent.com';
var googleSecret = process.env.GOOGLE_CLIENT_SECRET || 'GyKAsiUbkgDFiBk9gtfjKuhF';
//needed?
var sRealm = process.env.REALM || 'http://localhost:3000/';
var rUri = process.env.REDIRECT_URI || 'http://localhost:3000/oauth/callback';

var rUriGoogle = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth/google/callback';



//
// Gogole OpenID Connect client information 
//
var gOpenID = new googleStrat({
  clientID : googleId,
  clientSecret : googleSecret,
  callbackURL : rUriGoogle,
  userInfoURL: "https://www.googleapis.com/plus/v1/people/me",
  openid : {realm: sRealm}
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    console.log("callback, profile: ", util.inspect(profile, false, null));
    var user = {};
    var err = "oauth callback error";
    if (profile && profile.displayName) {
        err = null;
        user.id = profile.id;
        user.profile = profile;
    }
    done(err, user);
  });

passport.use(gOpenID);
//setup passport stuff
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});


/* GET login salesforce page. */
router.get('/google', passport.authenticate('google-openidconnect'));
 

router.get('/google/callback', passport.authenticate('google-openidconnect', {failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

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
