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
};

exports.getStores = async (req, res) => {
  // 1. Query the database for list of all stores
  const stores = await Store.find();

  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  // 1. Find store given ID
  const store = await Store.findOne({ _id: req.params.id });

  // 2. TODO: Only allow edit if owner of store

  // 3. Show edit form so the user can update the store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the updated data instead of old data
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`);
  res.redirect(`/stores/${store._id}/edit`);
};