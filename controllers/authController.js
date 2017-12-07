const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) =>{
  req.logout();
  req.flash('success', 'You are now logged out! 👋🏻');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // First check if ther user is authenticated
  if(req.isAuthenticated()){
    next();
    return;
  }

  req.flash('error', 'Oops you must be logged in to do that! 🛑');
  res.redirect('/login');
};

exports.forgotPassword = async (req, res) => {

  // 1. See if user has an email/account
  const user = await User.findOne({ email: req.body.email });

  if(!user) {
    req.flash('error', 'No account with that email exists');
    return res.redirect('/login');
  }

  // 2. Set reset token and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  user.save();

  // 3. Send them an email with the token
  const resetURL = `http://${req.header.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', 'You have been emailed a password reset link.');

  // 4. Redirect to login page
  res.redirect('/login');
};

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  // If there is a user, show the reset password form
  res.render('reset', { title: 'Reset your Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    next(); // Keep going
    return;
  }

  req.flash('error', 'Passwords do not match!');
  res.redirect('back'); // Go back to reset form url
};

exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);

  req.flash('success', '💃🏻 Awesome! Your password has been reset, you are now logged in!');
  res.redirect('/');
};