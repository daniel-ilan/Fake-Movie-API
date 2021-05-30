var express = require('express');
var router = express.Router();
var moviesBl = require('../models/moviesModel');

router.get('/', function (req, res, next) {
  res.render('addMovie', {});
});

router.post('/', function (req, res, next) {
  const formData = req.body;

  const username = req.session.name;
  const password = req.session.password;
  const { movieName, language, genres } = formData;

  if (movieName !== '' && language !== '' && genres !== '') {
    const genresArr = genres.split(',');
    moviesBl.addMovieToDb({ movieName, language, genresArr });
  }
  req.session.user.numOfTransactions--;
  res.render('menu', { username, password });
});

module.exports = router;
