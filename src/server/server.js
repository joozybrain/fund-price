const express = require("express");
const Price = require("../model/price")
const app = express();

const mailer = require("../utils/email_service");

const PORT = process.env.PORT || 3001;

const fromAddress = "prualert@company.com";
const subject = "Price Alert";
const text = `Hi! Price has reached.`;
const toAddress = "joozybrain@yahoo.com";

app.get("/api/sendMail", (req, res) => {
  mailer.sendText(fromAddress, toAddress, subject, text);
  res.json("in server#app.get");
});

app.post("/api/setPrice", (req, res) => {
  
});

app.listen(PORT, function() {
  console.log("Listening to the smooth sound on " + PORT);
});
