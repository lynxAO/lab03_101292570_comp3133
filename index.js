require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Restaurant = require("./models/RestaurantModel");

// Express Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection
mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database mongoDB Atlas Server");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// Routes
// Get All
app.get("/restaurants", async (req, res) => {
    try {
        let restaurants = await Restaurant.find({});
        res.status(200).send(restaurants);
    } catch (err) {
        res.status(500).send({ message: err });
    }
});

// Create Restaurant
app.post("/restaurants", async (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Body can not be empty",
        });
    }

    let restaurant = new Restaurant(req.body);
    console.log(restaurant);
    try {
        await restaurant.save();
        res.status(201).send({ status: 1, message: "Success", data: restaurant });
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err,
        });
    }
});

// Get by Cuisine
app.get("/restaurants/cuisine/:name", async (req, res) => {
    let cuisine = req.params.name;
    if (cuisine) {
        try {
            let restaurants = await Restaurant.find({ cuisine: cuisine });
            res.status(200).send(restaurants);
        } catch (err) {
            res.status(500).send({ message: err });
        }
    } else {
        res.status(400).send({ message: "Cuisine not found" });
    }
});

// Get All Restaurants (Limited Info)
app.get("/restaurants/limited", async (req, res) => {
    let restaurants = await Restaurant.find({});

    if (req.query.sortBy && req.query.sortBy.toLowerCase() == "desc") {
        restaurants = await Restaurant.find({}, { address: 0 }).sort({ restaurant_id: -1 });
    } else {
        restaurants = await Restaurant.find({}, { address: 0 }).sort({ restaurant_id: 1 });
    }

    try {
        res.status(200).send(restaurants);
    } catch (err) {
        res.status(500).send({ message: err });
    }
});

// Get By Cuisine but exclude City
app.get("/restaurants/:cuisine", async (req, res) => {
    let cuisine = req.params.cuisine;
    try {
        let restaurants = await Restaurant.find({ cuisine: cuisine, city: { $ne: "Brooklyn" } }, { address: 0, id: 0 }).sort({ name: 1 });
        res.status(200).send(restaurants);
    } catch (err) {
        res.status(500).send({ message: err });
    }
});

// Server Configuration
app.listen(process.env.port || 3000);
console.log("Web Server is listening at port " + (process.env.port || 3000));
