const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

        // order collection
        // const orderCollection = client.db("dental-care").collection("orders");

        // service api (get/read data [get])
        // get data from database (all)

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // get specific data
        // app.get("/services/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const service = await serviceCollection.findOne(query);
        //     res.send(service);
        // });

        // orders api

        // create data (post)
        // app.post("/orders", async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.send(result);
        // });

        // read orders

        // app.get("/orders", async (req, res) => {
        //     const query = {};
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // });
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
