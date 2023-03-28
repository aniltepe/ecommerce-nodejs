const mongoose = require("mongoose");

const Country = mongoose.model(
  "Country",
  new mongoose.Schema({
    _id: { type: String },
    name: { type: String },
    preferredLangs: [ { type: String, ref: "Language" } ],
    level0: { type: String, ref: "RegionL0"},
    dialCode: { type: String },
    icon: { type: Buffer }
  })
);

module.exports = Country;