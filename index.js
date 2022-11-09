const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xloj4nu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        // service collection
        const serviceCollection = client
            .db("dental-care")
            .collection("services");

        // reviews collection
        const reviewsCollection = client
            .db("dental-care")
            .collection("reviews");

        // service api (get/read data [get])
        // get data from database (all)

        app.get("/home/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // get specific data
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // reviews api

        // create data (post)
        app.post("/reviews", async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews);
            res.send(result);
        });

        // read reviews

        app.get("/reviews", async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }
            console.log(query);
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
    } finally {
    }
}

run().catch((e) => console.log(e));

app.get("/", (req, res) => {
    res.send("Dental care server is running...");
});

app.listen(port, () => {
    console.log(`Dental Care server running on ${port}`);
});
