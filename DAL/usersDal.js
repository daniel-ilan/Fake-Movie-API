const fs = require('fs');

exports.getUsersFromDb = () => {
  return fs.readFileSync('db/Users.json');
};

exports.writeUsersToDb = (userData) => {
  return fs.writeFileSync('db/Users.json', JSON.stringify(userData));
};
