const axios = require('axios');
const fs = require('fs');

exports.getMoviesFromRest = () => {
  return axios.get('https://api.tvmaze.com/shows');
};

exports.getMoviesFromDb = () => {
  return fs.readFileSync('db/NewMovies.json');
};

exports.writeMoviesToDb = (movies) => {
  return fs.writeFileSync('db/NewMovies.json', JSON.stringify(movies));
};
