exports.homePage = (req, res) => {
  res.render('index', {
    title: 'Hey there',
    name: 'David',
    dog: 'Beesa'
  });
};