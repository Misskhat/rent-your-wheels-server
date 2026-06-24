const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-zzrqarl-shard-00-00.5bt6oyo.mongodb.net:27017,ac-zzrqarl-shard-00-01.5bt6oyo.mongodb.net:27017,ac-zzrqarl-shard-00-02.5bt6oyo.mongodb.net:27017/?ssl=true&replicaSet=atlas-7zzccd-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Move database collections setup outside so they are accessible by routes
let carsCollection, bookingCollection, myListingCollection;

async function connectDB() {
  try {
    // Only connect if not already connected (Vercel reuses instances)
    if (!carsCollection) {
      await client.connect();
      const database = client.db("rentYourWheels");
      carsCollection = database.collection("cars");
      bookingCollection = database.collection("bookingData");
      myListingCollection = database.collection("myListing");
      console.log("Connected to MongoDB Successfully!");
    }
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

// Global Middleware to ensure DB connection exists before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Cars API's
app.get("/cars", async (req, res) => {
  const result = await carsCollection.find().sort({ price: 1 }).toArray();
  res.send(result);
});

app.get("/featured-cars", async (req, res) => {
  const result = await carsCollection
    .find()
    .sort({ price: 1 })
    .limit(6)
    .toArray();
  res.send(result);
});

app.get("/cars/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await carsCollection.findOne(query);
  res.send(result);
});

app.post("/cars", async (req, res) => {
  const newCar = req.body;
  const result = await carsCollection.insertOne(newCar);
  res.send(result);
});

// Booking API's
app.get("/bookings", async (req, res) => {
  const userEmail = req.query.email;
  const result = await bookingCollection.find({ email: userEmail }).toArray();
  res.send(result);
});

app.post("/bookings", async (req, res) => {
  const bookingData = req.body;
  const result = await bookingCollection.insertOne(bookingData);
  res.send(result);
});

app.delete("/bookings/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bookingCollection.deleteOne(query);
  res.send(result);
});

// My Listing API's
app.get("/myListings", async (req, res) => {
  const userEmail = req.query.email;
  const query = { email: userEmail };
  const result = await carsCollection.find(query).toArray();
  res.send(result);
});

app.patch("/myListings/:id", async (req, res) => {
  const id = req.params.id;
  const updateMyListing = req.body;
  const query = { _id: new ObjectId(id) };
  const updated = { $set: updateMyListing };
  const result = await myListingCollection.updateOne(query, updated);
  res.send(result);
});

app.delete("/myListings/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await myListingCollection.deleteOne(query);
  res.send(result);
});

// Keep local server operational
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port number ${port}`);
  });
}

// CRITICAL FOR VERCEL
module.exports = app;
