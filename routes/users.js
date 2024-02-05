var express = require('express');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
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


router.post('/', async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await req.app.locals.db.collection('users').findOne({ _id: new ObjectId(userId)});

    if (!user) {
      res.status(404).json({error: 'Användaren kan inte hittas'})
      return;
    }

    res.json(user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'})
  }
})


// Skapa user 
router.post('/add', (req, res) => {
  const user = req.body;

  req.app.locals.db.collection('users').insertOne(user)
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ err: 'Could not create new user'})
  })
})

// Logga in user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await req.app.locals.db.collection('users').findOne({ email })

    if (!user) {
      res.status(404).json({ error: 'Användaren kan inte hittas'})
      return;
    }

    if (user.password === password) {
      res.status(200).json({ success: true, message: 'Inloggning lyckades'})
    } else {
      res.status(401).json({ error: 'Fel lösenord'})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'})
  }
})


module.exports = router;
