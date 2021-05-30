const dal = require('../DAL/moviesREST');

const getAllMovies = async () => {
  const restMovies = await dal.getMoviesFromRest();
  const restMoviesData = restMovies.data;

  const dbMovies = dal.getMoviesFromDb();
  const dbMoviesData = JSON.parse(dbMovies);
  return restMoviesData.concat(dbMoviesData);
};

exports.getMasterMovies = async () => {
  try {
    const allMovies = await getAllMovies();
    const moviesGenres = allMovies.map((movie) => movie.genres);
    const organizedGenres = [].concat.apply([], moviesGenres);
    const uniqueGenres = [...new Set(organizedGenres)];

    const languages = [...new Set(allMovies.map((movie) => movie.language))];

    return { allMovies, genres: uniqueGenres, languages };
  } catch (err) {
    console.log(err);
  }
};

exports.getMoviesByGenre = (genre, movies) => {
  const filteredMovies = movies.filter((movie) => movie.genres.includes(genre));
  return filteredMovies;
};

exports.getMoviesByLanguage = (language, movies) => {
  const filteredMovies = movies.filter((movie) => movie.language === language);
  return filteredMovies;
};

exports.getMoviesByName = (name, movies) => {
  const filteredMovies = movies.filter((movie) => movie.name.toLowerCase().includes(name.toLowerCase()));
  return filteredMovies;
};

exports.getMovieById = async (id) => {
  const allMovies = await getAllMovies();
  const movie = allMovies.find((movie) => movie.id === id);

  return movie;
};

exports.addMovieToDb = (movieData) => {
  const rawdata = dal.getMoviesFromDb();
  const newMovies = JSON.parse(rawdata);

  const lastID = Math.max.apply(
    Math,
    newMovies.map((movie) => movie.id),
  );

  const newMovie = {
    name: movieData.movieName,
    id: lastID + 1,
    genres: movieData.genresArr,
    language: movieData.language,
  };
  newMovies.push(newMovie);
  dal.writeMoviesToDb(newMovies);
};
