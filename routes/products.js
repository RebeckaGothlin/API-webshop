var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.app.locals.db.collection('products').find().toArray()
    .then(results => {
        console.log(results);
        res.status(200).json(results);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    })
});


module.exports = router;
