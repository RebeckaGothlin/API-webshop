var express = require('express');
const { ObjectId } = require('mongodb');
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

router.get('/:id', (req,res) => {    
    const productId = req.params.id;

    req.app.locals.db.collection('products').findOne({ _id: new ObjectId(productId)})
        .then(product => {
            if (!product) {
                res.status(404).json({ error: 'Produkten kan inte hittas'})
                return;
            }
            res.status(200).json(product);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        })
})


module.exports = router;
