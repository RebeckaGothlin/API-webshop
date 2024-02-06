const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Hämta alla ordrar
router.get('/all', (req, res) => {
    req.app.locals.db.collection('orders').find().toArray()
    .then (orders => {
        res.json(orders);
    })
});

// Skapa en order
router.post('/add', async (req, res) => {
    const { user, products } = req.body;

    // Loopa igenom produkterna i ordern
    for (const product of products) {
        const productId = product.productId;
        const quantity = product.quantity;

        // Hämta produkten från databasen
        const existingProduct = await req.app.locals.db.collection('products').findOne({ _id: new ObjectId(productId) });

        if (!existingProduct) {
            res.status(404).json({ error: `Produkten med id ${productId} kunde inte hittas` });
            return;
        }

        // Uppdatera lagerantalet
        const updatedQuantity = existingProduct.lager - quantity;

        // Kontrollera att lagerantalet inte blir negativt
        if (updatedQuantity < 0) {
            res.status(400).json({ error: `Lagerantalet för produkten med id ${productId} är inte tillräckligt` });
            return;
        }

        // Uppdatera produkten i databasen med det nya lagerantalet
        await req.app.locals.db.collection('products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: { lager: updatedQuantity } }
        );
    }

    // Skapa ordern
    const order = {
        user: user,
        products: products,
        createdAt: new Date()
    };

    // Spara ordern i databasen
    const result = await req.app.locals.db.collection('orders').insertOne(order);

    // Hämta det skapade objektet från databasen
    const createdOrder = await req.app.locals.db.collection('orders').findOne({ _id: result.insertedId });

    if (createdOrder) {
        res.status(201).json(createdOrder);
    } else {
        res.status(500).json({ error: 'Internt serverfel: Kunde inte hämta skapad order' });
    }
});

module.exports = router;