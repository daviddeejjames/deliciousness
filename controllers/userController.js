const mongoose = require('mongoose');

exports.loginForm = (res, req) => {
  req.render('login', { title: 'Login' } );
};

exports.registerForm = (res, req) => {
  req.render('register', { title: 'Register' });
};