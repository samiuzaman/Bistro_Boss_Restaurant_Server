const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkh8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("Bistro-Boss-Restaurant");
    const menuCollection = db.collection("Menu");
    const reviewsCollection = db.collection("Reviews");
    const cartCollection = db.collection("Carts");

    app.get("/menu", async (req, res) => {
      const menu = await menuCollection.find().toArray();
      res.send(menu);
    });

    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find().toArray();
      res.send(reviews);
    });

    // Post Cart Item
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      console.log("email:", email);
      console.log("query: ", query);
      const carts = await cartCollection.find(query).toArray();
      res.send(carts);
    });

    // Post Cart Item
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const cart = await cartCollection.insertOne(cartItem);
      res.send(cart);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro Boss Restaurant Server");
});

app.listen(port, () => {
  console.log(`Bistro boss is server is running port ${port}`);
});
