var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.locals.db.collection('users').find({}, { projection: { password: 0}}).toArray()
  .then(results => {
    console.log(results);
    res.json(results);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  })
});

// Skapa user 
router.post('/add', (req, res) => {
  const user = req.body;

  req.app.locals.db.collection('users').insertOne(user)
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({err: 'Could not create new user'})
  })
})


module.exports = router;
