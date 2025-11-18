const express = require("express");
const {MongoClient, ServerApiVersion} = require("mongodb");
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
    } finally {
        // leave blank
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`server running on port number ${port}`);
});
