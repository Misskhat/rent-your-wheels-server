const express = require("express");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

//TODO:confidential after create .env file it will be change
const uri = "mongodb+srv://simpleDBUser:mdzu-FMwmY3z3P@cluster0.5bt6oyo.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// middleware
app.use(cors());
app.use(express.json());

// test server running or not
app.get("/", (req, res) => {
    res.send("Server Running");
});

// mongoDb function and api's for project

async function run() {
    try {
        await client.connect();
        // sending ping for confirm mongodb connect
        await client.db("Admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // create car collection data base.
        const database = client.db("rentYourWheels");
        const carsCollection = database.collection("cars");
        const bookingCollection = database.collection("bookingData");

        // Cars API's

        app.get("/cars", async (req, res) => {
            const result = await carsCollection.find().sort({price: 1}).toArray();
            res.send(result);
        });

        app.get("/featured-cars", async (req, res) => {
            const result = await carsCollection.find().sort({price: 1}).limit(6).toArray();
            res.send(result);
        });

        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = {_id: new ObjectId(id)};
            const result = await carsCollection.findOne(query);
            res.send(result);
        });

        app.post("/cars", async (req, res) => {
            const newCar = req.body;
            const result = await carsCollection.insertOne(newCar);
            res.send(result);
        });

        // booking api's
        app.get("/bookings", async (req, res) => {
            const userEmail = req.query.email;
            const result = await bookingCollection.find({email: userEmail}).toArray();
            res.send(result);
        });

        app.post("/bookings", async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);
            res.send(result);
        });

        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
        // leave blank
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`server running on port number ${port}`);
});
