const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.render('hello', {
    name: 'David',
    dog: 'Beesa'
  }); // Renders the hello template
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
