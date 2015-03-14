var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var dustHelper = require('dustjs-helpers');
var session = require('express-session');
var template_engine = 'dust';
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');

var app = express();

/*Set Dustjs as view engine*/
app.engine('dust', cons.dust);
app.set('template_engine', template_engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', template_engine);

//use middleware
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(session({secret: 'ssshhhhturnandburnssshhh'}));

//serve public resources
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//setup passport stuff
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(session({ secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,}));
app.use(passport.initialize());
app.use(passport.session());


//define routes
app.use('/', routes);
app.use('/oauth', oauth);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
