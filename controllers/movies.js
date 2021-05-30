var express = require('express');
var router = express.Router();
const moviesBl = require('../models/moviesModel');

router.get('/:page', async function (req, res, next) {
  try {
    const { allMovies, genres, languages } = await moviesBl.getMasterMovies();
    const page = parseInt(req.params.page);
    const { moviesInPage, pages } = getPages(page, allMovies);
    res.render('movies', { moviesInPage, genres, languages, pages, selectedMoviesCount: allMovies.length });
  } catch (err) {
    console.log(err);
    next(new Error('No movies found :('));
  }
});

router.get('/filter/:page', async function (req, res, next) {
  try {
    const { genres, languages } = await moviesBl.getMasterMovies();
    const page = parseInt(req.params.page);
    const selectedMovies = req.session.selectedMovies;
    const { moviesInPage, pages } = getPages(page, selectedMovies);
    res.render('movies', { moviesInPage, genres, languages, pages, selectedMoviesCount: selectedMovies.length });
  } catch (err) {
    console.log(err);
    next(new Error('No movies found :('));
  }
});

router.post('/filter/:page', async (req, res, next) => {
  try {
    const formData = req.body;
    const page = parseInt(req.params.page);
    const { allMovies, genres, languages } = await moviesBl.getMasterMovies();
    let selectedMovies = allMovies;

    if ('genre' in formData && formData['genre'] !== '0') {
      selectedMovies = moviesBl.getMoviesByGenre(formData.genre, selectedMovies);
    }
    if ('movieName' in formData) {
      selectedMovies = moviesBl.getMoviesByName(formData.movieName, selectedMovies);
    }
    if ('language' in formData && formData['language'] !== '0') {
      selectedMovies = moviesBl.getMoviesByLanguage(formData.language, selectedMovies);
    }

    const { moviesInPage, pages } = getPages(page, selectedMovies);
    req.session.selectedMovies = selectedMovies;
    req.session.user.numOfTransactions--;
    res.render('movies', { moviesInPage, genres, languages, pages, selectedMoviesCount: selectedMovies.length });
  } catch {
    next(new Error('Issue in filter form results'));
  }
});

router.get('/info/:id', async function (req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const movie = await moviesBl.getMovieById(id);
    req.session.user.numOfTransactions--;
    res.render('movieInfo', { movie });
  } catch (err) {
    console.log(err);
    next(new Error('No movies with this id found :('));
  }
});

const getPages = (page, movies) => {
  let endIndex = page * 15;
  let startIndex = endIndex - 15;
  const pages = {};
  const moviesInPage = movies.slice(startIndex, endIndex);
  if (endIndex < movies.length) {
    pages.next = { page: page + 1 };
  }
  if (startIndex > 0) {
    pages.previous = { page: page - 1 };
  }
  return { pages, moviesInPage };
};

module.exports = router;
