const mongoose = require("mongoose");

const RegionL1 = mongoose.model(
  "RegionL1",
  new mongoose.Schema({
    _id: { type: String },
    name: { type: String },
    country: { type: String, ref: "Country" }
  })
);

module.exports = RegionL1;