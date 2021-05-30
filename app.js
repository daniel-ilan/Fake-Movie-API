var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexController = require('./controllers/index');
var menuController = require('./controllers/menu');
var moviesController = require('./controllers/movies');
var addMovieController = require('./controllers/addMovie');

var checkPermissions = function (req, res, next) {
  const user = req.session.user;
  if (user) {
    const numOfTransactions = user.numOfTransactions;
    if (numOfTransactions === 0) {
      req.session.valid = false;
      return res.redirect('/');
    }
    return next();
  }
  return next();
};

var unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.url) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'Shh, its a secret!', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(unless('/', checkPermissions));
app.use('/', indexController);
app.use('/menu', menuController);
app.use('/movies', moviesController);
app.use('/addmovie', addMovieController);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
