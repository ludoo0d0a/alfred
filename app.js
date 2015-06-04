
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();
nconf.use('file', { file: path.join(__dirname, 'data/config.json') });
nconf.load();
// Provide default values for settings not provided above.
nconf.defaults({
    settings: {
        path: {
            download: '/volume1/download/',
            tvshow:   '/volume1/tvshows/',
            movie :   '/volume1/movies/'
        },
        delay: "12h",
        minsize: 50,
        minsize: -1
    }
});

var home = require('./routes/home');
var movies = require('./routes/movies');
var settings = require('./routes/settings');

var app = express();

app.nconf = nconf;

// view engine setup
app.engine('swig', swig.renderFile)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/settings', settings);
app.use('/movies', movies);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
