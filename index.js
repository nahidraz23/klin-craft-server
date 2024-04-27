const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5300;
const { MongoClient, ServerApiVersion } = require('mongodb');

//Middleware
app.use(express.json());
app.use(cors());

//MongoDB 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hersl30.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    
    const usersCollection = client.db('klincraftDB').collection('users');
    const itemsCollection = client.db('klincraftDB').collection('items');

    app.get('/users', async(req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/items', async(req, res) => {
      const cursor = itemsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/items', async(req, res) => {
      const items = req.body;
      console.log(items)
      const result = await itemsCollection.insertOne(items);
      res.send(result);
    })

    app.post('/users', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//Local server checking
app.get('/', (req, res) => {
    res.send("Welcome to klin craft server");
})

app.listen(port, () => {
    console.log(`This server is running on port: ${port}`);
})