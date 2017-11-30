const mongoose = require('mongoose');

exports.loginForm = (res, req) => {
  res.render('login', { title: 'Login' } );
};