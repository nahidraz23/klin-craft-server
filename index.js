const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5300
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

//Middleware
app.use(express.json())
app.use(cors())

//MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hersl30.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const usersCollection = client.db('klincraftDB').collection('users')
    const itemsCollection = client.db('klincraftDB').collection('items')

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/items', async (req, res) => {
      const cursor = itemsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/items/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await itemsCollection.findOne(query)
      res.send(result)
    })

    app.get('/myCraft/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await itemsCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/subcategorydetails/:subcategory_Name', async (req, res) => {
      const subcategory_Name = req.params.subcategory_Name
      const query = { subcategory_Name: subcategory_Name }
      const result = await itemsCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/items', async (req, res) => {
      const items = req.body
      const result = await itemsCollection.insertOne(items)
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    // app.put('/items/:id', async (req, res) => {
    //   const id = req.params.id
    //   const filter = { _id: new ObjectId(id) }
    //   const updatedItem = req.body
    //   const item = {
    //     $set: {
    //       item_name: updatedItem.item_name,
    //       short_description: updatedItem.short_description,
    //       price: updatedItem.price,
    //       rating: updatedItem.rating,
    //       customization: updatedItem.customization,
    //       processing_time: updatedItem.processing_time,
    //       stock_status: updatedItem.stock_status,
    //       image: updatedItem.image,
    //       subcategory_Name: updatedItem.subcategory_Name
    //     }
    //   }
    //   const result = await itemsCollection.updateOne(filter, item)
    //   res.send(result)
    // })

    app.delete('/myartcraft/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await itemsCollection.deleteOne(query)
      res.send(result)
    })

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

//Local server checking
app.get('/', (req, res) => {
  res.send('Welcome to klin craft server')
})

app.listen(port, () => {
  console.log(`This server is running on port: ${port}`)
})
