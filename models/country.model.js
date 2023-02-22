const mongoose = require("mongoose");

const Country = mongoose.model(
  "Country",
  new mongoose.Schema({
    _id: { type: String },
    name: { type: String },
    preferredLang: { type: String, ref: "Locale" },
    dialCode: { type: String },
    displayOrder: { type: Number },
    icon: { type: Buffer }
  })
);

module.exports = Country;