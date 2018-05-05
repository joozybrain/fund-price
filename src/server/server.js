const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Price = require("../model/price");
const app = express();

const mailer = require("../utils/email_service");

const PORT = process.env.PORT || 3001;

const fromAddress = "prualert@company.com";
const subject = "Price Alert";
const text = `Hi! Price has reached.`;
const toAddress = "joozybrain@yahoo.com";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/api/sendMail", (req, res) => {
  mailer.sendText(fromAddress, toAddress, subject, text);
  res.json("in server#app.get");
});

app.get("/api/getPrice/:user", (req, res) => {
  Price.findOne({ user: req.params.user })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/api/setPrice", (req, res) => {
  Price.findOneAndUpdate({ user: req.body.user }, req.body, {
    new: true,
    upsert: true
  })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
});

mongoose
  .connect("mongodb://localhost/fundprice")
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listening to the smooth sound on " + PORT);
    });
  })
  .catch(err => {
    console.log("Error connecting to db");
    console.log(err);
  });
