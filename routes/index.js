const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { catchErrors } = require('../handlers/errorHandlers');

// Creates our store index/archive pages
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));

// Controls the adding and editing of stores
router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));

// The actual store page
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoreByTag));

// Account
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgotPassword));
router.get('/account/reset/:token',
  catchErrors(authController.resetPassword)
);
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.updatePassword)
);

// Login
router.get('/login', userController.loginForm);
router.post('/login', authController.login);


// Register
router.get('/register', userController.registerForm);
router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
);

// Logout
router.get('/logout', authController.logout);

// Map
router.get('/map', storeController.mapPage);

// Hearts
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));

// Reviews
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

// Top
router.get('/top', catchErrors(storeController.getTopStores));

// API
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
