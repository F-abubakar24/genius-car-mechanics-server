const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require("dotenv").config();

const app = express();
const port = 5000;

// middle ware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.of2la.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ---------------------------------------------------------------
// DATABASE connection main function;
async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

    // POST api
        app.post("/services", async (req, res) => {
            const result = await servicesCollection.insertOne(req.body);
            res.json(result)
        });

    // GET api
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
    
    // GET SINGLE api
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })
    // DELETE api
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
// ---------------------------------------------------------------

// ---------------------------------------------------------
// ---------------------------------------------------------
app.get("/", (req, res) => {
    res.send("Car genius server is running");
});
app.listen(port, () => {
    console.log("The server is running from -------------> ", port);
});
