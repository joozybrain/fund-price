const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  price: String,
  user: String
});

const Price = mongoose.model("Price", priceSchema);

module.exports = Price;
