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

router.get('/:id', function(req, res, next) {
  const userId = req.params.id;
  req.app.locals.db.collection('users').findOne({ _id: userId }, { projection: { password: 0}}).toArray()
  .then(user => {
    if (!user) {
      res.status(404).json({error: 'Användaren kan inte hittas'});
      return;
    }
    res.json(user);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  })
});

module.exports = router;
