const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    restaurant_id: { type: Number },
    name: { type: String },
    cuisine: { type: String },
    city: { type: String },
    address: { building: "String", street: "String", zipcode: { type: "Number", length: 5 } },
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
module.exports = Restaurant;
