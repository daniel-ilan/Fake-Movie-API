var express = require('express');
var router = express.Router();
var usersBl = require('../models/usersModel');
/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.valid === false) {
    req.flash('msg', 'You used all of your actions for today. please log back in tomorrow');
    res.locals.messages = req.flash();
  }

  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  const data = req.body;
  const { username, password } = data;
  const user = usersBl.getUserByCredentials(username, password);
  if (user) {
    req.session.user = user;
    req.session.valid = true;
    res.redirect('/menu');
  } else {
    req.flash('msg', 'name or password is incorrect');
    res.locals.messages = req.flash();
    res.render('index', { title: 'Express' });
  }
});

router.get('/users', function (req, res, next) {
  const allUsersData = usersBl.getAllUsersData();
  res.render('manageUsers', { allUsersData });
});

router.get('/users/new', function (req, res, next) {
  res.render('addUser', {});
});

router.post('/users/new', function (req, res, next) {
  const formData = req.body;
  const { username, password } = formData;
  try {
    usersBl.addNewUser(username, password);
    const allUsersData = usersBl.getAllUsersData();
    res.render('manageUsers', { allUsersData });
  } catch (err) {
    console.log(err);
  }
});

router.get('/users/update/:id', function (req, res, next) {
  const userId = parseInt(req.params.id);
  const userData = usersBl.getUserById(userId);
  res.render('updateUser', { userData });
});

router.post('/users/update/:id', function (req, res, next) {
  const formData = req.body;
  const { username, password } = formData;
  const userId = parseInt(req.params.id);
  try {
    usersBl.updateUser(userId, { username, password });
    const allUsersData = usersBl.getAllUsersData();
    res.render('manageUsers', { allUsersData });
  } catch (err) {
    console.log(err);
    res.render('updateUser', { userData });
  }
});

router.get('/users/delete/:id', function (req, res, next) {
  const userId = parseInt(req.params.id);
  try {
    usersBl.deleteUser(userId);
    const allUsersData = usersBl.getAllUsersData();
    res.render('manageUsers', { allUsersData });
  } catch (err) {
    console.log(err);
    res.render('updateUser', { userData });
  }
});

module.exports = router;
