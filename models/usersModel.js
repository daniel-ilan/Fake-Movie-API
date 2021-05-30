const usersDal = require('../DAL/UsersDal');

const getMasterUsers = () => {
  const allUsers = usersDal.getUsersFromDb();
  const allUsersData = JSON.parse(allUsers);
  return allUsersData;
};

exports.getUserByCredentials = (name, password) => {
  const allUsersData = getMasterUsers();
  const user = allUsersData.find((user) => user.username === name && user.password === password);

  if (user) {
    return user;
  }
  return false;
};

exports.getUserById = (id) => {
  const allUsersData = getMasterUsers();
  const user = allUsersData.find((user) => user.id === id);

  if (user) {
    return user;
  }
  return false;
};

exports.getAllUsersData = () => {
  const allUsersData = getMasterUsers();
  const usersNames = allUsersData.map((user) => {
    return {
      username: user.username,
      id: user.id,
    };
  });
  return usersNames;
};

exports.addNewUser = (username, password) => {
  const allUsersData = getMasterUsers();
  const createdDate = new Date(Date.now()).toLocaleString().split(',')[0];
  const lastID = Math.max.apply(
    Math,
    allUsersData.map((user) => user.id),
  );

  const userData = {
    id: lastID + 1,
    username,
    password,
    createdDate,
    numOfTransactions: 2,
    privileges: 'user',
  };

  allUsersData.push(userData);
  usersDal.writeUsersToDb(allUsersData);
};

exports.updateUser = (id, newData) => {
  const { username, password } = newData;
  const allUsersData = getMasterUsers();
  const user = allUsersData.find((user) => user.id === id);
  user['username'] = username;
  user['password'] = password;

  usersDal.writeUsersToDb(allUsersData);
};

exports.deleteUser = (id) => {
  const allUsersData = getMasterUsers();
  const userIndex = allUsersData.findIndex((user) => user.id === id);
  allUsersData.splice(userIndex, 1);

  usersDal.writeUsersToDb(allUsersData);
};
