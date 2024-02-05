var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/all', function(req, res, next) {
    req.app.locals.db.collection('orders').find().toArray()
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
