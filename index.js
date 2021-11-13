const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gbhkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('bike_store');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');

        console.log('Connected to database');
        // Show data 
        app.get('/products', async (req, res) => {

            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            // console.log(appointments);
            res.json(products)
        });
        //Add products
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log("hiiting post", service);
            const result = await productsCollection.insertOne(product);
            res.json(result);

        });
        //Admin create
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log('Hitting,', email)
            const filter = { email: email };
            const updateDoc = {
                $set: {
                    power: 'admin'
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // GET Dynamic API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id; // Dynamic ID ta nicche
            // console.log('hiiting to the backend id=', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            // console.log(product)
            res.json(product)

        });
        // Admin Check
        app.get('/users/:email', async (req, res) => {
            const emial = req.params.email // Dynamic ID ta nicche
            // console.log('hiiting to the backend id=', id);
            const query = { email: emial };
            const result = await usersCollection.findOne(query);
            console.log(result?.power)
            res.json(result?.power)

        });

        // Save User Information 

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);

        })
        // Save Orders Info 
        app.post('/orders', async (req, res) => {
            const user = req.body;
            const result = await ordersCollection.insertOne(user);
            // console.log(result);
            res.json(result);

        })
        //Single user Orders
        app.get('/orders', async (req, res) => {
            const email = req.query.email;

            // console.log("hitting with =", email);
            // console.log(date);
            const query = { email: email };
            const cursor = ordersCollection.find(query);
            const products = await cursor.toArray();
            // console.log(products);
            res.json(products)
        });
        app.get('/allorders', async (req, res) => {

            const cursor = ordersCollection.find({});
            const products = await cursor.toArray();
            // console.log(products);
            res.json(products)
        });
        //Delete API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });
        //Prodect delete
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });
        // Review stored 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            // console.log(result);
            res.json(result);

        });
        //Review Show

        app.get('/reviews', async (req, res) => {

            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            // console.log(reviews);
            res.json(reviews)
        });

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Bike Store Server is Running')
})

app.listen(port, () => {
    console.log('lisiting to port', port)
})
