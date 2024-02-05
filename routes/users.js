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



module.exports = router;
