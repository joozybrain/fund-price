const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  price: Number
});

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
