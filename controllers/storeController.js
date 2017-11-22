const mongoose = require('mongoose');
const Store = mongoose.model('Store'); // Already imported in app.js

exports.homePage = (req, res) => {
  res.render('index', {
    title: 'Hey there',
    name: 'David',
    dog: 'Beesa'
  });
};

exports.addStore = (req, res) => {
   res.render('editStore', {
    title: 'Add Store',
  });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  res.redirect('/');
}