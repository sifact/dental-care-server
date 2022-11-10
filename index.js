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

        // read user specified reviews

        app.get("/reviews", async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }

            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // read service specified reviews
        app.get("/reviews/service", async (req, res) => {
            let query = {};

            if (req.query.service) {
                query = {
                    service: req.query.service,
                };
            }

            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // delete specific review
        app.delete("/reviews/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // service collection
        const serviceCollection = client
            .db("dental-care")
            .collection("services");

        // reviews collection
        const reviewsCollection = client
            .db("dental-care")
            .collection("reviews");

        // read specified reviews
        app.get("/r/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await reviewsCollection.findOne(query);
            res.send(service);
        });

        // update data:
        // receive data (in server) from client
        app.put("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            console.log(review);
            const option = { upsert: true };
            const updateReview = {
                $set: {
                    userName: review.userName,

                    email: review.email,
                    review: review.review,
                },
            };
            const result = await reviewsCollection.updateOne(
                filter,
                updateReview,
                option
            );
            console.log(result);
            res.send(result);
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
