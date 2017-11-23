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
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  // 1. Query the database for list of all stores
  const stores = await Store.find();

  res.render('stores', { title: 'Stores', stores });
}