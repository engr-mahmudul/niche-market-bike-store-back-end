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
        console.log('Connected to database');
        // Show data 
        app.get('/products', async (req, res) => {

            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            // console.log(appointments);
            res.json(products)
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
