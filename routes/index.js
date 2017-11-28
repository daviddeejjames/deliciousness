const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');

const { catchErrors } = require('../handlers/errorHandlers');

// Creates our store index/archive pages
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// Controls the adding and editing of stores
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
